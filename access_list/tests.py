from django.test import TestCase
from rest_framework.test import APIClient
from access_list.models import AccessList
from detector.models import Detector


# Create your tests here.


class AccessListTestCase(TestCase):
    def test_allow_number(self):
        print("TEST ALLOW NUMBER")
        access = AccessList()
        access.number = "5K643M027"
        access.mark = "Tayouta"
        access.ownerName = "Ivanov"
        access.save()
        white_number = access.register_flat_number("5K643M027")
        black_number = access.register_flat_number("5K643M026")

        self.assertEqual(white_number, True)
        self.assertEqual(black_number, False)

        print("TEST DETECTOR")
        detector = Detector()
        detector.create(access.number, "None")
        access_number_detected = Detector.objects.filter(number=access.number).first()
        self.assertEqual(access_number_detected.allow, True)



    def test_crud(self):
        print("TEST CRUD")

        data = {
            'number': '5K567MK27',
            "mark": 'Porche 911',
            'ownerName': 'Sergey Zhiganov'
        }

        print("POST")
        client = APIClient()
        response = client.post('/api/access-list/', data, format='json')
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data["number"], data["number"])
        print("POST SUCCESS")

        print("GET")
        client = APIClient()
        data = response.data
        response = client.get('/api/access-list/' + str(data['id']) + "/", data, format='json')
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data, data)

        print("UPDATE")
        client = APIClient()
        data = response.data
        data["number"] = '5K567MK28'
        id = data["id"]
        del data["id"]
        del data["created"]
        response = client.put('/api/access-list/' + str(id) + "/", data, format='json')
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data["number"], data["number"])

        print("DELETE")
        client = APIClient()
        response = client.delete('/api/access-list/' + str(id) + "/", data, format='json')
        self.assertEquals(response.status_code, 200)

    def test_unique_number(self):
        print("TEST UNIQUE")
        data = {
            'number': '5K567MK21',
            "mark": 'Porche 911',
            'ownerName': 'Sergey Zhiganov'
        }

        client = APIClient()
        response = client.post('/api/access-list/', data)
        response = client.post('/api/access-list/', data)
        self.assertEquals(response.status_code, 400)

    def test_list(self):
        print("TEST LIST")
        data = {
            'number': '5K567MK21',
            "mark": 'Porche 911',
            'ownerName': 'Sergey Zhiganov'
        }

        print("POST")
        client = APIClient()
        response = client.post('/api/access-list/', data)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data["number"], data["number"])
        print("POST SUCCESS")

        data = {
            'number': '5K567MK22',
            "mark": 'Porche 911',
            'ownerName': 'Sergey Zhiganov'
        }

        print("POST")
        client = APIClient()
        response = client.post('/api/access-list/', data)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data["number"], data["number"])
        print("POST SUCCESS")

        print("LIST")
        client = APIClient()
        response = client.get('/api/access-list/list/', format='json')
        self.assertEquals(response.status_code, 200)
        print("LIST SUCCESS")
