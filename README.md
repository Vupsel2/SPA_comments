# SPA_comments


SPA_comments is a Single Page Application (SPA) designed to provide a real-time commenting. This project demonstrates the use of modern web development tools and frameworks to build a responsive and interactive application.

### Features

- **Real-time comments**: Users can post and view comments in real-time.
- **Single Page Application**: Smooth user experience without page reloads.
- **Docker Support**: Easy setup and deployment using Docker.
- **CAPTCHA**: Protects against spam and abuse.
- **Unlimited Replies**: Each comment can have an unlimited number of replies (cascading display).
 - **Sortable Head Comments**: Head comments (those not replies) should be displayed in a table, with sorting available by User Name, Email, and Date Added (both ascending and descending). Table is activated by pressing the "Table of Comments" button.
- **Pagination**: Messages should be paginated with 25 messages per page.
- **Security**: Protection against XSS attacks and SQL injections.
- **Default Sorting**: LIFO (Last In, First Out) sorting by default.


### Prerequisites


- **Docker**: Needed for containerization and easy setup.

___
### Getting Started

#### Clone the Repository

```bash
git clone https://github.com/Vupsel2/SPA_comments.git

cd SPA_comments
```
___
### fill in .env

```bash
JWT_KEY = ''
SECRET_KEY='*django secretkey*'

ENGINE= 'django.db.backends.mysql'
NAME= ''
USER= ''
PASSWORD= ''
HOST= ''
PORT= ''
```
___
#### Using Docker

##### Build and run the containers:

```bash
docker-compose up --build
```

#### Access the application
###### Navigate to http://localhost:80 to view and interact with the application.

___
___
# SPA_comments

SPA_comments — это одностраничное приложение (SPA), предназначенное для добавления комментариев в реальном времени. Этот проект демонстрирует использование современных инструментов и фреймворков веб-разработки для создания отзывчивого и интерактивного приложения.

### Особенности

- **Комментарии в реальном времени**: пользователи могут публиковать и просматривать комментарии в реальном времени.
- **Одностраничное приложение**: пользовательский опыт без перезагрузки страниц.
- **Поддержка Docker**: простая настройка и развертывание с использованием Docker.
- **CAPTCHA**: защита от спама.
- **Неограниченные ответы**: на каждую запись можно написать сколько угодно ответов (каскадное отображение).
- **Сортируемые заглавные комментарии**: заглавные комментарии (те, которые не являются ответом) должны выводиться в виде таблицы, с возможностью сортировки по полям: Имя пользователя, Электронная почта и Дата добавления (как в порядке убывания, так и в обратном). Таблица активируется нажатием кнопки "Таблица комментариев".
- **Разбиение на страницы**: сообщения должны разбиваться на страницы по 25 сообщений на каждой.
- **Безопасность**: защита от XSS атак и SQL-инъекций.
- **Сортировка по умолчанию**: LIFO (последним пришел, первым ушел).

### Требования

- **Docker**: необходим для контейнеризации и простой настройки.

___
### Начало работы

#### Клонирование репозитория

```bash
git clone https://github.com/Vupsel2/SPA_comments.git

cd SPA_comments
```

### Заполните .env

```bash
JWT_KEY = ''
SECRET_KEY='*django secretkey*'

ENGINE= 'django.db.backends.mysql'
NAME= ''
USER= ''
PASSWORD= ''
HOST= ''
PORT= ''
```
#### Использование Docker

##### Сборка и запуск контейнеров:

```bash
docker-compose up --build
```

#### Доступ к приложению
###### Перейдите по  http://localhost:80
