from rest_framework import permissions


class IsOwnerOrPublic(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user or not obj.private
