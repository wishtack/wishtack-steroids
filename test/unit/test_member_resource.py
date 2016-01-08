#-*- coding: utf-8 -*-
#
# (c) 2013-2015 Wishtack
#
# $Id: $
#


from app.lib.utils import Utils
from app.models.member import Member

from ..lib.djangular_test_case import DjangularTestCase
from ..lib.utils import Utils as TestUtils


class TestMemberResource(DjangularTestCase):

    def __init__(self, *args, **kwargs):

        super(TestMemberResource, self).__init__(*args, **kwargs)

        self._utils = TestUtils()

        self._member_kwargs_list = [
            {
                'creation_datetime': Utils().now(),
                'email': 'foo.bar@wishtack.com',
                'first_name': 'Foo',
                'last_name': 'BAR'
            },
            {
                'creation_datetime': Utils().now(),
                'email': 'john.woo@wishtack.com',
                'first_name': 'John',
                'last_name': 'WOO'
            }
        ]

    def setUp(self):
        self._reset()

    def tearDown(self):
        self._reset()

    def test_member_list(self):

        for member_kwargs in self._member_kwargs_list:

            response = self.api_client().post(
                uri=self._utils.uri_members_list(),
                data=member_kwargs
            )
            self.assertHttpCreated(response)

        response = self.api_client().get(
            uri=self._utils.uri_members_list()
        )
        self.assertHttpOK(response)
        data = self.deserialize(response)

        self.assertEqual(2, data['meta']['total_count'])

    def _reset(self):
        Member.drop_collection()
