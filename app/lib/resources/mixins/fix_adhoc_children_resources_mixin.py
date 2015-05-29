# -*- coding: utf-8 -*-
#
# (c) 2013-2014 Wishtack
#
# $Id: e4f65bc8a9dbcdef2e3543a701b59d1c0333bb13 $
#

from tastypie.fields import RelatedField


class FixAdhocChildrenResourcesMixin(object):

    def __init__(self, *args, **kwargs):

        super(FixAdhocChildrenResourcesMixin, self).__init__(*args, **kwargs)

        # Inject current resource in ad-hoc generated sub resource instance.
        self._fix_adhoc_children_resources()

    def _fix_adhoc_children_resources(self):

        current_resource = self

        for field in self.fields.values():

            if isinstance(field, RelatedField):

                wrapped_resource_from_data = field.resource_from_data

                # Wrapping `resource_from_data` that instanciates sub resouces when a field is a `RelatedField`.
                def resource_from_data(fk_resource, *args, **kwargs):
                    fk_resource.parent = current_resource
                    return wrapped_resource_from_data(fk_resource, *args, **kwargs)

                field.resource_from_data = resource_from_data

