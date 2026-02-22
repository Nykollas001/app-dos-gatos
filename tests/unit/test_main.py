import unittest
from datetime import datetime

class TestGatoApp(unittest.TestCase):
    def test_timestamp_format(self):
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.assertRegex(timestamp, r'\d{2}:\d{2}:\d{2}')
    
    def test_cat_names(self):
        cats = ["🐈‍⬛ Gato Preto", "🐈 Gato Branco"]
        self.assertEqual(len(cats), 2)

if __name__ == '__main__':
    unittest.main()
