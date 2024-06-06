FROM python:3.10

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=app.settings

RUN apt-get update && apt-get install -y netcat-openbsd && pip install --upgrade pip 


COPY ./requirements.txt .

RUN pip install -r requirements.txt
#RUN pip install -U python-dotenv
COPY . .
COPY wait.sh /usr/local/bin/wait.sh
RUN pwd > /tmp/pwd_output && cat /tmp/pwd_output

RUN  rm -rf /app/staticfiles && \
	 mkdir -p /app/staticfiles && \
	 chmod 755 /app/staticfiles

EXPOSE 8000
#RUN python manage.py collectstatic --noinput
CMD ["sh", "-c", "/usr/local/bin/wait.sh db 3306 -- python manage.py collectstatic --noinput && python manage.py makemigrations && python manage.py migrate && gunicorn app.wsgi:application --bind 0.0.0.0:8001 & daphne -b 0.0.0.0 -p 8000 app.asgi:application"]

#CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && gunicorn app.wsgi:application --bind 0.0.0.0:8001 & daphne -b 0.0.0.0 -p 8000 app.asgi:application"]
