## Регистрация посетителей бассейна

#### Используемые технологии:
- Node.js
- MongoDB
- Moleculer
- Redis
- React.js
- Bootstrap

## Установка
Для запуска данного приложени необходимо иметь установленные и настроенные Node.js, Redis, MongoDB.
- MongoDB должен быть запущен на порту **27017** либо должна быть задана переменная окружения MONGO_URI.
- По-умолчанию сервер запускается на порту **3002** (либо задать переменной окружения PORT)

#### Запуск back
- Для работы почтового сервиса необходимо задать EMAIL_FROM, EMAIL_USER, EMAIL_PASS
- Перейти в директорию **back** и выполнить следующие команды:
		npm install
		npm run dev / EMAIL_PORT=... EMAIL_HOST=... EMAIL_USER=... EMAIL_PASS=... npm run dev 


#### Запуск front без docker
- Перейти в директорию **front** и выполнить следующие команды (так же проверить proxy в package.json, который должен указывать на сервер):
		npm install
		npm run start
- Открыть в браузере страницу http://localhost:3000/


#### Запуск front с помощью docker
Предварительно убедиться в наличии docker. В package.json использовать host.docker.internal для доступа к localhost.

```
Сбилдить:
docker build -t sample:dev .

Запустить:
docker run \
    -it \
    --rm \
    -v ${PWD}:/app \
    -v /app/node_modules \
    -p 3001:3000 \
    -e CHOKIDAR_USEPOLLING=true \
    sample:dev
```
После запуска клиентская сторона будет доступна по адресу http://localhost:3001/


## Что стоит доделать:
- добавить тесты
- убрать TODO
- убрать ошибку с /socket.io/?EIO...
- таблица топа не переставляет записи местами, если изменить результат в левой табличке. Самый простой вариант (и скорее всего самый правильный из-за пагинации) - заново получить данные от сервера (делать не стал, чтобы показать, что данные обновляются по сокету).
- формы не сбрасывают содержимое для удобства тестирования
- ошибки от бэка стоит выводить при попытке создать нового пользователя
- письмо отправляется только одному пользователю (стоит сделать для всех у кого одинаковый лидирующий результат)
- нет повторной попытки получить данные от сервера (если сразу сервер не ответил)


## Примечания
- Проект создан на базе react-create-app и moleculer-cli. 
- Файл с базовыми данными для БД лежит в back/data. 
- В структуре есть minTime, что добавляет избыточности, но позволяет не искать лучший результат в списке. 
- По сокету приходит два разных события. По одному из них происходит запрос данных по REST, что необходимо из-за наличия страниц.
- Можно перенести получение данных полностью на socket, тогда будет удобнее следить за коннектом к серверу и необходимостью получить данные от него.
- moleculer-mail и mileculer-io видел, но использовать не стал.
