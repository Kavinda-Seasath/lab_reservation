const mongoose = require('mongoose');

const UserSessionSchema = new mongoose.Schema({

  userId: {
    type:String,
    default: ''
  },
  timestamp: {
    type:Date,
    default: Date.now()
  },
  isDeleted: {
    type:Boolean,
    default: false
  },
  username: {
    type:String,
    default: ''
  },
  email: {
    type:String,
    default: ''
  },
  userLevel: {
    type:String,
    default: ''
  }


});

module.exports = mongoose.model('UserSession', UserSessionSchema);
