# -*- coding: utf-8 -*-
#
# (c) 2013-2014 Wishtack
#
# $Id: d987028b7e74034d0e15eb3821a2e8b753105f3c $
#

from contracts import contract, new_contract

from tastypie.bundle import Bundle

new_contract('Bundle', Bundle)

class GetBundleDataMixin(object):

    @contract
    def get_bundle_data(self, bundle, key):
        """

        :type bundle: Bundle
        :param bundle:
        :param key:
        :return: value or None if not found
        """

        value = bundle.data.get(key)

        # If user is performing an update, embedded fields produced by `Resource.full_dehydrate`
        # will return a `Bundle` object instead of data.
        if isinstance(value, Bundle):
            value = value.data

        return value
