# -*- coding: utf-8 -*-
#
# @license: MIT
#
# (c) 2013-2014 Wishtack
#
# $Id: f331226b9a984dc179872cc5ca2273fb3ca604a6 $
#


class ResourceHelper(object):

    def depth(self, resource=None, depth=0):
        resource = resource if resource is not None else self

        parent = getattr(resource, '_parent', None)
        if parent is not None:
            return self.depth(resource=parent, depth=depth+1)
        else:
            return depth

    def set_meta_if_not_set(self, instance, meta_name, meta_value):
        if not hasattr(instance.Meta, meta_name):
            setattr(instance._meta, meta_name, meta_value)

    def resource_name_field(self, depth):
        if depth == 0:
            return r"resource_name"
        elif depth == 1:
            return r"subresource_name"
        else:
            return r"subresource_{depth}_name".format(depth=depth)

    def resource_pk_field(self, depth):
        if depth == 0:
            return r"pk"
        elif depth == 1:
            return r"subresource_pk"
        else:
            return r"subresource_{depth}_pk".format(depth=depth)
