import json


class Fold:

    @staticmethod
    def from_fold_file(fold_file):
        with fold_file.open() as fold_content:
            data = json.loads(fold_content.read())
            print(data['file_frames'])
            return Fold(title=data['file_title'], author=data['file_author'], steps=len(data['file_frames']))

    def __init__(self, title, author, steps):
        self.title = title
        self.author = author
        self.steps = steps
