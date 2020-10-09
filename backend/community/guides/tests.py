from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APITransactionTestCase
from unittest.mock import patch
import base64

from accounts.factories import UserFactory
from accounts.models import User
from guides.factories import GuideFactory
from guides.models import Guide

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


class RetrieveGuideTest(APITestCase):
    def setUp(self):
        self.test_user = UserFactory()
        self.test_guide = GuideFactory(owner=self.test_user)

    def test_get_guide_fails_if_private_and_user_not_authenticated(self):
        retrieve_url = reverse('guide-detail', args=[self.test_guide.pk])
        response = self.client.get(retrieve_url)
        self.assertTrue(status.is_client_error(response.status_code))

    def test_get_guide_fails_if_private_and_non_owner_authenticated(self):
        non_owner = UserFactory()
        self.client.force_authenticate(user=non_owner)

        retrieve_url = reverse('guide-detail', args=[self.test_guide.pk])
        response = self.client.get(retrieve_url)
        self.assertTrue(status.is_client_error(response.status_code))

    def test_get_guide_succeeds_if_private_and_owner_authenticated(self):
        self.client.force_authenticate(user=self.test_guide.owner)

        retrieve_url = reverse('guide-detail', args=[self.test_guide.pk])
        response = self.client.get(retrieve_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_guide_succeeds_if_public(self):
        test_guide = GuideFactory(private=False)
        retrieve_url = reverse('guide-detail', args=[test_guide.pk])
        response = self.client.get(retrieve_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)


class DeleteGuideTest(APITestCase):
    def setUp(self):
        self.test_user = UserFactory()
        self.test_guide = GuideFactory(owner=self.test_user)

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
        self.test_user = UserFactory()
        self.test_user_2 = UserFactory()
        self.public_guide_1 = GuideFactory(owner=self.test_user, private=False, name='Public Crane')
        self.public_guide_2 = GuideFactory(owner=self.test_user_2, private=False, name='Public Paper')
        self.private_guide_1 = GuideFactory(owner=self.test_user, private=True, name='Private')
        self.private_guide_2 = GuideFactory(owner=self.test_user_2, private=True, name='Private 2')

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
        self.assertEqual(response.data[0]['id'], self.public_guide_1.id)


class CreateGuideTest(APITransactionTestCase):
    def setUp(self):
        self.test_user = UserFactory(username='test', email='test@example.com', password='password')
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


class UpdateGuideTest(APITransactionTestCase):
    def setUp(self):
        self.test_user = UserFactory()
        self.test_user_2 = UserFactory()
        self.private_guide = GuideFactory(
            owner=self.test_user,
            name='name',
            private=True,
            guide_file__data=b'guide'
        )
        self.public_guide = GuideFactory(
            owner=self.test_user,
            name='name',
            private=False,
        )

    def test_fails_when_not_authenticated(self):
        retrieve_url = reverse('guide-detail', args=[self.private_guide.pk])
        response = self.client.patch(retrieve_url, {
            'name': 'newname',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_updates_simple_fields_when_owner(self):
        self.client.force_authenticate(user=self.test_user)
        retrieve_url = reverse('guide-detail', args=[self.private_guide.pk])
        response = self.client.patch(retrieve_url, {
            'name': 'newname',
            'private': False,
            'liked': True,
            'solved': True,
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'newname')
        self.assertEqual(response.data['private'], False)
        self.assertEqual(response.data['liked'], True)
        self.assertEqual(response.data['solved'], True)

    @override_settings(CELERY_ALWAYS_EAGER=True)
    @patch('guides.tasks.process_guide.delay')
    def test_updates_and_recomputes_model(self, task):
        self.client.force_authenticate(user=self.test_user)
        retrieve_url = reverse('guide-detail', args=[self.private_guide.pk])
        response = self.client.patch(retrieve_url, {
            'guide_file': f'data:text/json;base64,{sample_fold_encoded}'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        task.assert_called_once()

    def test_updates_liked_and_solved_when_not_owner(self):
        self.client.force_authenticate(user=self.test_user_2)
        retrieve_url = reverse('guide-detail', args=[self.public_guide.pk])
        response = self.client.patch(retrieve_url, {
            'liked': True,
            'solved': True,
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['liked'], True)
        self.assertEqual(response.data['solved'], True)

        guide = Guide.objects.get(pk=response.data['id'])
        self.assertEqual(list(guide.liked_by.all()), [self.test_user_2])
        self.assertEqual(list(guide.solved_by.all()), [self.test_user_2])

    def test_does_not_update_private_fields_when_not_owner(self):
        self.client.force_authenticate(user=self.test_user_2)
        retrieve_url = reverse('guide-detail', args=[self.public_guide.pk])
        response = self.client.patch(retrieve_url, {
            'private': True,
            'name': 'failedname',
            'guide_file': f'data:text/json;base64,{sample_fold_encoded}'
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        guide = Guide.objects.get(pk=self.public_guide.pk)
        self.assertEqual(guide, self.public_guide)


class RetrieveLikedGuidesTest(APITestCase):
    def setUp(self):
        self.test_user = UserFactory()
        self.liked_guide = GuideFactory(private=False)
        self.liked_guide.liked_by.add(self.test_user)

    def test_returns_a_list_of_liked_guides_for_user(self):
        self.client.force_authenticate(user=self.test_user)
        retrieve_url = reverse('guide-liked')
        response = self.client.get(retrieve_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_not_allowed_when_unauthenticated(self):
        retrieve_url = reverse('guide-liked')
        response = self.client.get(retrieve_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class RetrieveSolvedGuidesTest(APITestCase):
    def setUp(self):
        self.test_user = UserFactory()
        self.solved_guide = GuideFactory(private=False)
        self.solved_guide.solved_by.add(self.test_user)

    def test_returns_a_list_of_solved_guides_for_user(self):
        self.client.force_authenticate(user=self.test_user)
        retrieve_url = reverse('guide-solved')
        response = self.client.get(retrieve_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_not_allowed_when_unauthenticated(self):
        retrieve_url = reverse('guide-solved')
        response = self.client.get(retrieve_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
