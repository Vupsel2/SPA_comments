from django.db import models
from django.utils import timezone
from django.core.cache import cache
from django.template.loader import render_to_string

class Comment(models.Model):
    user_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    homepage = models.URLField(max_length=200, blank=True)
    text = models.TextField()
    parent_comment = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)

    
    def render_comment(self):
        cache_key = f'comment_{self.pk}_html'
        html = cache.get(cache_key)
        if not html:
            html = render_to_string('comments_app/comment_item.html', {'comment': self})
            cache.set(cache_key, html, 60 * 15)  
        return html


    def __str__(self):
        return self.text[:200]
class CommentFile(models.Model):
    comment = models.ForeignKey(Comment, related_name='files', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    text_file = models.FileField(upload_to='text_files/', null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
