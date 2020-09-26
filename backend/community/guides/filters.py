import django_filters

from guides.models import Guide


class GuideFilter(django_filters.FilterSet):
    class Meta:
        model = Guide
        fields = {
            'steps': ['lt', 'gt', 'exact'],
            'owner': ['exact'],
            'published_at': ['lt', 'gt'],
            'status': ['exact'],
            'name': ['icontains']
        }

    @property
    def qs(self):
        parent = super().qs
        user = getattr(self.request, 'user', None)
        if user is None:
            return parent.filter(private=False)
        return parent.filter(private=False) | parent.filter(owner=user.id)
