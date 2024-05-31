from django import forms
from django.core.exceptions import ValidationError
from django.forms.models import inlineformset_factory
from .models import Comment, CommentFile
import re
from bleach import clean
from captcha.fields import CaptchaField

ALLOWED_TAGS = ['a', 'i', 'code', 'strong']
ALLOWED_ATTRIBUTES = {'a': ['href', 'title']}

def validate_html(value):
    clean_value = clean(value, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRIBUTES)
    if value != clean_value:
        raise ValidationError('HTML содержит недопустимые теги или атрибуты')
    return clean_value
            

class CommentFileForm(forms.ModelForm):
    class Meta:
        model = CommentFile
        fields = ['image', 'text_file']

class comments_form(forms.ModelForm):
    parent_comment_id = forms.IntegerField(required=False, widget=forms.HiddenInput())
    captcha = CaptchaField()
    class Meta:
        model = Comment
        fields = ['user_name', 'email', 'homepage', 'text',]

    def clean_text(self):
        text = self.cleaned_data.get('text', '')
        validate_html(text)
        return text
