from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('queue/', views.comment, name='comment'),
    path('comments/', views.comments_table, name='comments_table'),
    path('', views.home)
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)