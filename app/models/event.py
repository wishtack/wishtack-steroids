#-*- coding: utf-8 -*-
#
# (c) 2013-2015 Wishtack
#
# $Id: $
#

from mongoengine import Document, fields

from ..lib.utils import Utils


class Event(Document):

    creation_datetime = fields.DateTimeField(default=Utils().now())
    title = fields.StringField()
    start_datetime = fields.DateTimeField()
    end_datetime = fields.DateTimeField()
