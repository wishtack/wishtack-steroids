# -*- coding: utf-8 -*-
#
# (c) 2013-2014 Wishtack
#
# $Id: fbcaa58131475204ceae38b248269b3ef8ad1873 $
#

from .abstract_condition import AbstractCondition

class ConditionFriend(AbstractCondition):

    def _check(self, bundle, resource):

        if bundle.request.user is None:
            return False

        friend = self._object_to_compare(bundle=bundle, resource=resource)

        return bundle.request.user.is_friend(friend)
