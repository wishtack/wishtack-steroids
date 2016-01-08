#-*- coding: utf-8 -*-
#
# (c) 2013-2015 Wishtack
#
# $Id: $
#


class Utils(object):

    def uri_api(self):
        return u"/api/v1/"

    def uri_members_list(self):
        return self.uri_api() + u"members/"
