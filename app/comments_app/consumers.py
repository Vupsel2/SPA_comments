import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .utils import add_message, get_message
from .forms import comments_form
from .models import Comment
from asgiref.sync import sync_to_async
from .utils import decode_jwt
from django.contrib.sessions.models import Session

class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        if text_data:
            data = decode_jwt(text_data)
            if data:
                
                await sync_to_async(add_message)(data)
                await self.process_queue()
 
            else:
                await self.send(text_data=json.dumps({'error': 'Invalid token'}))
        else:
            await self.send(text_data=json.dumps({'error': 'Token not provided'}))

                
    async def process_queue(self):
        while True:
            message = await sync_to_async(get_message)()
            if message is None:
                break
            
            form = comments_form(message)
            
            is_valid = await sync_to_async(form.is_valid)()
            if is_valid:
                comment = await sync_to_async(form.save)()
                
                parent_comment_id = form.cleaned_data.get('parent_comment_id')
                
                if parent_comment_id:
                    parent_comment = await sync_to_async(Comment.objects.get)(id=parent_comment_id)
                    comment.parent_comment = parent_comment
                await sync_to_async(comment.save)()

                html = await sync_to_async(comment.render_comment)()
                response = {
                    'html': html,
                    'parent_comment_id': parent_comment_id,
                    'comment_id': comment.id
                }
                await self.send(text_data=json.dumps(response))
            else:
                    errors = await sync_to_async(lambda: dict(form.errors))()
                    response_data = {'errors': errors}
                    await self.send(text_data=json.dumps(response_data))
