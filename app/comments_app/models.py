from django.db import models
from django.utils import timezone

class Comment(models.Model):
    user_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    homepage = models.URLField(max_length=200, blank=True)
    text = models.TextField()
    parent_comment = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    text_file = models.FileField(upload_to='text_files/', null=True, blank=True)


    def __str__(self):
        return self.text[:200]
    
