import queue
import jwt
import random
import os


SECRET_KEY = os.getenv('JWT_KEY')
message_queue = queue.Queue()

def add_message(message):
    message_queue.put(message)

def get_message():
    if not message_queue.empty():
        return message_queue.get()
    else:
        return None



def decode_jwt(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    

def captcha_challenge():
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    challenge_text = ''.join(random.choices(chars, k=5))
    return challenge_text, challenge_text




