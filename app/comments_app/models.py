from django.db import models

class Comment(models.Model):
    user_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    homepage = models.URLField(max_length=200, blank=True)
    text = models.TextField()
    parent_comment = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)

    def __str__(self):
        return self.text[:200]
    
