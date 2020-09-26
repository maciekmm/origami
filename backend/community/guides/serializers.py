from django.conf import settings
from django.contrib.auth.models import Group
from django.db import transaction
from rest_framework import serializers

from guides.fields.foldfilefield import FoldFileField
from guides.fold import Fold
from guides.models import Guide

from guides.tasks import process_guide


class GuideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guide
        read_only_fields = ['owner', 'published_at', 'animation_file', 'steps']
        fields = '__all__'


class GuideUploadSerializer(GuideSerializer):
    guide_file = FoldFileField()
    name = serializers.CharField(required=False)

    @transaction.atomic
    def create(self, validated_data):
        fold = Fold.from_fold_file(validated_data['guide_file'])
        guide = Guide.objects.create(**validated_data, name=fold.title, steps=fold.steps)
        transaction.on_commit(lambda: process_guide.delay(guide.pk))
        return guide
