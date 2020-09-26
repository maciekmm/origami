from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from guides.models import Guide


class RetrieveGuideTest(APITestCase):
    def setUp(self):
        self.test_user = User.objects.create_user('test', 'test@example.com', 'password')

    def test_get_guide_fails_if_private_and_user_not_authenticated(self):
        test_guide = Guide(
            owner=self.test_user,
            name='Name',
            steps=0,
            status=Guide.ProcessingStatus.DONE,
            private=True
        )
        test_guide.save()
        retrieve_url = reverse('guide-detail', args=[test_guide.pk])
        response = self.client.get(retrieve_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_guide_fails_if_private_and_non_owner_authenticated(self):
        test_guide = Guide(
            owner=self.test_user,
            name='Name',
            steps=0,
            status=Guide.ProcessingStatus.DONE,
            private=True
        )
        test_guide.save()
        non_owner = User.objects.create_user('test2', 'test2@example.com', 'password')
        self.client.force_authenticate(user=non_owner)

        retrieve_url = reverse('guide-detail', args=[test_guide.pk])
        response = self.client.get(retrieve_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_guide_succeeds_if_private_and_owner_authenticated(self):
        test_guide = Guide(
            owner=self.test_user,
            name='Name',
            steps=0,
            status=Guide.ProcessingStatus.DONE,
            private=True
        )
        test_guide.save()
        self.client.force_authenticate(user=test_guide.owner)

        retrieve_url = reverse('guide-detail', args=[test_guide.pk])
        response = self.client.get(retrieve_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_guide_succeeds_if_public(self):
        test_guide = Guide(
            owner=self.test_user,
            name='Name',
            steps=0,
            status=Guide.ProcessingStatus.DONE,
            private=False
        )
        test_guide.save()
        retrieve_url = reverse('guide-detail', args=[test_guide.pk])
        response = self.client.get(retrieve_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)


class DeleteGuideTest(APITestCase):
    def setUp(self):
        self.test_user = User.objects.create_user('test', 'test@example.com', 'password')
        self.test_guide = Guide(
            owner=self.test_user,
            name='Name',
            steps=0,
            status=Guide.ProcessingStatus.DONE,
            private=True
        )
        self.test_guide.save()

    def test_delete_guide_fails_if_private_and_user_not_authenticated(self):
        retrieve_url = reverse('guide-detail', args=[self.test_guide.pk])
        response = self.client.delete(retrieve_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_guide_fails_if_private_and_non_owner_authenticated(self):
        non_owner = User.objects.create_user('test2', 'test2@example.com', 'password')
        self.client.force_authenticate(user=non_owner)

        retrieve_url = reverse('guide-detail', args=[self.test_guide.pk])
        response = self.client.delete(retrieve_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_guide_succeeds_if_private_and_owner_authenticated(self):
        self.client.force_authenticate(user=self.test_guide.owner)

        retrieve_url = reverse('guide-detail', args=[self.test_guide.pk])
        response = self.client.delete(retrieve_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_guide_fails_if_public_and_no_owner_is_authenticated(self):
        self.test_guide.private = False
        self.test_guide.save()
        retrieve_url = reverse('guide-detail', args=[self.test_guide.pk])
        response = self.client.delete(retrieve_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ListGuidesTest(APITestCase):
    def setUp(self):
        self.test_user = User.objects.create_user('test', 'test@example.com', 'password')
        self.test_user_2 = User.objects.create_user('test2', 'test2@example.com', 'password')
        self.public_guide_1 = Guide(
            owner=self.test_user,
            name='Public Crane',
            steps=0,
            status=Guide.ProcessingStatus.DONE,
            private=False
        )
        self.public_guide_1.save()
        self.public_guide_2 = Guide(
            owner=self.test_user_2,
            name='Public Paper',
            steps=0,
            status=Guide.ProcessingStatus.DONE,
            private=False
        )
        self.public_guide_2.save()
        self.private_guide_1 = Guide(
            owner=self.test_user,
            name='Private',
            steps=0,
            status=Guide.ProcessingStatus.DONE,
            private=True
        )
        self.private_guide_1.save()
        self.private_guide_2 = Guide(
            owner=self.test_user_2,
            name='Private 2',
            steps=0,
            status=Guide.ProcessingStatus.DONE,
            private=True
        )
        self.private_guide_2.save()

    def test_list_guides_should_return_only_public_guides_if_not_authenticated(self):
        retrieve_url = reverse('guide-list')
        response = self.client.get(retrieve_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertTrue(response.data[0]['private'] is False)
        self.assertTrue(response.data[1]['private'] is False)

    def test_list_guides_should_return_public_and_authed_user_private_guides(self):
        self.client.force_authenticate(user=self.test_user)
        retrieve_url = reverse('guide-list')
        response = self.client.get(retrieve_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

        is_only_owner_guides_and_public = all(
            list(map(lambda guide: guide['private'] is False or guide['owner'] == self.test_user.id, response.data)))
        self.assertTrue(is_only_owner_guides_and_public)

    def test_list_guides_should_allow_filtering_by_owner(self):
        retrieve_url = reverse('guide-list')
        response = self.client.get(retrieve_url, {'owner': self.test_user_2.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_list_guides_should_not_allow_filtering_by_private(self):
        retrieve_url = reverse('guide-list')
        response_with_private_filter = self.client.get(retrieve_url, {'private': True})
        response_public = self.client.get(retrieve_url)
        self.assertEqual(response_with_private_filter.status_code, status.HTTP_200_OK)
        self.assertEqual(response_with_private_filter.data, response_public.data)

    def test_list_guides_should_filter_names_using_insensitive_contains(self):
        retrieve_url = reverse('guide-list')
        response = self.client.get(retrieve_url, {'name__icontains': "crane"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        print(response.data)
        self.assertEqual(response.data[0]['id'], self.public_guide_1.id)
