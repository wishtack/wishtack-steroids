#-*- coding: utf-8 -*-
#
# @license: MIT
#
# (c) 2013-2014 Wishtack
#
# $Id: 27b55fb38c1a38d850c354167281522ee3f5c8a6 $
#

import logging

logger = logging.getLogger(__name__)

class ExceptionHandlerMixin(object):

    def _handle_500(self, request, exception):
        logger.exception(exception)
        return super(ExceptionHandlerMixin, self)._handle_500(request, exception)