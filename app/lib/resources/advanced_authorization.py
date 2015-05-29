# -*- coding: utf-8 -*-
#
# (c) 2013-2014 Wishtack
#
# $Id: 33d44830d332854d516cfb1deb6f85b277a1d761 $
#

import logging

from contracts import new_contract, contract
from synthetic import synthesize_member, synthesize_constructor
from tastypie.authorization import Authorization
from tastypie.bundle import Bundle
from tastypie.exceptions import ImmediateHttpResponse
from tastypie.http import HttpForbidden
from tastypie.resources import Resource

from .conditions.abstract_condition import AbstractCondition


logger = logging.getLogger(__name__)


class AdvancedAuthorizationRuleError(Exception):
    pass

class AdvancedAuthorizationRuleInvalidAllowedMethodListError(AdvancedAuthorizationRuleError):

    def __init__(self, invalid_method_list, valid_method_list):
        super(AdvancedAuthorizationRuleInvalidAllowedMethodListError, self).__init__(
            u"Following methods are invalid {invalid_method_list}. Valid values are {valid_method_list}".format(
                invalid_method_list=invalid_method_list,
                valid_method_list=valid_method_list
            )
        )


@synthesize_member('allowed_method_list', contract='list(str)')
@synthesize_member('condition', contract=AbstractCondition)
@synthesize_member('field_editable_list', contract='list(str)', default=[])
@synthesize_member('field_readable_list', contract='list(str)', default=[])
@synthesize_constructor()
class AdvancedAuthorizationRule(object):

    def __init__(self):

        invalid_method_list = sorted(
            set(self.allowed_method_list()) - set(AdvancedAuthorization.AUTHORIZATION_METHOD_LIST)
        )

        if len(invalid_method_list) > 0:
            raise AdvancedAuthorizationRuleInvalidAllowedMethodListError(
                invalid_method_list=invalid_method_list,
                valid_method_list=AdvancedAuthorization.AUTHORIZATION_METHOD_LIST
            )

        super(AdvancedAuthorizationRule, self).__init__()


new_contract('AdvancedAuthorizationRule', AdvancedAuthorizationRule)
new_contract('Bundle', Bundle)
new_contract('Resource', Resource)

@synthesize_member('rule_list', contract='list(AdvancedAuthorizationRule)', default=[])
@synthesize_constructor()
class AdvancedAuthorization(Authorization):

    AUTHORIZATION_METHOD_LIST = [
        'create_detail',
        'create_list',
        'delete_detail',
        'delete_list',
        'read_detail',
        'read_list',
        'update_detail',
        'update_list'
    ]

    def __new__(cls, *args, **kwargs):

        # Generate api authorization methods instead of writing them manually. Thanks Guido ;).
        for method_name in cls.AUTHORIZATION_METHOD_LIST:
            setattr(cls, method_name, cls._make_api_method_authorization(method_name=method_name))

        return super(AdvancedAuthorization, cls).__new__(cls, *args, **kwargs)

    @contract
    def matching_rule(self, bundle, resource):
        """
        Returns the first rule that has a condition that matches the given bundle.
        :type bundle: Bundle
        :type resource: Resource
        :return: the matched `FieldAuthorizationRule` or None if no match.
        """

        for authorization_rule in self.rule_list():

            condition = authorization_rule.condition()

            # Field authorization condition didn't match, skipping to next condition.
            if condition.check(bundle=bundle, resource=resource):
                return authorization_rule

        return None

    @classmethod
    def _make_api_method_authorization(cls, method_name):

        @contract
        def api_method_wrapper(instance, object_list, bundle, resource):
            """
            :type bundle: Bundle
            :type resource: Resource
            """

            matching_rule = instance.matching_rule(bundle=bundle, resource=resource)

            if matching_rule is None or method_name not in matching_rule.allowed_method_list():
                logger.error(u"security - user '{user_id}' attempts an unauthorized '{action}' \
of resource '{resource_path}'.".format(
                    action=method_name,
                    resource_path=bundle.request.path,
                    user_id=bundle.request.user.id if bundle.request.user is not None else u"anonymous"
                ))
                raise ImmediateHttpResponse(response=HttpForbidden())

            if method_name.endswith('_list'):
                return object_list
            else:
                return True

        return api_method_wrapper
