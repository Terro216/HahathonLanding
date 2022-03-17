# Hahathon Landing
> Landing for IIT event (01.04.2022 - 04.04.2022)

## Requirements

* [Node.js](https://nodejs.org/)
* [Jake.js](https://jakejs.com/docs-page.html#item-overview-installation)

## Run production build

* Run `jake` from project base dir to build project to `./app`.
* Setup environment variables:
```bash
PORT=5000 # Application listening port
SECRET=jlkhdsflghsdfglsdjhfgljhfgdhfglhgflJHGHKFYSTSuidyi8uo9ey376839dj # Random string for encryption (min len. 32)
BASE_URL=http://localhost:5000 # Site origin

EMAIL_USERNAME=info@yandex.ru # Username for mailer
EMAIL_PASSWORD=alsdfjksdjfis # Service password for mailer

GOOGLE_APPLICATION_CREDENTIALS=C:\apiKey.json # Path to Google API Credentials
GOOGLE_SHEETS_ID=wkkICYXHNv3rfMhlDaOqZbkNtdjljh1ySRTxmIOvk # Id of Google spreadsheet to use
```
* Don't forget to put your Google Credentials to `GOOGLE_APPLICATION_CREDENTIALS` path.
* Run application with `node src` from `./app`.

## Run from Docker
* Build docker image
    ```bash
    docker-compose build
    ```
* Run Docker container in background
    ```bash
    docker-compose up -d
    ```
