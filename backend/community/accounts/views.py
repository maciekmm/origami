from rest_framework import mixins
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.models import User
from accounts.permissions import IsOwnerOrCreateOnly
from accounts.serializers import UserSerializer, ChangePasswordSerializer, CustomClaimsTokenObtainPairSerializer


class UserViewSet(mixins.CreateModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsOwnerOrCreateOnly]

    def get_object(self):
        if self.kwargs['pk'] == 'me':
            self.kwargs['pk'] = self.request.user.id
        return super(UserViewSet, self).get_object()

    @action(detail=True, methods=['put'])
    def change_password(self, request, pk):
        user = self.get_object()
        serializer = ChangePasswordSerializer(data=request.data, instance=user, context=self.get_serializer_context())
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class CustomClaimsTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomClaimsTokenObtainPairSerializer
