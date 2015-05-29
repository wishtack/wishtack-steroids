# -*- coding: utf-8 -*-
#
# (c) 2013-2014 Wishtack
#
# $Id: ab2fc3dd42e854eb2bb4cb09132b405f257fb020 $
#

import copy


class AutoAddObjectToRequestMixin(object):

    def obj_get(self, bundle, **kwargs):

        # Store the last retrieved object as it might be used by child resources who might use `parent.object`.
        obj = super(AutoAddObjectToRequestMixin, self).obj_get(bundle, **kwargs)

        bundle.request.set_resource(self._meta.resource_key, obj)

        return obj

    def full_dehydrate(self, bundle, for_list=False):

        bundle.request = copy.copy(bundle.request)

        bundle.request.set_resource(self._meta.resource_key, bundle.obj)

        return super(AutoAddObjectToRequestMixin, self).full_dehydrate(bundle=bundle, for_list=for_list)

