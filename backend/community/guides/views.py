from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from guides.filters import GuideFilter
from guides.models import Guide
from guides.permissions import IsOwnerOrPublic
from guides.serializers import GuideSerializer, GuideUploadSerializer


class GuideViewSet(viewsets.ModelViewSet):
    queryset = Guide.objects.all().order_by('-published_at')
    serializer_class = GuideSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrPublic]
    filter_backends = [DjangoFilterBackend]
    filterset_class = GuideFilter

    def get_queryset(self):
        if self.action == 'list':
            user = self.request.user
            return super(GuideViewSet, self).get_queryset().filter(Q(private=False) | Q(owner=user.id))
        else:
            return super(GuideViewSet, self).get_queryset()

    def get_serializer_class(self):
        if self.action == 'create':
            return GuideUploadSerializer
        return GuideSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
