const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

module.exports = (app) => {
  // app.get('/api/counters', (req, res, next) => {
  //   Counter.find()
  //     .exec()
  //     .then((counter) => res.json(counter))
  //     .catch((err) => next(err));
  // });
  //
  // app.post('/api/counters', function (req, res, next) {
  //   const counter = new Counter();
  //
  //   counter.save()
  //     .then(() => res.json(counter))
  //     .catch((err) => next(err));
  // });

  /*
   *Sign up
   */
  app.post('/api/account/signup', (req, res, next) => {
    const {body} = req;
    const {
      firstName,
      lastName,
      password,
      userLevel,
      universityId,
    } = body;
    let {
      email
    } = body;

    if (!firstName) {
      return res.send({
        success: false,
        message: 'Error: First name cannot be blank.'
      });
    }
    if (!lastName) {
      return res.send({
        success: false,
        message: 'Error: Last name cannot be blank.'
      });
    }
    if (!universityId) {
      return res.send({
        success: false,
        message: 'Error: University ID cannot be blank.'
      });
    }
    if (!email) {
      return res.send({
        success: false,
        message: 'Error: Email cannot be blank or invalid Email'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Error: Password cannot be blank.'
      });
    }

    console.log('check this');
    email = email.toLowerCase();


    // 1. Verify whether email exist or not
    // 2. save
    User.find({
      email: email
    }, (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: 'Error: Account already exist.'
        });
      }

      //save the new user
      const newUser = new User();

      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.universityId = universityId;
      newUser.password =newUser.generateHash(password);
      newUser.userLevel = userLevel;
      newUser.save((err, user) => {
        if(err) {
          return res.send({
            success: false,
            message: 'Error: Account already exist.'
          });
        }
        return res.send({
          success: true,
          message: 'Signed up'
        });
      })
    });

  });

  app.post('/api/account/signin', (req, res, next) => {
    const {body} = req;
    const {
      password
    } = body;
    let {
      email
    } = body;

    if (!email) {
      return res.send({
        success: false,
        message: 'Error: Email cannot be blank.'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Error: Password cannot be blank.'
      });
    }

    email = email.toLowerCase();

    User.find({
      email: email
    }, (err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      if(users.length != 1) {
        return res.send({
          success: false,
          message: 'Error: invalid'
        });
      }

      const user = users[0];
      if(!user.validPassword(password)){
        return res.send({
          success: false,
          message: 'Error: invalid'
        });
      }

      //otherwise correct user

      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.username = user.firstName;
      userSession.email = user.email;
      userSession.userLevel = user.userLevel;
      userSession.save((err, doc) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }
        return res.send({
          success: true,
          message: 'Sign in Successfull',
          token: doc._id,
          cUser: doc.username,
          uLevel: doc.userLevel,
        })
      });



    });
  });

  app.get('/api/account/verify', (req, res, next) => {
      //get the token
    const {query} = req;
    const {token} = query;

    //verify that token is one of the kind and not deteled

    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err,sessions) => {
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
      } else {
        return res.send({
          success: true,
          message: 'good',
          userLevel: sessions.userLevel
        });
      }
    });

  });

  app.get('/api/account/logout', (req, res, next) => {
    //get the token
    const {query} = req;
    const {token} = query;

    //verify that token is one of the kind and not deteled

    UserSession.findOneAndUpdate({
      _id: token,
      isDeleted: false
    }, {
      $set:{
        isDeleted:true
      }
    }, null, (err,sessions) => {
      if(err){
        return res.send({
          success: false,
          message: 'Error: server error'
        });
      }

        return res.send({
          success: true,
          message: 'good'
        });

    });

  });
};
