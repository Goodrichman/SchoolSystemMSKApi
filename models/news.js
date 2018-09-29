const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  
  }

});

var News = mongoose.model('News', NewsSchema);

module.exports = {News}