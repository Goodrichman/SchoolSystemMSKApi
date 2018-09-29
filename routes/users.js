require('./../config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
var {News} = require('./../models/news');
var {mongoose} = require('./../db/mongoose');
var {User} = require('./../models/user');
var {authenticate} = require('./../middleware/authenticate')
var router = express.Router();


router.post('/', async (req, res, next) => {
  try {
    const body = _.pick(req.body, ['email', 'password', 'firstName', 'lastName', 'userType']);
    console.log(body);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/me', authenticate, (req, res, next) => {
  res.send(req.user);
});

router.post('/login', async (req, res, next) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.setHeader('x-auth', token);

    res.send({
      type:user.userType,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
    });
  } catch (e) {
    res.status(400).send();
  }
});

router.delete('/me/token', authenticate, async (req, res, next) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});
router.post('/news', async (req, res, next) => {
  try {
    const body = _.pick(req.body, ['title', 'description']);
    console.log(body);
    const news = new News(body);
    await news.save();
    res.send(news);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.patch('/news/:id', async (req, res, next) => {
  try {
    const body = _.pick(req.body, ['title', 'description']);
    console.log(body);
    const news = await News.findByIdAndUpdate(req.params.id,{
      $set:{
        body
      }
    });
    
    res.send(news);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.get('/news', async (req, res, next) => {
  try {
    const news = News.find({});
    res.send(news);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.delete('/news/:id', async (req, res, next) => {
  try {
    const news = await  News.findByIdAndRemove(req.params.id);
  } catch (e) {
    res.status(400).send(e);
  }
});


module.exports = router;
