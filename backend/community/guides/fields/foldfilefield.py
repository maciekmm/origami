from drf_base64.fields import Base64FileField


class FoldFileField(Base64FileField):

    def __init__(self, *args, **kwargs):
        super(FoldFileField, self).__init__(*args, **kwargs)
