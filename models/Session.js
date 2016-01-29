var mongoose = require('mongoose');

var sessionSchema = mongoose.Schema({
    code: {
        type: String
    },
    date: {
      type: String
    }
});

var Session = mongoose.model('Session', sessionSchema);

module.exports = Session;