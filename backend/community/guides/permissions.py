from rest_framework import permissions


class IsOwnerOrPublic(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user or not obj.private


class IsAuthenticatedOrActionAllowed(permissions.BasePermission):
    _UNATUHENTICATED_ALLOWED_ACTIONS = (
        'list',
        'retrieve'
    )

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated) or\
               view.action in self._UNATUHENTICATED_ALLOWED_ACTIONS


class IsOwnerOrActionAllowed(permissions.BasePermission):
    _ALLOWED_ACTIONS = (
        'list',
        'create',
        'retrieve',
        'liked',
        'solved',
        'like',
        'solve'
    )

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user or view.action in self._ALLOWED_ACTIONS
