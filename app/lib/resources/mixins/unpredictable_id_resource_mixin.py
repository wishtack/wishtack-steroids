# -*- coding: utf-8 -*-
#
# (c) 2013-2014 Wishtack
#
# $Id: 550a96663c116f51d266024045c9c42d9f74211c $
#

from tastypie.exceptions import ImmediateHttpResponse
from tastypie.http import HttpNotFound

from ....lib.utils import Utils
from ....models.mixins.unpredictable_id_mixin import UnpredictableIdMixin

from .resource_helper import ResourceHelper


class UnpredictableIdResourceMixin(object):

    def dehydrate(self, bundle):

        # Applying mixins 'dehydrate' overrides.
        bundle = super(UnpredictableIdResourceMixin, self).dehydrate(bundle)

        if isinstance(bundle.obj, UnpredictableIdMixin):
            bundle.data['id'] = bundle.obj.unpredictable_id()

        return bundle

    def hydrate(self, bundle):

        if isinstance(bundle.obj, UnpredictableIdMixin):
            bundle.data['id'] = bundle.obj.id

        return super(UnpredictableIdResourceMixin, self).hydrate(bundle)

    def obj_get(self, bundle, **kwargs):

        # No id transform to do as we are not using an unpredictable id with token suffix.
        if not issubclass(self._meta.object_class, UnpredictableIdMixin):
            return super(UnpredictableIdResourceMixin, self).obj_get(bundle, **kwargs)

        unpredictable_id = kwargs['pk']
        obj_id, obj_token = UnpredictableIdMixin.split_unpredictable_id(unpredictable_id=unpredictable_id)

        kwargs['pk'] = obj_id

        obj = super(UnpredictableIdResourceMixin, self).obj_get(bundle, **kwargs)

        if obj._token != obj_token:
            Utils().logger().error(u"Invalid unpredictable id token ({unpredictable_id})."
                                   .format(unpredictable_id=unpredictable_id))
            raise ImmediateHttpResponse(response=HttpNotFound())

        return obj

    def detail_uri_kwargs(self, bundle):
        """
        Construct URL kwargs like {'pk': blog_id, 'subresource_pk': post_id, subresource_2_pk': comment_id}.
        """

        resource_helper = ResourceHelper()

        kwargs = super(UnpredictableIdResourceMixin, self).detail_uri_kwargs(bundle_or_obj=bundle)

        depth = resource_helper.depth(resource=self)

        obj = bundle.obj

        resource = self

        for depth in range(depth, -1, -1):

            kwargs[resource_helper.resource_name_field(depth=depth)] = resource._meta.resource_name

            kwargs[resource_helper.resource_pk_field(depth=depth)] = \
                obj.unpredictable_id() if isinstance(obj, UnpredictableIdMixin) else obj.id

            if depth > 0:
                resource = resource.parent
                obj = bundle.request.resource(resource._meta.resource_key)

        return kwargs
