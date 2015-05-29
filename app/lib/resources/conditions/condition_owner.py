# -*- coding: utf-8 -*-
#
# (c) 2013-2014 Wishtack
#
# $Id: 462a0b94e62e62840eac7419c875221fd792b9c7 $
#

from .abstract_condition import AbstractCondition


class ConditionOwner(AbstractCondition):

    def _check(self, bundle, resource):

        if bundle.request.user is None:
            return False

        owner = self._object_to_compare(bundle=bundle, resource=resource)

        return owner.id == bundle.request.user.id
