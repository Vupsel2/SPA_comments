from django import forms
from django.core.exceptions import ValidationError
from .models import Comment
import re

ALLOWED_TAGS = ['a','i', 'code', 'strong']
ALLOWED_ATTRIBUTES = ['href', 'title']

def validate_html(value):
    stack = []
    tag_re = re.compile(r'<(\/?)(\w+)([^>]*?)>')

    for match in tag_re.finditer(value):
                
        tag, tag_name, attributes = match.groups()

        if tag_name not in ALLOWED_TAGS:
            raise ValidationError(f'Использование тега <{tag_name}> не разрешено.')
        
        if attributes:
            
            attr_re = re.compile(r'(\w+)\s*=\s*["\']([^"\']*)["\']')
            print(attributes)   
            print("attr_match ",attr_re.findall(attributes))
            for attr_match in attr_re.finditer(attributes):
                print("attr_match ",attr_match)
                attr_name, attr_value = attr_match.groups()
                print("attr_name ",attr_name, "attr_value",attr_value)
                if attr_name not in ALLOWED_ATTRIBUTES:
                    raise ValidationError(f'Использование атрибута {attr_name} не разрешено.')
                
        if not tag:
            stack.append(tag_name)
        else:
            if not stack or stack.pop() != tag_name:
                raise ValidationError(f'Неправильное закрытие тега <{tag_name}>.')
            
    if stack:
        raise ValidationError(f'Некоторые теги не закрыты: {", ".join(stack)}')
        



class comments_form(forms.ModelForm):
    parent_comment_id = forms.IntegerField(required=False, widget=forms.HiddenInput())

    class Meta:
        model = Comment
        fields = ['user_name', 'email', 'homepage', 'text', 'image', 'text_file']

    def clean_text(self):
        text = self.cleaned_data.get('text', '')
        validate_html(text)
        return text
