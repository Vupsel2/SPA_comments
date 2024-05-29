from django.shortcuts import render
from .forms import comments_form
from .models import Comment
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.core.paginator import Paginator
from django.core.files.images import get_image_dimensions
from PIL import Image
import os
from urllib.parse import urljoin
from django.conf import settings

def upload(f):
    with open(os.path.join(settings.MEDIA_ROOT, 'text_files', f.name), 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)

def upload_files(request):
    if request.method == 'POST':
        txt_file = request.FILES.get('text_file')
        image_file = request.FILES.get('image')

        print(txt_file)
        errors = {}
        response_data={}
        if txt_file:
            upload(txt_file)
            print("!!!!!!!Upload!!!!!")
            response_data['txt_file'] = os.path.join('/text_files/', txt_file.name)

        
        if image_file:
            image = image_file
            width, height = get_image_dimensions(image)
            if width > 320 or height > 240:
                img = Image.open(image)
                img.thumbnail((320, 240), Image.Resampling.LANCZOS)
                img.save(os.path.join(settings.MEDIA_ROOT,'images', image_file.name))
            response_data['image_file'] = os.path.join('/images/', image_file.name)


        if errors:  
            return JsonResponse({'errors': errors}, status=400)


        return JsonResponse(response_data)

    return JsonResponse({'errors': 'Bad request method'}, status=400)

def home(request):
    comment_list = Comment.objects.filter(parent_comment__isnull=True).order_by('-created_date')
    paginator = Paginator(comment_list, 5)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)  
    form = comments_form()
    return render(request, 'comments_app/home.html', {'page_obj': page_obj, 'form': form,})

def comments_table(request):
    sort_field = request.GET.get('sort', 'user_name')

    if sort_field not in ['user_name', 'email', 'created_date']:
        sort_field = 'created_date'
    
    order = request.GET.get('order', 'asc')
    if order == 'desc':
        sort_field = '-' + sort_field
    
    comments = Comment.objects.filter(parent_comment__isnull=True).order_by(sort_field)
    return render(request, 'comments_app/comments_table.html', {'comments': comments})