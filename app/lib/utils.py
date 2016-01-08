# -*- coding: utf-8 -*-
#
# (c) 2013-2015 Wishtack
#
# $Id: $
#

import datetime
import dateutil.tz


class Utils(object):

    def now(self):

        now = datetime.datetime.now(dateutil.tz.tzutc())

        # Who cares about microseconds anyway !?
        # In addition to this, values are different after mongo read/write.
        return now.replace(microsecond=0)

    def return_false(self, *args, **kwargs):
        return False
