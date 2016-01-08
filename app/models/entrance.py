#-*- coding: utf-8 -*-
#
# (c) 2013-2015 Wishtack
#
# $Id: $
#

from bson import ObjectId
from mongoengine import fields

from ..lib.utils import Utils


class Entrance(fields.EmbeddedDocument):

    id = fields.ObjectIdField(default=ObjectId)
    date = fields.DateTimeField(default=Utils().now())
    # event = fields.ReferenceField('Event')
