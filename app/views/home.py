# -*- coding: utf-8 -*-
#
# (c) 2013-2015 Wishtack
#
# $Id: $
#

import json
import os.path

from django.conf import settings
from django.template.response import TemplateResponse
from django.views.generic.base import View


class HomeView(View):

    _bower_dependencies = None

    def __init__(self):
        if self._bower_dependencies is None:
            with open(os.path.join(settings.BASE_DIR, u"bower.json")) as package_json_file:
                bower_dependencies = json.loads(package_json_file.read())['dependencies']
                # Replacing '-' and '.' by '_' for keys in order to use them in template
                self._bower_dependencies = {k.replace('-', '_').replace('.', '_'):v
                                            for k, v in bower_dependencies.items()}

    def dispatch(self, request, *args, **kwargs):

        # @warning: we trust the x-forwarded-host because this is only used in debug mode.
        # @todo: this has to be moved somewhere else with an env var that tells how many reverse proxy there are for security reasons and in order to handle x-forwarded-host with multiple values.
        host = request.META.get('HTTP_X_FORWARDED_HOST') or request.META.get('HTTP_HOST') or u"localhost"

        # Getting rid of the port.
        hostname = host.split(u":")[0]

        return TemplateResponse(
            request,
            'home.html',
            {
                'bower_dependencies': self._bower_dependencies,
                'debug': settings.DEBUG,
                'livereload_hostname': hostname
            })
