# -*- coding: utf-8 -*-
#
# (c) 2013-2015 Wishtack
#
# $Id: $
#

from django.db import connections
from tastypie.test import ResourceTestCase, TestApiClient

from app.lib.resources.camel_case_json_serializer import CamelCaseJSONSerializer


class DjangularTestCase(ResourceTestCase):

    serializer = CamelCaseJSONSerializer()

    def __init__(self, *args, **kwargs):

        connections.all = lambda : []

        super(DjangularTestCase, self).__init__(*args, **kwargs)

        self._api_client = TestApiClient()

        # Show complete difference on assertEqual failure.
        self.maxDiff = None

    @classmethod
    def setUpClass(cls):
        pass

    @classmethod
    def tearDownClass(cls):
        pass

    def api_client(self):
        return self._api_client

    # @hack: overrides cuz we're using mongo.
    def _fixture_setup(self):
        pass

    # @hack: overrides cuz we're using mongo.
    def _fixture_teardown(self):
        pass


