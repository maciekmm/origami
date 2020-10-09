from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from guides.filters import GuideFilter
from guides.models import Guide
from guides.permissions import IsOwnerOrPublic, UpdateAllowed, IsLoggedInForPersonalizedData
from guides.serializers import GuideReadSerializer, GuideWriteSerializer


class GuideViewSet(viewsets.ModelViewSet):
    queryset = Guide.objects.all().order_by('-published_at')
    serializer_class = GuideReadSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly,
        IsOwnerOrPublic,
        UpdateAllowed,
        IsLoggedInForPersonalizedData,
    ]
    filter_backends = [DjangoFilterBackend]
    filterset_class = GuideFilter

    def get_queryset(self):
        if self.action == 'liked':
            user = self.request.user
            return user.liked_guides.all()
        elif self.action == 'solved':
            user = self.request.user
            return user.solved_guides.all()
        else:
            return super(GuideViewSet, self).get_queryset()

    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'update' or self.action == 'partial_update':
            return GuideWriteSerializer
        return GuideReadSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False)
    def liked(self, request):
        return self.list(request)

    @action(detail=False)
    def solved(self, request):
        return self.list(request)
