#-*- coding: utf-8 -*-
#
# @license: MIT
#
# (c) 2013-2014 Wishtack
#
# $Id: e6ddf1d3f502b95f1965b0b963b57699d1732385 $
#

from ..camel_case_json_serializer import CamelCaseJSONSerializer
from .resource_helper import ResourceHelper

class CamelCaseSerializerMixin(object):

    def __init__(self, *args, **kwargs):
        ResourceHelper().set_meta_if_not_set(self, 'serializer', CamelCaseJSONSerializer())

        super(CamelCaseSerializerMixin, self).__init__(*args, **kwargs)