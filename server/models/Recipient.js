const mongoose = require('mongoose');
const { Schema } = mongoose;

var recipientSchema = new Schema({
  email: String,
  responded: { type: Boolean, default: false }
});

module.exports = recipientSchema;

//this is how we handle sub document collections