# -*- coding: utf-8 -*-
#
# (c) 2013-2014 Wishtack
#
# $Id: 39c66831a985f0a7aacda487a89ac6d2762f6279 $
#
from contracts import contract, new_contract

from synthetic import synthesize_member, synthesize_constructor
from tastypie.bundle import Bundle
from tastypie.resources import Resource


new_contract('Bundle', Bundle)
new_contract('Resource', Resource)


@synthesize_member('apply_to', contract='str|None', default=None)
@synthesize_constructor()
class AbstractCondition(object):

    @contract
    def check(self, bundle, resource):
        """
        :type bundle: Bundle
        :type resource: Resource
        :return: Boolean result of condition check.
        """

        return self._check(bundle=bundle, resource=resource)

    def _object_to_compare(self, bundle, resource):

        apply_to = self.apply_to()

        if apply_to is None:

            return bundle.obj

        else:

            return bundle.request.resource(apply_to)
