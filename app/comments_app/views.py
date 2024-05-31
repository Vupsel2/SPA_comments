from django.shortcuts import render
from .forms import comments_form, CommentFileForm
from .models import Comment,CommentFile
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.core.files.images import get_image_dimensions
from PIL import Image
import os
from django.conf import settings
from django.db.models import OuterRef, Subquery
from django.shortcuts import get_object_or_404
from django.utils.crypto import get_random_string
from captcha.image import ImageCaptcha
from django.http import HttpResponse

def generate_captcha(request):
    
    captcha_text = get_random_string(length=6, allowed_chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
    
    request.session['captcha_text'] = captcha_text
    
    image = ImageCaptcha(width=280, height=90)
    data = image.generate(captcha_text)

    return HttpResponse(data, content_type='image/png')

def upload_files(request):
    if request.method == 'POST':

        comment_id = request.POST.get('comment_id')
        comment_base = get_object_or_404(Comment, id=comment_id)
        form = CommentFileForm(request.POST, request.FILES)

        if form.is_valid():
            comment = form.save(commit=False)
            comment.comment = comment_base
            comment.save()
            response_data={'comment_id': comment_base.id}
           
            
            if comment.text_file:
                response_data['txt_file'] = os.path.join( comment.text_file.name)
                
            if comment.image:
                image = comment.image
                width, height = get_image_dimensions(image)
                if width > 320 or height > 240:
                    img = Image.open(image)
                    img.thumbnail((320, 240), Image.Resampling.LANCZOS)
                    img.save(os.path.join(settings.MEDIA_ROOT,comment.image.name))
                response_data['image_file'] = os.path.join(image.name)
                

            return JsonResponse(response_data)

    return JsonResponse({'errors': 'Bad request method'}, status=400)

def home(request):
    comment_list = Comment.objects.filter(parent_comment__isnull=True).order_by('-created_date')

    comment_list = comment_list.annotate(
        image_url=Subquery(CommentFile.objects.filter(comment_id=OuterRef('pk'), image__isnull=False).values('image')[:1]),
        text_file_url=Subquery(CommentFile.objects.filter(comment_id=OuterRef('pk'), text_file__isnull=False).values('text_file')[:1])
    )
    paginator = Paginator(comment_list, 5)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number) 
    form = comments_form()
    form_files=CommentFileForm
    return render(request, 'comments_app/home.html', {'page_obj': page_obj, 'form': form,"form_files":form_files})

def comments_table(request):
    sort_field = request.GET.get('sort', 'user_name')

    if sort_field not in ['user_name', 'email', 'created_date']:
        sort_field = 'created_date'
    
    order = request.GET.get('order', 'asc')
    if order == 'desc':
        sort_field = '-' + sort_field
    
    comments = Comment.objects.filter(parent_comment__isnull=True).order_by(sort_field)
    return render(request, 'comments_app/comments_table.html', {'comments': comments})