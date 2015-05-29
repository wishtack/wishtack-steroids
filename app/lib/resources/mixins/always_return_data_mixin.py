#-*- coding: utf-8 -*-
#
# @license: MIT
#
# (c) 2013-2014 Wishtack
#
# $Id: 992135f900a19410f464d3cddcff6953c14d8b82 $
#

from .resource_helper import ResourceHelper

class AlwaysReturnDataMixin(object):

    def __init__(self, *args, **kwargs):
        ResourceHelper().set_meta_if_not_set(self, 'always_return_data', True)
        super(AlwaysReturnDataMixin, self).__init__(*args, **kwargs)