from django.shortcuts import render
from .forms import comments_form
from .models import Comment
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.template.loader import render_to_string
from django.core.paginator import Paginator
from django.core.files.images import get_image_dimensions
from PIL import Image
import os
from django.conf import settings


def comment(request):
    if request.method == 'POST':
        form = comments_form(request.POST,request.FILES)
        
        if form.is_valid():
            
            comment = form.save()
            print("asdssssss",comment.image.url)
            print("Image saved at URL:", comment.image.url)
            if comment.image:
                print("Image saved",comment.image.path)
                image = comment.image
                width, height = get_image_dimensions(image)
                if width > 320 or height > 240:
                    img = Image.open(image)
                    img.thumbnail((320, 240), Image.Resampling.LANCZOS)
                    img.save(os.path.join(settings.MEDIA_ROOT, comment.image.name)) 
                    print("paaaath",os.path.join(settings.MEDIA_ROOT, comment.image.name))
                    
                
                    
                
                    

            if comment.text_file:
                if comment.text_file.size > 100 * 1024:
                    return JsonResponse({'error': 'Text file size must be less than 100 KB'}, status=400)
                if not comment.text_file.name.endswith('.txt'):
                    return JsonResponse({'error': 'Only .txt files are allowed'}, status=400)
                
            

            parent_comment_id = form.cleaned_data.get('parent_comment_id')
            if parent_comment_id:
                parent_comment = Comment.objects.get(id=parent_comment_id)
                comment.parent_comment = parent_comment
                comment.save()
            rendered_comment = render_to_string('comments_app/comment_item.html', {'comment': comment,})

            return JsonResponse({'html': rendered_comment, 'parent_comment_id': comment.parent_comment_id})
            
        else:
            errors = dict(form.errors.items())
            return JsonResponse({'error': 'Invalid form', 'errors': errors}, status=400)
    errors = dict(form.errors.items())
    return JsonResponse({'error': errors}, status=400)

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

