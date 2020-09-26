from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APITransactionTestCase
from unittest.mock import patch
import base64

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

        self.assertTrue(status.is_client_error(response.status_code))

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
        self.assertTrue(status.is_client_error(response.status_code))

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
        self.assertTrue(status.is_client_error(response.status_code))

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


class CreateGuideTest(APITransactionTestCase):
    def setUp(self):
        self.test_user = User.objects.create_user('test', 'test@example.com', 'password')

        sample_fold_encoded = base64.b64encode(
            '{"file_spec":1,"file_creator":"Origuide - https://origami.wtf","file_author":"Maciej Mionskowski",'
            '"file_classes":["animation","origuide:guide"],"file_frames":[{"frame_title":"","frame_classes":['
            '"creasePattern","origuide:steady_state"],"frame_attributes":["3D"],"vertices_coords":[[0,-1,-1],[0,-1,'
            '1],[0,1,1],[0,1,-1]],"faces_vertices":[[0,1,2],[2,3,0]],"edges_vertices":[[0,1],[1,2],[2,3],[3,0],[0,'
            '2]],"edges_assignment":["B","B","B","B","V"]},{"frame_inherit":true,"frame_parent":0,"frame_classes":['
            '"origuide:steady_state"],"edges_assignment":["B","B","B","B","M"]},{"frame_inherit":true,'
            '"frame_parent":1,"frame_classes":["origuide:steady_state"],"edges_assignment":["B","B","B","B","B"]},'
            '{"frame_inherit":true,"frame_parent":2,"frame_classes":["origuide:steady_state"],"edges_assignment":['
            '"B","B","B","B","V"]}],"file_og:frameRate":24,"file_title":"Flat Fold",'
            '"file_description":"Hello"}'.encode('ascii')).decode('ascii')
        self.sample_data = {
            'guide_file': f'data:text/json;base64,{sample_fold_encoded}'
        }

    def test_create_guide_should_fail_if_not_authorized(self):
        create_url = reverse('guide-list')
        response = self.client.post(create_url, self.sample_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @override_settings(CELERY_ALWAYS_EAGER=True)
    @patch('guides.tasks.process_guide.delay')
    def test_create_guide_should_create_guide_and_start_processing_task(self, task):
        self.client.force_authenticate(user=self.test_user)
        create_url = reverse('guide-list')
        response = self.client.post(create_url, self.sample_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        task.assert_called_once()
