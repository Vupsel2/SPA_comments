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


- **Docker and docker-compose**: Needed for containerization and easy setup.
- **DNS** edit your local host file(/etc/hosts) and add necessary ip address to same as WEBSITE_NAME and DOMAIN_NAME
  
**Linux:**
```bash
apt-get update
apt-get install docker-compose
apt-get install Docker
```
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
WEBSITE_NAME= ''

WEBSITE_NAME="django"
DOMAIN_NAME=".test"
```
___
#### Using Docker

##### Build and run the containers:

```bash
docker-compose up --build
```

#### Access the application
###### Navigate to http://django.test (depends on WEBSITE_NAME and DOMAIN_NAME) to view and interact with the application.


