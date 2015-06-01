import re

from django.conf import settings
from django.conf.urls import patterns, url

from urls_app import urlpatterns as app_urlpatterns

from .views.home import HomeView


#
# Home view.
#
urlpatterns = patterns(
    '',
    url(r'^/?$', HomeView.as_view(), name='home'),
)

#
# Assets.
#
urlpatterns += patterns(
    '',
    url(
        r'^%s(?P<path>.*)$' % re.escape(settings.STATIC_URL.lstrip('/')),
        'django.views.static.serve'
    )
)

urlpatterns += app_urlpatterns
