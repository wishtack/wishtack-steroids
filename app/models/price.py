#-*- coding: utf-8 -*-
#
# (c) 2013-2015 Wishtack
#
# $Id: $
#

from mongoengine import fields


class Price(fields.EmbeddedDocument):

    coefficient = fields.IntField(min_value=0)
    currency = fields.StringField()
    exponent = fields.IntField()
