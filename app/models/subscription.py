#-*- coding: utf-8 -*-
#
# (c) 2013-2015 Wishtack
#
# $Id: $
#

from mongoengine import fields

from .price import Price
from ..lib.utils import Utils


class Subscription(fields.EmbeddedDocument):

    begin_date = fields.DateTimeField(default=Utils().now())
    end_date = fields.DateTimeField()
    price = fields.EmbeddedDocumentField(Price)
