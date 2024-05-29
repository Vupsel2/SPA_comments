import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .utils import add_message, get_message
from .forms import comments_form
from .models import Comment
from asgiref.sync import sync_to_async
from django.template.loader import render_to_string

class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        form = comments_form(data)
        if form.is_valid():
            print("sent",data)
            await sync_to_async(add_message)(data)
            await self.process_queue()
        else:
            errors = dict(form.errors)
            response_data = {'errors': errors}
            await self.send(text_data=json.dumps(response_data))
                
    async def process_queue(self):
        while True:
            message = await sync_to_async(get_message)()
            if message is None:
                break
            
            form = comments_form(message)
            
            
            if form.is_valid():
                comment = await sync_to_async(form.save)()
                
                parent_comment_id = form.cleaned_data.get('parent_comment_id')

                if message.get('image'):
                    comment.image = message['image']
                if message.get('text_file'):
                    comment.text_file = message['text_file']
                    
                if parent_comment_id:
                    parent_comment = await sync_to_async(Comment.objects.get)(id=parent_comment_id)
                    comment.parent_comment = parent_comment
                await sync_to_async(comment.save)()

                html = await sync_to_async(render_to_string)('comments_app/comment_item.html', {'comment': comment})
                response = {
                    'html': html,
                    'parent_comment_id': parent_comment_id
                }
                await self.send(text_data=json.dumps(response))
            else:
                print("Invalid form data")
