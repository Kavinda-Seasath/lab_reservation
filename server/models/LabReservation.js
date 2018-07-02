const mongoose = require('mongoose');

const LabReservationSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: ''
  },
  lab_a: {
    a : {type:String, default: "available"},
    b : {type:String, default: "available"},
    c : {type:String, default: "available"},
    d : {type:String, default: "available"},
    e : {type:String, default: "available"},
    f : {type:String, default: "available"},
    g : {type:String, default: "available"},
    h : {type:String, default: "available"},
    i : {type:String, default: "available"}
  },
  lab_b: {
    a : {type:String, default: "available"},
    b : {type:String, default: "available"},
    c : {type:String, default: "available"},
    d : {type:String, default: "available"},
    e : {type:String, default: "available"},
    f : {type:String, default: "available"},
    g : {type:String, default: "available"},
    h : {type:String, default: "available"},
    i : {type:String, default: "available"}
  },
  lab_c: {
    a : {type:String, default: "available"},
    b : {type:String, default: "available"},
    c : {type:String, default: "available"},
    d : {type:String, default: "available"},
    e : {type:String, default: "available"},
    f : {type:String, default: "available"},
    g : {type:String, default: "available"},
    h : {type:String, default: "available"},
    i : {type:String, default: "available"}
  }

});

module.exports = mongoose.model('LabReservation', LabReservationSchema);
