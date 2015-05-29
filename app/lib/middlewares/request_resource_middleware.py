# -*- coding: utf-8 -*-
#
# (c) 2013-2014 Wishtack
#
# $Id: 9a938e36741f1bc1f5d2a1f69427000e592d5276 $
#

import types

class RequestResourceMiddleware(object):
    """
    Adds `resource` and `set_resource` methods to request object in order to store API parent resources.
    """

    def process_request(self, request):

        def resource(instance, resource_key):
            return instance._resource_dict[self._canonize_resource_key(resource_key)]

        def set_resource(instance, resource_key, resource_value):
            instance._resource_dict[self._canonize_resource_key(resource_key)] = resource_value

        request._resource_dict = {}
        request.resource = types.MethodType(resource, request)
        request.set_resource = types.MethodType(set_resource, request)

    def _canonize_resource_key(self, resource_key):
        return resource_key.lower()
