# -*- coding: utf-8 -*-
#
# @license: MIT
#
# (c) 2013-2014 Wishtack
#
# $Id: b26377e25fdd9a8fce904759cc7270830fa8a2ce $
#

import copy
import logging

from mongoengine import queryset
from tastypie.exceptions import ImmediateHttpResponse
from tastypie.http import HttpNotFound
from tastypie_mongoengine.resources import MongoEngineListResource

from .resource_helper import ResourceHelper

logger = logging.getLogger(__name__)

class ChildModelResourceMixin(object):

    def dispatch(self, request_type, request, **kwargs):

        # Removing 'api_name', 'subresource_name' etc...
        kwargs = self._remove_api_resource_names(kwargs=kwargs)

        # Current resource depth.
        depth = ResourceHelper().depth(resource=self)

        # For each resource, fill 'parent.object' with parent resource object.
        self._recursive_create_parent_object(depth=depth, kwargs=kwargs, request=request)

        # Keep only the current resource 'pk' in kwargs.
        if request_type == 'detail':
            kwargs = self._extract_subresource_pk(depth=depth, kwargs=kwargs)
        else:
            kwargs = self._extract_subresource_pk(kwargs=kwargs)

        # Skipping 'MongoEngineListResource.dispatch' (because the '_safe_get' call will fail) and calling the parent class implementation.
        if isinstance(self, MongoEngineListResource):
            return super(MongoEngineListResource, self).dispatch(request_type, request, **kwargs)
        else:
            return super(ChildModelResourceMixin, self).dispatch(request_type, request, **kwargs)

    def _extract_subresource_pk(self, kwargs, depth=None):
        """
        Moves kwargs['subresource_{depth}_pk'] to kwargs['pk'] and removes all subresources pks.
        """

        kwargs = copy.copy(kwargs)

        # Extracting the requested 'pk'.
        if depth is not None:
            pk_field = ResourceHelper().resource_pk_field(depth)
            pk = kwargs.get(pk_field)

        # Removing all subresources pk fields: 'subresource_pk', 'subresouce_2_pk', ...
        i = 0
        while True:
            field = ResourceHelper().resource_pk_field(i)

            # Removed all subresource pks.
            if field not in kwargs:
                break

            del kwargs[field]
            i += 1

        # 'depth' is set to None when 'request_type' is 'list' and we don't need a 'pk' in that case.
        if depth is not None:
            kwargs['pk'] = pk

        return kwargs

    def _get_object(self, kwargs, request, resource):
        if kwargs is None:
            kwargs = self._remove_api_resource_names(request.resolver_match.kwargs)
            del kwargs['request_type']

        try:
            resource.cached_obj_get(
                bundle=resource.build_bundle(request=request),
                **kwargs
            )
        except queryset.DoesNotExist as e:
            logger.exception(e)
            raise ImmediateHttpResponse(response=HttpNotFound())

    def _recursive_create_parent_object(self, depth, kwargs, request):

        current_resource_depth = depth

        # Settings `resource.object` for each resource including the current one.
        for resource_depth in range(0, current_resource_depth + 1):

            # Retrieving the right parent by measuring distance between it's depth and the current resource's.
            # Example: if depth is 3 and resource_depth is 0 then we have to iterate three times to get the root
            # resource.
            resource = self
            for i in range(current_resource_depth - resource_depth):
                resource = resource.parent

            # For each resource in parent tree, call `_get_object` that will call `get_object`
            # and `MemoizeObjectMixin.get_object` will store the result in `self.object`.
            if resource_depth != current_resource_depth:
                self._get_object(
                    kwargs=self._extract_subresource_pk(depth=resource_depth, kwargs=kwargs),
                    request=request,
                    resource=resource
                )

            # Also set `instance` attribute which is used by `django-tastypie-mongoengine`.
            parent = getattr(resource, 'parent', None)
            if parent is not None:
                resource.instance = request.resource(parent._meta.resource_key)

    def _remove_api_resource_names(self, kwargs):
        kwargs = self._remove_subresource_names(kwargs=kwargs)
        return super(ChildModelResourceMixin, self).remove_api_resource_names(kwargs)

    def _remove_subresource_names(self, kwargs):
        kwargs = copy.copy(kwargs)

        i = 0
        while True:
            field = ResourceHelper().resource_name_field(i)

            # Removed all subresource pks.
            if field not in kwargs:
                break

            del kwargs[field]
            i += 1

        return kwargs
