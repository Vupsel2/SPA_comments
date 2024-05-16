from django.db import models


class Comment(models.Model):
    user_name = models.CharField(max_length=100)
    email=models.EmailField(max_length=100)
    homepage = models.URLField(max_length=200, blank=True)
    text = models.TextField()

    def __str__(self):
        return self.text[:20]
