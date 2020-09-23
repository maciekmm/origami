import unittest

from .fold_encoder import LogFoldEncoder


class TestLogFoldEncoder(unittest.TestCase):
    def test_next_step_resets_encoder(self):
        encoder = LogFoldEncoder(4, 2, 1)

        encoder.advance()
        self.assertNotEqual(encoder.frame_idx, 0)
        self.assertNotEqual(encoder.frame_drop_rate, 4)

        encoder.next_step()
        self.assertEqual(encoder.frame_idx, 0)
        self.assertEqual(encoder.frame_drop_rate, 4)

    def test_encode_returns_frame_with_drop_rate(self):
        encoder = LogFoldEncoder(1, 1, 1)
        self.assertIsNotNone(encoder.encode('sth', False))
        encoder.advance()
        self.assertIsNotNone(encoder.encode('sth', False))

    def test_encode_does_not_return_frame_out_of_drop_rate(self):
        encoder = LogFoldEncoder(5, 1, 1)
        self.assertIsNotNone(encoder.encode('sth', False))
        encoder.advance()
        self.assertIsNone(encoder.encode('sth', False))

    def test_encode_includes_last_frame(self):
        encoder = LogFoldEncoder(5, 1, 1)
        encoder.advance()
        self.assertIsNotNone(encoder.encode('sth', True))

    def test_advance_advances_encoder_with_no_changes(self):
        encoder = LogFoldEncoder(5, 2, 4)
        encoder.advance()
        self.assertEqual(encoder.frame_idx, 1)
        self.assertEqual(encoder.frame_drop_rate, 5)

    def test_advance_advances_encoder_changing_drop_rate(self):
        encoder = LogFoldEncoder(5, 2, 1)
        encoder.advance()
        self.assertEqual(encoder.frame_idx, 1)
        self.assertEqual(encoder.frame_drop_rate, 10)
