#-*- coding: utf-8 -*-
#
# @license: MIT
#
# (c) 2013-2014 Wishtack
#
# $Id: 56de16f354107d7bca2cf1158a2e062cb67b3466 $
#

import copy

from contracts import new_contract, contract
from django.conf import urls
from tastypie import utils
from tastypie.resources import Resource
from tastypie_mongoengine.fields import EmbeddedListField

from .resource_helper import ResourceHelper

new_contract('Resource', Resource)

class RootModelResourceMixin(object):
    """
    Overrides 'base_urls' and 'dispatch_subresource' in order to manage an unlimited resource field inheritance tree depth.
    """

    def __init__(self, *args, **kwargs):
        self._helper = ResourceHelper()
        super(RootModelResourceMixin, self).__init__(*args, **kwargs)

    def base_urls(self):
        # For some weird reason, the order (subresource urls first) is important here.
        return self._subresource_urls() + super(RootModelResourceMixin, self).base_urls()

    def dispatch_subresource(self, request, **kwargs):
        return self._dispatch_subresource(request=request, kwargs=kwargs)

    @contract
    def _subresource_urls(self, resource=None, regex=r"^", depth=0):
        """
        :type resource: Resource|None
        :type regex: str|None
        :type depth: int
        """

        if resource is None:
            resource = self

        resource_name_field = self._helper.resource_name_field(depth=depth)
        resource_pk_field = self._helper.resource_pk_field(depth=depth)
        url_name = self._url_name(depth=depth)

        regex_list = regex + r"(?P<{resource_name_field}>{resource_name})/".format(
            resource_name_field=resource_name_field,
            resource_name=resource._meta.resource_name
        )
        regex_detail = regex_list + r"(?P<{resource_pk_field}>\w[\w-]*)".format(
            resource_pk_field=resource_pk_field
        )

        url_list = []

        # The base resource and first level resources urls are managed by 'MongoEngineResource.base_urls'.
        if depth > 1:
            url_list += [
                urls.url(
                    regex=r"{}$".format(regex_list),
                    view=self.wrap_view('dispatch_subresource'),
                    kwargs={'request_type': 'list'},
                    name='{url_name}_list'.format(url_name=url_name)
                ),
                urls.url(
                    regex=r"{}{}$".format(regex_detail, utils.trailing_slash()),
                    view=self.wrap_view('dispatch_subresource'),
                    kwargs={'request_type': 'detail'},
                    name='{url_name}_detail'.format(url_name=url_name)
                )
            ]

        for field_object in resource.fields.itervalues():
            if isinstance(field_object, EmbeddedListField):
                subresource_urls = self._subresource_urls(
                    resource=field_object.to_class(self._meta.api_name),
                    regex=r"{}/".format(regex_detail),
                    depth=depth + 1
                )
                url_list.extend(subresource_urls)

        return url_list

    def _dispatch_subresource(self, request, kwargs, resource=None, depth=1):
        """
        Going recursively though the resource fields hierarchy tree in order to find the requested resource.
        The recursion stops when there's no 'subresource_X_name' field in 'kwargs'.
        """

        kwargs = copy.copy(kwargs)

        if resource is None:
            resource = self

        # Child resource.
        subresource_name_field = self._helper.resource_name_field(depth=depth)

        # Notice that we pop the field from the 'kwargs' otherwise this might confuse Tastypie's dispatcher.
        subresource_name = kwargs.pop(subresource_name_field, None)

        if subresource_name is None:
            return resource.dispatch(request=request, **kwargs)

        # ...otherwise, go deeper in the fields hierarchy tree.
        else:
            subresource = resource.fields[subresource_name].to_class(self._meta.api_name)
            return self._dispatch_subresource(
                request=request,
                kwargs=kwargs,
                resource=subresource,
                depth=depth+1
            )

    def _url_name(self, depth):
        if depth == 0:
            return None
        elif depth == 1:
            return 'api_dispatch_subresource'
        else:
            return 'api_dispatch_subresource_{depth}'.format(depth=depth)
