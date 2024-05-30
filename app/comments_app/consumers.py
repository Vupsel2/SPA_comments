import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .utils import add_message, get_message
from .forms import comments_form
from .models import Comment
from asgiref.sync import sync_to_async
from .utils import decode_jwt

class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        print("\n\n\ntext_data\n\n\n",text_data)
        
        if text_data:
            data = decode_jwt(text_data)
            if data:
                form = comments_form(data)
                if form.is_valid():
                    print("sent",data)
                    await sync_to_async(add_message)(data)
                    await self.process_queue()
                else:
                    errors = dict(form.errors)
                    response_data = {'errors': errors}
                    await self.send(text_data=json.dumps(response_data))
                    
            else:self.send(text_data=json.dumps({'error': 'Invalid token'}))
            
        else:self.send(text_data=json.dumps({'error': 'Token not provided'}))
                
    async def process_queue(self):
        while True:
            message = await sync_to_async(get_message)()
            if message is None:
                break
            
            form = comments_form(message)
            
            
            if form.is_valid():
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
                print("Invalid form data")
