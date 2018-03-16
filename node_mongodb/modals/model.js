var kittySchema = require('../schemas/schemas')
var mongoose = require('mongoose');
var Kitten = mongoose.model('Kitten', kittySchema)
module.exports = Kitten