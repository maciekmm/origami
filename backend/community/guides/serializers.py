from django.db import transaction
from drf_base64.fields import Base64ImageField
from rest_framework import serializers

from guides.fields.foldfilefield import FoldFileField
from guides.fold import Fold
from guides.models import Guide
from guides.tasks import process_guide


class GuideReadSerializer(serializers.ModelSerializer):
    solved = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    owner_username = serializers.CharField(source='owner.username', required=False)

    class Meta:
        model = Guide
        read_only_fields = [
            'owner',
            'published_at',
            'animation_file',
            'steps',
            'status',
            'owner_username',
        ]
        fields = [
            'id',
            'owner',
            'name',
            'published_at',
            'steps',
            'guide_file',
            'thumbnail_file',
            'animation_file',
            'status',
            'private',
            'solved',
            'liked',
            'owner_username',
        ]

    def get_solved(self, obj):
        user = self.context['request'].user
        return obj.solved_by.filter(id=user.id).exists()

    def get_liked(self, obj):
        user = self.context['request'].user
        return obj.liked_by.filter(id=user.id).exists()


class GuideWriteSerializer(GuideReadSerializer):
    guide_file = FoldFileField()
    name = serializers.CharField(required=False)
    thumbnail_file = Base64ImageField(required=False)

    @transaction.atomic
    def create(self, validated_data):
        fold = Fold.from_fold_file(validated_data['guide_file'])
        guide = Guide.objects.create(**validated_data, name=fold.title, steps=fold.steps)
        transaction.on_commit(lambda: process_guide.delay(guide.pk))
        return guide

    @transaction.atomic
    def update(self, instance, validated_data):
        if validated_data.get('guide_file') is not None:
            fold = Fold.from_fold_file(validated_data['guide_file'])
            validated_data['name'] = fold.title
            validated_data['steps'] = fold.steps
            transaction.on_commit(lambda: process_guide.delay(instance.pk))

        return super(GuideWriteSerializer, self).update(instance, validated_data)
