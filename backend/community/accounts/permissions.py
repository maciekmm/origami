from rest_framework import permissions


class IsOwnerOrCreateOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method == 'POST':
            return True
        return obj == request.user
