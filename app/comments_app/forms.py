from django import forms
from .models import Comment

class comments_form(forms.ModelForm):
    class Meta:
        model=Comment
        fields=["user_name", "email", "homepage", "text"]