from django.db import transaction
from rest_framework import viewsets

from core.models import Guide
from core.permissions import IsOwnerOrPublic
from core.serializers import GuideSerializer, GuideUploadSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly



class GuideViewSet(viewsets.ModelViewSet):
    queryset = Guide.objects.all().order_by('-published_at')
    serializer_class = GuideSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrPublic]

    def get_serializer_class(self):
        if self.action == 'create':
            return GuideUploadSerializer
        return GuideSerializer

    @transaction.atomic
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
