import re

from django.conf import settings
from django.conf.urls import patterns, url, include
from tastypie.api import Api

from urls_app import urlpatterns as app_urlpatterns

from .views.api.member_resource import MemberResource
from .views.home import HomeView
from .views.static import StaticView


#
# Home view.
#
urlpatterns = patterns(
    '',
    url(r'^/?$', HomeView.as_view(), name='home'),
)

#
#  API routes.
#

api = Api(api_name=u"v1")
api.register(MemberResource())
urlpatterns += patterns('', (r'^api/', include(api.urls)))

#
# Assets.
#
urlpatterns += patterns(
    '',
    url(r'^%s(?P<path>.*)$' % re.escape(settings.STATIC_URL.lstrip('/')),
        StaticView.as_view(),
        {
            'cache_forever': True,
            'insecure': True
        }
        )
)

urlpatterns += app_urlpatterns
