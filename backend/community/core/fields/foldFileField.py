from drf_base64.fields import Base64FileField

DEFAULT_MAX_FOLD_FILE = 2621440


class FoldFileField(Base64FileField):

    def __init__(self, *args, **kwargs):
        super(FoldFileField, self).__init__(*args, **kwargs)
