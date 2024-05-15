from django.shortcuts import render

def Comment(request):
    name="Andrii"
    context={
        'name':name
    }
    return render(request=request, template_name="comments_app/index.html", context=context)

