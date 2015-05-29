# -*- coding: utf-8 -*-
#
# (c) 2013-2015 Wishtack
#
# $Id: $
#

from settings_utils import SettingsUtils


utils = SettingsUtils(globals())
utils.import_from_environment('MONGODB_URL')
