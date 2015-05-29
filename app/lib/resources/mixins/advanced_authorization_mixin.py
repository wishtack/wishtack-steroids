#-*- coding: utf-8 -*-
#
# @license: MIT
#
# (c) 2013-2014 Wishtack
#
# $Id: fa6c3dc1c000ff952f7a2a4612c4e388ff1da7a6 $
#

import itertools
import logging

from synthetic import synthesize_constructor, synthesize_property
from tastypie.bundle import Bundle
from tastypie.exceptions import ImmediateHttpResponse, Unauthorized
from tastypie.fields import RelatedField
from tastypie.http import HttpForbidden
from tastypie.resources import Resource

from ..advanced_authorization import AdvancedAuthorization


logger = logging.getLogger(__name__)


@synthesize_property('resource', contract=Resource)
@synthesize_constructor()
class BundleWithResource(Bundle):
    """
    This class overrides `tastypie.bundle.Bundle` in order to add the 'resource' attribute that we use in to get
    the parent resources in `ICondition` implementations like `ConditionFriend` where we sometimes have to check
    that the wish's parent resource (which is the wish's owner) is a friend of the authenticated user.
    """
    pass


class AdvancedAuthorizationMixinError(Exception):
    pass

class AdvancedAuthorizationMixinInvalidAuthorizationClassError(AdvancedAuthorizationMixinError):

    def __init__(self):
        super(AdvancedAuthorizationMixinInvalidAuthorizationClassError, self).__init__(
            u"Meta.authorization must be an instance of `AdvancedAuthorization`."
        )

class AdvancedAuthorizationMixin(object):
    """
    Makes all resource's fields readyonly except those in 'editable_fields' Meta field.
    This effect can be disabled by setting 'editable_entirely' Meta field to 'True'.
    """

    _KEY_AUTHORIZATION = 'authorization'

    def __new__(cls, *args, **kwargs):

        # Generate api authorization methods instead of writing them manually. Thanks Guido ;).
        for method_name in AdvancedAuthorization.AUTHORIZATION_METHOD_LIST:
            setattr(cls, 'authorized_{}'.format(method_name), cls._make_authorized_method(method_name=method_name))

        return super(AdvancedAuthorizationMixin, cls).__new__(cls, *args, **kwargs)


    def __init__(self, *args, **kwargs):
        super(AdvancedAuthorizationMixin, self).__init__(*args, **kwargs)

        # Nothing to do if 'authorization' is not an instance of `AdvancedAuthorization`.
        advanced_authorization_meta = self._advanced_authorization_meta()
        if advanced_authorization_meta is None:
            raise AdvancedAuthorizationMixinInvalidAuthorizationClassError()

        setattr(self._meta, 'detail_allowed_methods', ['delete', 'get', 'patch', 'post'])
        setattr(self._meta, 'list_allowed_methods', ['delete', 'get', 'patch', 'post', 'put'])

    def serialize(self, request, data, format, options=None):
        """
        Filters exposition of readable and editable fields depending on user authorization condition.
        Raises an `ImmediateHttpResponse(response=HttpForbidden())` error if no field is authorized.
        We override `serialize` while we should override `alter_detail_data_to_serialize` and
        `alter_list_data_to_serialize` but `alter_detail_data_to_serialize` because `alter_detail_data_to_serialize`
        is called before `obj_update` in `Resource.patch_detail` and fields become missing in our implementation.
        """

        self._filter_serialized_data(data)

        return super(AdvancedAuthorizationMixin, self).serialize(request=request, data=data, format=format)

    def obj_create(self, bundle, **kwargs):
        """
        `update_in_place` below filters data when a resource is or updated but not when created that's why
         we override `obj_create`.
        """

        self._filter_data(bundle=bundle, data=bundle.data)

        return super(AdvancedAuthorizationMixin, self).obj_create(bundle=bundle, **kwargs)

    def update_in_place(self, request, original_bundle, new_data):
        """
        Filters edition of editable fields depending on user authorization condition.
        Raises an `ImmediateHttpResponse(response=HttpForbidden())` error if no field is authorized.
        It might seem better to use `hydrate` here but in the case of a resource update,
        user input data are merged with data from resource. That's why we override
        `update_in_place`. This way we can apply the filter only to user input data.
        Another option is to user `alter_deserialized_detail_data` but in that case we don't have the object
        when it's an update.

        :param bundle:
        :return: bundle
        """

        self._filter_data(bundle=original_bundle, data=new_data)

        return super(AdvancedAuthorizationMixin, self).update_in_place(
            request=request,
            original_bundle=original_bundle,
            new_data=new_data
        )

    def _advanced_authorization_meta(self):
        authorization = getattr(self._meta, self._KEY_AUTHORIZATION, None)

        return authorization if isinstance(authorization, AdvancedAuthorization) else None

    def _filter_data(self, bundle, data, is_read=False):
        """

        :param bundle:
        :param data: data to filter
        :param is_read: tells if readable fields must be considered. It's set to True to tell that
         both readable and editable fields are allowed to be exposed.
        :return: bundle
        """

        authorization_rule = self._advanced_authorization_meta().matching_rule(bundle=bundle, resource=self)

        rejected_data = {}

        # We've got a field authorization condition match here.
        if authorization_rule is not None:
            for key, value in data.items():
                if key not in itertools.chain(
                        authorization_rule.field_readable_list() if is_read else [],
                        authorization_rule.field_editable_list()
                ):
                    rejected_data[key] = value
                    del data[key]

        if authorization_rule is None or len(data) == 0:
            logger.error(u"security - user '{user_id}' attempts an unauthorized {action} of resource '{resource_path}'.\
 Rejected data: {rejected_data}".format(
                action=u"read" if is_read else u"edit",
                rejected_data=rejected_data,
                resource_path=bundle.request.path,
                user_id=bundle.request.user.id if bundle.request.user is not None else u"anonymous"
            ))
            raise ImmediateHttpResponse(response=HttpForbidden())

    def _filter_serialized_data(self, data):
        """
        Filters exposed data using the recursive method `_filter_serialized_bundle`.
        """

        if isinstance(data, Bundle):
            self._filter_serialized_bundle(bundle=data)
        else:
            for bundle in data.get('objects', []):
                self._filter_serialized_bundle(bundle=bundle)

    def _filter_serialized_bundle(self, bundle):
        """
        Filters exposed data recursively.
        """

        self._filter_data(bundle=bundle, data=bundle.data, is_read=True)

        for key, value in bundle.data.items():
            field = self.fields.get(key)
            if field is None \
                    or not isinstance(field, RelatedField) \
                    or value is None:
                continue

            if isinstance(value, list):
                for field_bundle in value:
                    resource = field.get_related_resource(field_bundle)
                    resource._filter_serialized_bundle(bundle=field_bundle)
            else:
                resource = field.get_related_resource(value)
                resource._filter_serialized_bundle(bundle=value)

    @classmethod
    def _make_authorized_method(cls, method_name):
        """
        Overrides 'authorized_*' methods in order to add the current resource as a parameter.
        """

        def authorized_method(instance, object_list, bundle):

            try:
                auth_result = getattr(instance._meta.authorization, method_name)(
                    object_list=object_list,
                    bundle=bundle,
                    resource=instance  # Passing current resource as an additional parameter.
                )

                # '*_detail' methods except a boolean result while '*_list' methods return the list
                # of authorized objects.
                if method_name.endswith('_detail') and not auth_result is True:
                   raise Unauthorized()

            except Unauthorized as e:
                instance.unauthorized_result(e)

            return auth_result

        return authorized_method
