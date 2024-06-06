FROM python:3.10

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=app.settings

RUN pip install --upgrade pip

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN rm -rf /app/staticfiles && \
	 mkdir -p /app/staticfiles && \
	 chmod 755 /app/staticfiles

EXPOSE 8000
RUN python manage.py collectstatic --noinput

CMD ["sh", "-c", " python manage.py makemigrations && python manage.py migrate && gunicorn app.wsgi:application --bind 0.0.0.0:8001 & daphne -b 0.0.0.0 -p 8000 app.asgi:application"]
