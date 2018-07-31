/*
С помощью express создать многостраничный сайт со страницами: Главная | О нас | Контакты. Используя любой из шаблонизаторов.
На странице контакты необходимо реализовать отправку пользователем своих данных для связи (имя, тел., email).
Добавить модуль nodemailer.
 */

var express = require('express');
var fs =require('fs');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();
app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));

//Logic

app.get('/', function (req, res) {
    res.render('index', {title: 'Привет я твоя страница', mytitile: 'Наш ресторан'});
});

app.get('/about', function (req, res) {
    res.render('about', {aboutitle:'Информация о нас'});
});


app.get('/contact', function (req, res) {
    res.render('contact');
});

//Форма обратной связи + отправка на почту
//необходимо ввсети пароль от своего аккаунта, отсылаем письма самому себе

app.post('/contact', urlencodedParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;
    var userText = req.body.userText;


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: userEmail,
            pass: userPassword
        }
    });

    var mailOptions = {
        from: userEmail,
        to: userEmail,
        subject: 'Your contact',
        text: 'Контакт налажен'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


    //запись полученных данных в файл

    var result = '\n' + 'Почта' + ' ' + userEmail + '\n' + 'Пароль' + ' '  + userPassword + '\n' + 'Комментарий:' + '\n' + userText + '\n';
    fs.appendFileSync('contact.txt', result);

    res.render('contact-success', {name:userEmail});
});


//Конец POST запроса

//регистрации на сайте

app.get('/registration', function (req, res) {
    res.render('registration');
});

//POST регистрация на сайте
app.post('/registration', urlencodedParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    var email = req.body.userEmail;
    var pass = req.body.userPassword;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: pass
        }
    });

    var mailOptions = {
        from: email,
        to: email,
        subject: 'Your contact',
        text: 'Регистрация успешна' + '\n' + 'Ваш логин:' + ' ' + email + '\n'  + 'Ваш пароль:' + ' ' + pass
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    //запись полученных данных в файл

    var registr = '\n' + 'Почта' + ' ' + email + '\n' + 'Пароль' + ' '  + pass + '\n';
    fs.appendFileSync('regisrt.txt', registr);

    res.render('registration-success', {name:email});
});

//Конец POST запроса




//Error 404
app.use(function(req, res, next) {
    res.status(404).render('404');
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});