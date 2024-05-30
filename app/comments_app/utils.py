import queue
import jwt
SECRET_KEY = 'qwesaxxcacxz#q123'
message_queue = queue.Queue()

def add_message(message):
    message_queue.put(message)

def get_message():
    if not message_queue.empty():
        return message_queue.get()
    else:
        return None



def decode_jwt(token):
    print("decode_jwt",token)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
