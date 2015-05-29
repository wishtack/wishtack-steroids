# -*- coding: utf-8 -*-
#
# @license: MIT
#
# (c) 2013-2014 Wishtack
#
# $Id: b4f05298c650d607b29f120b7fbff49aca7c4eb5 $
#

import json
import re
import datetime
from tastypie.serializers import Serializer

class CamelCaseJSONSerializer(Serializer):
    """
    Javascript convention is to use CamelCase notation while Python convention is to use underscore notation.
    This can cause ugly initializers and save methods for objects in javascript. This serializer converts the
    JSON packets from one notation to the other as needed.
    """
    formats = ['json']
    content_types = {
        'json': 'application/json',
        }

    def camelize(self, data):

        if isinstance(data, dict):
            new_dict = {}
            for key, value in data.items():
                new_key = re.sub(r"[a-z]_[a-z]", self._underscore_to_camel_case, key)
                new_dict[new_key] = self.camelize(value)
            return new_dict
        if isinstance(data, (list, tuple)):
            for i in range(len(data)):
                data[i] = self.camelize(data[i])
            return data
        return data

    def format_datetime(self, data):
        """
        We don't want to make the date timezone naive as it's done in `Serializer.format_datetime`.
        """

        if self.datetime_formatting == 'iso-8601-strict':
            # Remove microseconds to strictly adhere to iso-8601
            data = data - datetime.timedelta(microseconds=data.microsecond)

        return data.isoformat()

    def to_json(self, data, options=None):

        # Changes underscore_separated names to camelCase names to go from python convention to javacsript convention
        data = self.to_simple(data, options)

        return json.dumps(self.camelize(data), sort_keys=True)

    def from_json(self, content):
        # Changes camelCase names to underscore_separated names to go from javascript convention to python convention
        data = json.loads(content)

        def camelToUnderscore(match):
            return match.group()[0] + "_" + match.group()[1].lower()

        def underscorize(data):
            if isinstance(data, dict):
                new_dict = {}
                for key, value in data.items():
                    new_key = re.sub(r"[a-z][A-Z]", camelToUnderscore, key)
                    new_dict[new_key] = underscorize(value)
                return new_dict
            if isinstance(data, (list, tuple)):
                for i in range(len(data)):
                    data[i] = underscorize(data[i])
                return data
            return data

        underscored_data = underscorize(data)

        return underscored_data

    def _underscore_to_camel_case(self, match):
        return match.group()[0] + match.group()[2].upper()