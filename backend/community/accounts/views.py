from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action

from accounts.models import User
from accounts.permissions import IsOwnerOrCreateOnly
from accounts.serializers import UserSerializer, ChangePasswordSerializer
from rest_framework.response import Response
from rest_framework import generics, mixins, views


class UserViewSet(mixins.CreateModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsOwnerOrCreateOnly]

    @action(detail=True, methods=['put'])
    def change_password(self, request):
        user = self.get_object()
        serializer = ChangePasswordSerializer(data=request.data, instance=user, context=self.get_serializer_context())
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
