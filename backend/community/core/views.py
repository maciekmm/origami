from django.db import transaction
from rest_framework import viewsets

from core.models import Guide
from core.serializers import GuideSerializer, GuideUploadSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly



class GuideViewSet(viewsets.ModelViewSet):
    queryset = Guide.objects.all().order_by('-published_at')
    serializer_class = GuideSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        print(self.action)
        if self.action == 'create':
            return GuideUploadSerializer
        return GuideSerializer

    @transaction.atomic
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
