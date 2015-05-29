# -*- coding: utf-8 -*-
#
# (c) 2013-2014 Wishtack
#
# $Id: bf4e9a36f2578bbf7fa348fa90ef5b11623a0073 $
#

import binascii
import os

from bson import ObjectId
from mongoengine import fields


def _token_generator(token_length):
    def _generate_token():
        return binascii.hexlify(os.urandom(token_length))
    return _generate_token


class UnpredictableIdMixin(object):

    _TOKEN_BYTES_LENGTH = 8
    _TOKEN_LENGTH = _TOKEN_BYTES_LENGTH * 2

    _token = fields.StringField(default=_token_generator(_TOKEN_BYTES_LENGTH))

    def unpredictable_id(self):
        return unicode(self.id) + self._token

    @classmethod
    def split_unpredictable_id(cls, unpredictable_id):
        return ObjectId(unpredictable_id[:-cls._TOKEN_LENGTH]), unpredictable_id[-cls._TOKEN_LENGTH:]
