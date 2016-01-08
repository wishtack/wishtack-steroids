#-*- coding: utf-8 -*-
#
# (c) 2013-2015 Wishtack
#
# $Id: $
#

from ...lib.resources.advanced_authorization import AdvancedAuthorization, AdvancedAuthorizationRule
from ...lib.resources.bases import RootModelResource
from ...lib.resources.conditions.condition_everybody import ConditionEverybody
from ...models.member import Member


class MemberResource(RootModelResource):

    class Meta:

        authorization = AdvancedAuthorization(
                rule_list=[
                    AdvancedAuthorizationRule(
                            allowed_method_list=['create_detail', 'delete_detail', 'read_detail', 'read_list'],
                            condition=ConditionEverybody(),
                            field_editable_list=[
                                Member.email.name
                            ],
                            field_readable_list=[
                                Member.email.name
                            ]
                    )
                ])
        queryset = Member.objects.all()
        resource_key = u"member"
        resource_name = u"members"
