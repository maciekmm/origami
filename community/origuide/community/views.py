from rest_framework import viewsets, permissions

from origuide.community.models import Guide
from origuide.community.serializers import GuideSerializer


class GuideViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows guides to be viewed or edited.
    """
    queryset = Guide.objects.all().order_by('-published_at')
    serializer_class = GuideSerializer
    permission_classes = [permissions.IsAuthenticated]
