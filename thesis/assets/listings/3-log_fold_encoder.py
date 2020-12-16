class LogFoldEncoder(FoldEncoder):
    def __init__(self,
                 frame_drop_rate=4,
                 frame_drop_multiplier=2,
                 frame_drop_change_iter=10):
        self.base_frame_drop_rate = frame_drop_rate
        self.frame_idx = 0
        # ...

    def encode(self, frame, last_frame):
        if (self.frame_idx % self.frame_drop_rate == 0) or last_frame:
            return frame
        return None

    def next_step(self):
        self.frame_idx = 0
        self.frame_drop_rate = self.base_frame_drop_rate

    def advance(self):
        self.frame_idx += 1
        if self.frame_idx % self.frame_drop_change_iter == 0:
            self.frame_drop_rate = \
                    int(self.frame_drop_rate * self.frame_drop_multiplier)

