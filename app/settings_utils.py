# -*- coding: utf-8 -*-
#
# (c) 2013-2015 Wishtack
#
# $Id: $
#


import os

class SettingsUtils(object):

    def __init__(self, globals_object):
        self._globals_object = globals_object
        self._type_parser_dict = {bool: self._parse_bool,
                                  int: self._parse_int,
                                  list: self._parse_list}

    def import_from_environment(self, variable_name, variable_type=str):
        variable_raw_value = os.environ[variable_name]
        self._set_global_objects_attribute(variable_name, variable_raw_value, variable_type)

    def import_from_environment_with_default(self, variable_name, variable_type=str, default=None):
        variable_raw_value = os.environ.get(variable_name, default)
        self._set_global_objects_attribute(variable_name, variable_raw_value, variable_type)

    def _set_global_objects_attribute(self, variable_name, variable_raw_value, variable_type):
        # Looking for a type converter, otherwise it will use the type itself.
        variable_converter = self._type_parser_dict.get(variable_type, variable_type)

        self._globals_object[variable_name] = variable_converter(variable_raw_value)

    def _parse_bool(self, variable_value):
        if variable_value == "True":
            return True
        elif variable_value == "False":
            return False
        else:
            raise TypeError(u"Boolean value must be 'True' or 'False'.")

    def _parse_int(self, variable_value):
        return int(variable_value)

    def _parse_list(self, variable_value):
        return variable_value.split(',')
