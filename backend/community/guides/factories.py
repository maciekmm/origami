from datetime import datetime

import factory

from accounts.factories import UserFactory
from guides import models


class GuideFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Guide

    owner = factory.SubFactory(UserFactory)
    guide_file = factory.django.FileField(filename='guide_file')
    animation_file = factory.django.FileField(filename='animation_file')
