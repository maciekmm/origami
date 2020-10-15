import factory

from accounts import models


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.User

    username = factory.Faker('name')
    email = factory.Faker('ascii_safe_email')

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        password = kwargs.pop('password', None)
        user = super(UserFactory, cls)._create(model_class, **kwargs)
        if password:
            user.set_password(password)
            user.save()
        return user
