var mongoose = require('mongoose');

var locSchema = mongoose.Schema({
    guid: {
        type: String
    },
    date: {
      type: String
    },
    accuracy: {
      type: Number,
      default: -1
    },
    lat: {
        type: String,
    },
    long: {
        type: String,
    }
});

var Loc = mongoose.model('Loc', locSchema);

module.exports = Loc;