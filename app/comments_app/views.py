from django.shortcuts import render
from .forms import comments_form
from .models import Comment
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.template.loader import render_to_string
@csrf_exempt
def comment(request):
    if request.method == 'POST':
        form = comments_form(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.save()
            parent_comment_id = form.cleaned_data.get('parent_comment_id')
            if parent_comment_id:
                parent_comment = Comment.objects.get(id=parent_comment_id)
                comment.parent_comment = parent_comment
                comment.save()
            rendered_comment = render_to_string('comments_app/comment_item.html', {'comment': comment})

            return JsonResponse({'html': rendered_comment, 'parent_comment_id': comment.parent_comment_id})
            
        else:
            return JsonResponse({'error': 'Invalid form'}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)

def home(request):
    comments = Comment.objects.filter(parent_comment__isnull=True)
    form = comments_form()
    return render(request, 'comments_app/home.html', {'comments': comments, 'form': form})
