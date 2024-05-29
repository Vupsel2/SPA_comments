import queue


message_queue = queue.Queue()

def add_message(message):
    message_queue.put(message)

def get_message():
    if not message_queue.empty():
        return message_queue.get()
    else:
        return None
