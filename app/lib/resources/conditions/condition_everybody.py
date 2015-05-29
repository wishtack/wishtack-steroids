# -*- coding: utf-8 -*-
#
# (c) 2013-2014 Wishtack
#
# $Id: 027482f10cba58f2de2a2f2e602a483b993a89d2 $
#

from .abstract_condition import AbstractCondition


class ConditionEverybody(AbstractCondition):

    def _check(self, bundle, resource):

        return True
