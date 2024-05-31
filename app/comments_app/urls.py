from django.urls import path, include
from . import views
from django.conf import settings
from django.conf.urls.static import static
from captcha.views import captcha_refresh


urlpatterns = [
    path('captcha/', include('captcha.urls')),
    path('captcha/', views.generate_captcha, name='generate_captcha'),
    path('captcha/refresh/', captcha_refresh, name='refresh_captcha'),
    path('upload_files/', views.upload_files, name='upload_files'),
    path('comments/', views.comments_table, name='comments_table'),
    path('', views.home)
    
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)




