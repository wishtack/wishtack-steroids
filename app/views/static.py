#-*- coding: utf-8 -*-
#
# (c) 2013-2015 Wishtack
#
# $Id: $
#

import django.contrib.staticfiles.views
from django.views.generic import View


class StaticView(View):

    def dispatch(self, request, cache_forever=False, *args, **kwargs):

        response = django.contrib.staticfiles.views.serve(request=request, *args, **kwargs)

        if cache_forever:
            # Actually it caches for 30 days just in case we have some static file revision id collision.
            response['Cache-Control'] = u"public,max-age=2592000"

        return response
