#-*- coding: utf-8 -*-
#
# @license: MIT
#
# (c) 2013-2014 Wishtack
#
# $Id: 2afc61daaf26b1157e386484bcdbb40c312a3881 $
#

import tastypie.resources
from tastypie.resources import BaseModelResource
from tastypie_mongoengine.resources import MongoEngineResource

from .mixins.advanced_authorization_mixin import AdvancedAuthorizationMixin
from .mixins.always_return_data_mixin import AlwaysReturnDataMixin
from .mixins.auto_add_object_to_request_mixin import AutoAddObjectToRequestMixin
from .mixins.camel_case_serializer_mixin import CamelCaseSerializerMixin
from .mixins.child_model_resource_mixin import ChildModelResourceMixin
from .mixins.exception_handler_mixin import ExceptionHandlerMixin
from .mixins.fix_adhoc_children_resources_mixin import FixAdhocChildrenResourcesMixin
from .mixins.get_bundle_data_mixin import GetBundleDataMixin
from .mixins.root_model_resource_mixin import RootModelResourceMixin
from .mixins.unpredictable_id_resource_mixin import UnpredictableIdResourceMixin


class CommonResourceMixins(
    AdvancedAuthorizationMixin,
    AlwaysReturnDataMixin,
    AutoAddObjectToRequestMixin,
    CamelCaseSerializerMixin,
    ExceptionHandlerMixin,
    FixAdhocChildrenResourcesMixin,
    GetBundleDataMixin,
    UnpredictableIdResourceMixin
):
    pass


# Mixins order is important.
class Resource(CommonResourceMixins, tastypie.resources.Resource):
    pass


# Mixins order is important.
class ChildModelResource(CommonResourceMixins, ChildModelResourceMixin, MongoEngineResource):
    pass


# Mixins order is important.
class RootModelResource(CommonResourceMixins, RootModelResourceMixin, MongoEngineResource):
    pass
