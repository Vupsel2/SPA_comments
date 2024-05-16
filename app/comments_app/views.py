from django.shortcuts import render
from .forms import comments_form

def comment(request):
    if request.method =="POST":
        form = comments_form(request.POST)
        if form.is_valid():
            form.save()
            return render(request, 'comments_app/index.html', {'form': form})
    else:
        form = comments_form()   
        return render(request, 'comments_app/index.html', {'form': form})

