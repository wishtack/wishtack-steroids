#-*- coding: utf-8 -*-
#
# (c) 2013-2015 Wishtack
#
# $Id: $
#
from ...lib.resources.advanced_authorization import AdvancedAuthorization, AdvancedAuthorizationRule
from ...lib.resources.bases import RootModelResource
from ...lib.resources.conditions.condition_everybody import ConditionEverybody
from ...models.event import Event


class EventResource(RootModelResource):

    _EVENT_ADMIN_EDITABLE_FIELDS = [
        Event.end_datetime.name,
        Event.start_datetime.name,
        Event.title.name
    ]

    class Meta:

        authorization = AdvancedAuthorization(
                rule_list=[
                    AdvancedAuthorizationRule(
                            allowed_method_list=['create_detail', 'delete_detail', 'read_detail', 'read_list'],
                            condition=ConditionEverybody(),
                            field_editable_list=EventResource._EVENT_ADMIN_EDITABLE_FIELDS,
                            field_readable_list=EventResource._EVENT_ADMIN_EDITABLE_FIELDS
                    )
                ])
        queryset = Event.objects.all()
        resource_key = u"event"
        resource_name = u"events"
