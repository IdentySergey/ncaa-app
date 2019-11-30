from django.test import TestCase
from rest_framework.test import APIClient
from .models import Detector


class DetectorTestCase(TestCase):
    validate_data = None

    def test_fuzzy(self):
        client = APIClient()
        response = client.get("/api/camera/fuzzy/")
        self.assertEquals(response.status_code, 200)
        print("SUCCESS")

        # def setUp(self):
        #     detect = Detector()
        #     detect.number = "5K567MK27"
        #     detect.photoFileName = "1.jpg"
        #     detect.save()
        #     self.validate_data = detect
        #
        # def test_get_list(self):
        #     print("TEST GET LIST")
        #     client = APIClient()
        #     response = client.get("/api/event/list/", format='json')
        #     self.assertEquals(response.status_code, 200)
        #
        # def test_get_event(self):
        #     print("TEST GET EVENT")
        #     client = APIClient()
        #     id = str(self.validate_data.id)
        #     response = client.get("/api/event/" + id + "/")
        #     self.assertEquals(response.status_code, 200)
        #     print("SUCCESS")
        #
        # def test_delete_event(self):
        #     print("TEST DELETE EVENT")
        #     client = APIClient()
        #     id = str(self.validate_data.id)
        #     response = client.delete("/api/event/" + id + "/")
        #     self.assertEquals(response.status_code, 200)
        #     print("SUCCESS")
        # def test_write_number(self):
        #     print("SUCCESS")
