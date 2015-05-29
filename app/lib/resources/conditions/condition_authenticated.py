# -*- coding: utf-8 -*-
#
# (c) 2013-2014 Wishtack
#
# $Id: 9e3367b1805633d0f59b909b99006a52bcdb4dbb $
#

from .abstract_condition import AbstractCondition


class ConditionAuthenticated(AbstractCondition):

    def _check(self, bundle, resource):

        return bundle.request.user is not None
