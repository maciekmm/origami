from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated

from guides.serializers import GuideWriteSerializer


class IsOwnerOrPublic(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user or not obj.private


class UpdateAllowed(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if view.action in ('update', 'partial_update'):
            if obj.owner == request.user:
                return True
            return set(request.data).issubset(set(GuideWriteSerializer.ALLOWED_PUBLIC_FIELDS))
        return True


class IsLoggedInForPersonalizedData(IsAuthenticated):
    def has_permission(self, request, view):
        if view.action in ('liked', 'solved'):
            return super(IsLoggedInForPersonalizedData, self).has_permission(request, view)
        return True
