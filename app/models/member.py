# -*- coding: utf-8 -*-
#
# (c) 2013-2015 Wishtack
#
# $Id: $
#

from mongoengine import Document, fields

from .entrance import Entrance
from .subscription import Subscription
from ..lib.utils import Utils


class Member(Document):
    creation_datetime = fields.DateTimeField(default=Utils().now())
    email = fields.EmailField()
    entrance_list = fields.ListField(field=fields.EmbeddedDocumentField(Entrance))
    first_name = fields.StringField()
    last_name = fields.StringField()
    # registration_number = fields.IntField(required=True)
    subscription_list = fields.ListField(fields.EmbeddedDocumentField(Subscription))
