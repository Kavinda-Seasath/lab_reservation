const LabReservation = require('../../models/LabReservation');
const UserSession = require('../../models/UserSession');
const User = require('../../models/User');
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();


module.exports = (app) => {

  app.post('/api/account/addreservation', (req, res, next) => {
    console.log('3rd point');
    const {body} = req;
    const {
      date,

    } = body;

    if (!date) {
      return res.send({
        success: false,
        message: 'Error: Date cannot be blank.'
      });
    }

    console.log('check this');


    // 1. Verify whether date exist or not
    // 2. save
    LabReservation.find({
      date: date
    }, (err, previousdate) => {
      //console.log(previousdate);
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else if (previousdate.length > 0) {
        console.log('____________________previousData_______________________');
        console.log(previousdate);
        console.log('____________________previousData_______________________');
        return res.json(previousdate);
      }

      //save the new user
      const newDate = new LabReservation();

      newDate.date = date;
      newDate.save((err, result) => {
        if(err) {
          return res.send({
            success: false,
            message: 'Error: Account already exist.'
          });
        }else {
          //find saved document and send response to the frontend
          LabReservation.find({
            date: date
          }, (err, result) => {
            //console.log(previousdate);
            if (err) {
              return res.send({
                success: false,
                message: 'Error: Server error'
              });
            } else if (result.length > 0) {
              console.log('____________________result_______________________');
              console.log(result);
              console.log('____________________result_______________________');
              return res.json(result);
            }})

        }

      })
    });
    console.log('gg boys');

  });




  app.post('/api/account/findemail', (req, res, next) => {

    const {body} = req;
    const {
      user,
      slot,


    } = body;

    UserSession.find({
      _id: user
    },(err,sessions) => {
      if(err){
        return res.send({
          success: false,
          message: 'Error: server error'
        });
      }
      if(sessions.length !== 1){
        return res.send({
          success: false,
          message: 'Error: invalid'
        });
      }else {
        //email: sessions.email
        res.json(sessions);
      }

    });
  });


  app.post('/api/account/updateslot', (req, res, next) => {

    const {body} = req;
    const {
      lab,
      email,
      slot,
      date,
    } = body;
    /*let query = {};
    let q = {};
    query[slot] = email;
    q[lab] = query;
    console.log(q);*/

    const placeTime = lab +'.'+ slot;
    LabReservation.update({
      date:date
    },
      {$set:{
          [placeTime] : email
      }},function(err, newresult) {
        if(err) {
          res.send(err);
        }else {
          res.json(newresult)
        }
      })

  });

  app.post('/api/account/removeslot', (req, res, next) => {

    const {body} = req;
    const {
      lab,
      fillSlot,
      slot,
      date,
    } = body;
    /*let query = {};
    let q = {};
    query[slot] = email;
    q[lab] = query;
    console.log(q);*/

    const placeTime = lab +'.'+ slot;
    LabReservation.update({
        date:date
      },
      {$set:{
          [placeTime] : fillSlot
        }},function(err, newresult) {
        if(err) {
          res.send(err);
        }else {
          res.json(newresult)
        }
      })

  });

  app.post('/api/account/finduserdata', (req, res, next) => {

    const {body} = req;
    let {
      emailOfUser
    } = body;

    emailOfUser = emailOfUser.toLowerCase();
    User.find({
      email: emailOfUser
    },(err,sessions) => {
      if(err){
        return res.send({
          success: false,
          message: 'Error: server error'
        });
      }
      if(sessions.length !== 1){
        return res.json(sessions);
      }else {
        //email: sessions.email
        res.json(sessions);
      }

    });
  });


  app.post('/api/account/delete', (req, res, next) => {

    const {body} = req;
    let {
      emailOfUser
    } = body;

    emailOfUser = emailOfUser.toLowerCase();


    User.find({email: emailOfUser}).remove().exec(function(err, result) {
      if(err)
        res.send(err)
      res.send('User successfully deleted!');
    })
  });

/*router.post('api/account/addreservation',function(req,res){
  var date = req.body.date;
  console.log(data);

  // 1. Verify whether date exist or not
  // 2. save
  LabReservation.find({
    date: date
  }, function(err, previousdate){
    //console.log(previousdate);
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    } else if (previousdate.length > 0) {
      res.json(previousdate);
    }
    //save the new user
    const newDate = new LabReservation();

    newDate.date = date;
    newDate.save(function(err, result){
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Account already exist.'
        });
      }
      console.log(result);
      res.json(result);
    })
  });
});*/


};


