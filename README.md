### Запустить проект:
```
npm start
```
### Как тестировать в Postman
<b>POST</b> localhost:5000/html-to-pdf<br>
<b>Body</b>: form-data<br>
<b>Key</b>: file

### 4 варианта проверки
- success: zip-архив, содержащий index.html и ресурсы к нему (изображения, css)
- error: файл не является zip-архивом
- error: архив не содержит index.html
- error: архив более 2GB

### Docker
```
docker build . -t your-dockerhub-name/html-to-pdf
```
```
docker run -p 5000:8080  your-dockerhub-name/html-to-pdf
```