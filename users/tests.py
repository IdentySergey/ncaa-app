from django.test import TestCase
from rest_framework.test import APIClient


class UsersTestCase(TestCase):
    def test_crud(self):
        client = APIClient()
        user = {
            'username': 'test',
            'first_name': 'sergey',
            'last_name': 'zhiganov',
            'password': 'password999',
            'email': 'email@mailemail.ru'
        }

        print("USER TEST POST")
        response = client.post('/api/users/', data=user, format='json')
        self.assertEquals(response.status_code, 200)

        print("USER TEST GET")
        data = response.data
        response = client.get('/api/users/' + str(data['id']) + "/", format='json')
        self.assertEquals(response.status_code, 200)

        print("USER TEST PUT")
        data = response.data
        data['username'] = "test2"
        data['password'] = ""
        response = client.put('/api/users/' + str(data['id']) + "/", data=data, format='json')
        self.assertEquals(response.status_code, 200)

        data = response.data
        data['password'] = "newPassword$$"
        response = client.put('/api/users/' + str(data['id']) + "/", data=data, format='json')
        self.assertEquals(response.status_code, 200)


        print("USER TEST DELETE")
        response = client.delete('/api/users/' + str(data['id']) + "/", format='json')
        self.assertEquals(response.status_code, 200)


    def test_list(self):
        print("USER TEST LIST")
        client = APIClient()

        user = {
            'username': 'test1',
            'first_name': 'sergey',
            'last_name': 'zhiganov',
            'password': 'password999',
            'email': 'email1@mailemail.ru'
        }
        response = client.post('/api/users/', data=user, format='json')
        self.assertEquals(response.status_code, 200)

        user = {
            'username': 'test2',
            'first_name': 'sergey',
            'last_name': 'zhiganov',
            'password': 'password999',
            'email': 'email2@mailemail.ru'
        }

        response = client.post('/api/users/', data=user, format='json')
        self.assertEquals(response.status_code, 200)

        response = client.get('/api/users/list/', format='json')
        self.assertEquals(response.status_code, 200)