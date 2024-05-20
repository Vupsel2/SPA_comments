from django import forms
from .models import Comment

class comments_form(forms.ModelForm):
    parent_comment_id = forms.IntegerField(required=False, widget=forms.HiddenInput())

    class Meta:
        model = Comment
        fields = ['user_name', 'email', 'homepage', 'text', 'image', 'text_file']