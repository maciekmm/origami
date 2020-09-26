from django.core import mail
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User


class RetrieveUserTest(APITestCase):
    def setUp(self):
        self.test_user = User.objects.create_user('test', 'test@example.com', 'password')

    def test_get_user_me_should_retrieve_current_user(self):
        """
        Ensure we can retrieve current user
        """
        self.client.force_authenticate(user=self.test_user)
        retrieve_url = reverse('user-detail', args=['me'])
        response = self.client.get(retrieve_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data['username'], self.test_user.username)
        self.assertEqual(response.data['email'], self.test_user.email)
        self.assertFalse('password' in response.data)

    def test_get_user_should_retrieve_user(self):
        """
        Ensure we can retrieve current user
        """
        self.client.force_authenticate(user=self.test_user)
        retrieve_url = reverse('user-detail', args=[self.test_user.id])
        response = self.client.get(retrieve_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data['username'], self.test_user.username)
        self.assertEqual(response.data['email'], self.test_user.email)
        self.assertFalse('password' in response.data)

    def test_get_user_should_fail_if_user_is_not_logged_in(self):
        """
        Ensure we can't retrieve user if not logged in
        """
        retrieve_url = reverse('user-detail', args=[self.test_user.id])
        response = self.client.get(retrieve_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user_should_fail_if_user_is_invalid(self):
        """
        Ensure we can only retrieve self
        """
        additional_user = User.objects.create_user('test2', 'test2@example.com', 'password')
        self.client.force_authenticate(user=additional_user)
        retrieve_url = reverse('user-detail', args=[self.test_user.id])
        response = self.client.get(retrieve_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class CreateUserTest(APITestCase):
    def setUp(self):
        self.test_user = User.objects.create_user('test', 'test@example.com', 'password')
        self.create_url = reverse('user-list')

    def test_create_user_should_create_user(self):
        """
        Ensure we can create a new user 
        """
        data = {
            'username': 'test_create_user',
            'email': 'test_create_user@example.com',
            'password': 'password'
        }

        response = self.client.post(self.create_url, data, format='json')

        # We want to make sure we have created the user
        self.assertTrue(User.objects.filter(username=data['username']).exists())

        # And that we're returning a 201 created code.
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Additionally, we want to return the username and email upon successful creation.
        self.assertEqual(response.data['username'], data['username'])
        self.assertEqual(response.data['email'], data['email'])
        self.assertFalse('password' in response.data)

    def test_create_user_should_fail_if_username_already_exists(self):
        """
        Ensure we can create a new user
        """
        data = {
            'username': 'test',
            'email': 'test_create_user@example.com',
            'password': 'password'
        }

        response = self.client.post(self.create_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_should_fail_if_email_already_exists(self):
        """
        Ensure we can't have duplicate email addresses
        """
        data = {
            'username': 'test_user',
            'email': 'test@example.com',
            'password': 'password'
        }

        response = self.client.post(self.create_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ChangePasswordTest(APITestCase):
    def setUp(self):
        self.test_user = User.objects.create_user('test', 'test@example.com', 'password')
        self.create_url = reverse('user-list')
        self.change_password_url = reverse('user-change-password', args=[self.test_user.id])

    def test_change_password_should_change_password(self):
        """
        Ensure we can change password
        """
        self.client.force_authenticate(user=self.test_user)

        data = {
            'old_password': 'password',
            'new_password': 'newPassword'
        }

        response = self.client.put(self.change_password_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertTrue(User.objects.get(id=self.test_user.id).check_password(data['new_password']))
        self.assertFalse('password' in response.data)

    def test_change_password_should_fail_if_old_password_is_invalid(self):
        """
        Ensure we can't change password if old password is invalid
        """
        self.client.force_authenticate(user=self.test_user)

        data = {
            'old_password': 'invalid_password',
            'new_password': 'newPassword'
        }

        response = self.client.put(self.change_password_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_password_should_fail_if_logged_in_user_does_not_match(self):
        """
        Ensure we can't change password if we are not logged in as the user we want to change the password for
        """
        new_user = User.objects.create_user('new_user', 'new_user@example.com', 'password')
        self.client.force_authenticate(user=new_user)

        data = {
            'old_password': 'password',
            'new_password': 'newPassword'
        }

        response = self.client.put(self.change_password_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class ResetPasswordTest(APITestCase):

    def setUp(self):
        self.test_user = User.objects.create_user('test', 'test@example.com', 'password')
        self.reset_password_url = reverse("password_reset:reset-password-request")

    def test_reset_password_sends_email(self):
        data = {
            'email': 'test@example.com'
        }
        
        response = self.client.post(self.reset_password_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(mail.outbox) == 1)
        self.assertIn(self.test_user.email, mail.outbox[0].to)
