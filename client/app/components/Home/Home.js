import React, { Component } from 'react';
import 'whatwg-fetch';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import axios from 'axios';

import * as EmailValidator from 'email-validator';

import {
  getFromStorage,
  setInStorage,
} from "../../utils/storage";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userSearch: 'false',
      emailSearch: '',
      userData: [],

      userLevelState: '',
      emailData: '',
      startDate: moment().startOf('day'),
      labData: [],
      isLoading: true,
      currentUser: '',
      token: '',
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpUniversityId: '',
      signUpEmail: '',
      signUpPassword: '',
    };

    this.onTextBoxChangeSignInEmail = this.onTextBoxChangeSignInEmail.bind(this);
    this.onTextBoxChangeSignInPassword = this.onTextBoxChangeSignInPassword.bind(this);
    this.onTextBoxChangeSignUpEmail = this.onTextBoxChangeSignUpEmail.bind(this);
    this.onTextBoxChangeSignUpPassword = this.onTextBoxChangeSignUpPassword.bind(this);
    this.onTextBoxChangeSignUpFirstName = this.onTextBoxChangeSignUpFirstName.bind(this);
    this.onTextBoxChangeSignUpLastName = this.onTextBoxChangeSignUpLastName.bind(this);
    this.onTextBoxChangeSignUpUniversityId = this.onTextBoxChangeSignUpUniversityId.bind(this)

    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.addReservationDate = this.addReservationDate.bind(this);

    this.bookTimeSlot = this.bookTimeSlot.bind(this);
    this.removeTimeSlot = this.removeTimeSlot.bind(this);

    this.removeTimeSlotAdmin = this.removeTimeSlotAdmin.bind(this);
    this.searchUser = this.searchUser.bind(this);
    this.reservation = this.reservation.bind(this);
    this.onBoxChangeHandleEmail = this.onBoxChangeHandleEmail.bind(this);
    this.searchUserData = this.searchUserData.bind(this);

  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    const lvl = getFromStorage('level');
    /*console.log('--------yooo-----------');
    console.log(this.state.userLevelState);
    console.log(lvl);
    console.log('zzzzz');*/
    if (obj && obj.token) {
      const {token} = obj;
      const zzz = lvl;
      /*console.log(zzz);*/
      //verify the token
      fetch('/api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success){
            this.setState({
              userLevelState: zzz,
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
        });
      console.log(this.state.userLevelState);
    } else {
      this.setState({
        isLoading: false,
      });
    }

    this.addReservationDate();

  }

  onTextBoxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value,
    });
  }

  onTextBoxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value,
    });
  }

  onTextBoxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value,
    });
  }

  onTextBoxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    });
  }

  onTextBoxChangeSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value,
    });
  }

  onTextBoxChangeSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value,
    });
  }

  onTextBoxChangeSignUpUniversityId(event) {
    this.setState({
      signUpUniversityId: event.target.value,
    });
  }


  onSignIn() {
    //grab state
    const {
      signInEmail,
      signInPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    })

    //post request to backend
    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      })})
      .then(res => res.json())
      .then(json => {
        if (json.success){
          setInStorage('the_main_app', {token: json.token});
          setInStorage('level', json.uLevel);
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: '',
            signInPassword: '',
            token: json.token,
            currentUser: json.cUser,
            userLevelState: json.uLevel,
          });
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      });
  }

  onSignUp() {

    //grab state
    const {
      signUpFirstName,
      signUpLastName,

      signUpPassword,
      signUpUniversityId,
    } = this.state;
    let {
      signUpEmail
    } = this.state;

    this.setState({
      isLoading: true,
    })
    if(!(EmailValidator.validate(signUpEmail))){

        signUpEmail = '';

    }
    //post request to backend
    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword,
        userLevel: 'user',
        universityId: signUpUniversityId,
      })})
      .then(res => res.json())
      .then(json => {
        if (json.success){
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpFirstName: '',
            signUpLastName: '',
            signUpEmail: '',
            signUpPassword: '',
            signUpUniversityId: '',
          });
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false,
          });
        }
      });
  }

  logout() {
    this.setState({
      isLoading: true,
    });
    const obj = getFromStorage('the_main_app');

    if (obj && obj.token) {
      const {token} = obj;
      //verify the token
      fetch('/api/account/logout?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success){
            this.setState({
              userLevelState: '',
              token: '',
              signInError: '',
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }


  handleChange(date) {
    this.setState({
      startDate: date
    });

  }


  addReservationDate() {
    var _this = this;
    axios.post('api/account/addreservation', {

      date: this.state.startDate,

    }).then(function(response) {
      console.log('aaaaaaaaaaaaa');
      console.log(response);
      console.log('bbbbbbbbbbbbb');
      _this.setState({ labData: response.data});

    })
      .catch(function (error) {
        console.log(error);
      });
  }


  bookTimeSlot(e) {
    var _this = this;
    axios.post('api/account/findemail', {
      user: this.state.token,

    }).then(function(response) {
      let labb = e.lab;
      let slott = e.slots;
      console.log(response.data[0].email);
      _this.setState({
        emailData: response.data[0].email
      });
      if((_this.state.labData[0][labb][slott]) === 'available'){

          //-----------------------------------------------------------------
          //let eee = _this.state.labData[0].lab.slots;
          /*console.log(_this.state.emailData);
          console.log('monkey');
          console.log(labb+'.'+slott);*/
          console.log(_this.state.emailData);
          console.log('__________________________________');
          console.log(_this.state.labData[0][labb][slott]);
          console.log('__________________________________');
          //-----------------------------------------------------------------
          axios.post('/api/account/updateslot', {
            email: _this.state.emailData,
            date: _this.state.startDate,
            lab: e.lab,
            slot: e.slots,


          }).then(function (response) {

            console.log(response);
            _this.addReservationDate();
          })
            .catch(function (error) {
              console.log(error);
            });
    }
    })
      .catch(function (error) {
        console.log(error);
      });
  }


  removeTimeSlot(e) {
    var _this = this;
    axios.post('api/account/findemail', {
      user: this.state.token,

    }).then(function(response) {
      let labb = e.lab;
      let slott = e.slots;
      console.log(response.data[0].email);
      _this.setState({
        emailData: response.data[0].email
      });
      if((_this.state.labData[0][labb][slott]) === (_this.state.emailData)){


        axios.post('/api/account/removeslot', {
          fillSlot: 'available',
          date: _this.state.startDate,
          lab: e.lab,
          slot: e.slots,


        }).then(function (response) {

          console.log(response);
          _this.addReservationDate();
        })
          .catch(function (error) {
            console.log(error);
          });
      }
    })
      .catch(function (error) {
        console.log(error);
      });
  }

  removeTimeSlotAdmin(e) {
    var _this = this;
    axios.post('api/account/findemail', {
      user: this.state.token,

    }).then(function(response) {
      let labb = e.lab;
      let slott = e.slots;
      console.log(response.data[0].email);
      console.log('----zzzzzzzzz----');
      _this.setState({
        emailData: response.data[0].email
      });

        axios.post('/api/account/removeslot', {
          fillSlot: 'available',
          date: _this.state.startDate,
          lab: e.lab,
          slot: e.slots,


        }).then(function (response) {

          console.log(response);
          _this.addReservationDate();
        })
          .catch(function (error) {
            console.log(error);
          });

    })
      .catch(function (error) {
        console.log(error);
      });
  }

  searchUser(){
    this.setState({
      userSearch: 'true'
    })
  }

  reservation(){
    this.setState({
      userSearch: 'false'
    })
  }

  onBoxChangeHandleEmail(event) {
    this.setState({
      emailSearch: event.target.value,
    });
    //console.log(this.state.emailSearch);

  }

  searchUserData() {
    var _this = this;
    axios.post('api/account/finduserdata', {

      emailOfUser: this.state.emailSearch,

    }).then(function (response) {

      console.log(response);

      _this.setState({userData: response.data});

    })
      .catch(function (error) {
        console.log(error);
      });
  }


 /* resurveDisable(e){
    let place = e.place;
    let time = e.time;
    if ((this.state.emailData) === (this.state.labData[0][place][time])){
        return true;
        }}*/


  render() {
    const {
      emailSearch,
      userLevelState,
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpUniversityId,
      signUpError,
    } = this.state;

    if (isLoading) {
      return(
            <div style={{backgroundColor:'#edb22a'}} className="col-lg-12" >
                <p>
                  <div className="col-md-4"> </div>
                  <div className="col-md-8">
                    <h1>Loading... Please wait</h1>
                  </div>


                </p>
              <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            </div>);
    }
    if (!token) {
      return (
        <div style={{backgroundColor:'#edb22a'}} className="col-lg-12">
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>

          <div className="container-fluid">
              <div className="col-md-1"> </div>
              <div className="col-md-4">
                {
                  (signInError) ? (
                    <p className="alert alert-info">{signInError}</p>
                  ) :(null)
                }
                <h3><span>Sign in</span></h3>
                <input className="form-control" type="email" placeholder="Email" value={signInEmail} onChange={this.onTextBoxChangeSignInEmail} /><br/>
                <input className="form-control" type="password" placeholder="Password" value={signInPassword} onChange={this.onTextBoxChangeSignInPassword} /><br/>
                <button className="btn btn-success" onClick={this.onSignIn}>Sign in</button>
              </div>
              <div className="col-md-2"> </div>



              <div className="col-md-4">
                {
                  (signUpError) ? (
                    <p className="alert alert-info">{signUpError}</p>
                  ) :(null)
                }
                <h3><span>Sign up</span></h3>
                <input className="form-control" type="text" placeholder="First Name" value={signUpFirstName} onChange={this.onTextBoxChangeSignUpFirstName} /><br/>
                <input className="form-control" type="text" placeholder="Last Name" value={signUpLastName} onChange={this.onTextBoxChangeSignUpLastName} /><br/>
                <input className="form-control" type="text" placeholder="University ID" value={signUpUniversityId} onChange={this.onTextBoxChangeSignUpUniversityId} /><br/>
                <input className="form-control" type="email" placeholder="Email" value={signUpEmail} onChange={this.onTextBoxChangeSignUpEmail} /><br/>
                <input className="form-control" type="password" placeholder="Password" value={signUpPassword} onChange={this.onTextBoxChangeSignUpPassword} /><br/>
                <button className="btn btn-success" onClick={this.onSignUp} >Sign up</button><br/><br/><br/>
              </div>
              <div className="col-md-1"> </div>
          </div>

        </div>
      );
    }

    if((userLevelState === 'admin') && (this.state.userSearch === 'false')){
      return (
        <div style={{backgroundColor:'#dbc100'}} className='col-lg-12'><br/>
          <div className="container-fluid">
            <div style={{backgroundColor:'#7c4301'}} className='col-md-12'>
              <div className="col-sm-3">
              </div>
              <div className="col-sm-6"> </div>
              <div className="col-sm-3">
                <label style={{backgroundColor:'white',border:'1px'}} className="btn btn-link" onClick={print}>Today Report</label>
                <label style={{backgroundColor:'white',border:'1px'}} className="btn btn-link" onClick={this.searchUser}>search User</label>
                <label style={{backgroundColor:'white',border:'1px'}} className="btn btn-link" onClick={this.logout}>Logout</label>

              </div>
            </div>
          </div>
          <br/><br/>
          <div className="container-fluid">

            <div className="col-lg-12">
              <div className="col-md-4"> </div>
              <div className="col-md-6">
                <div className="col-sm-4">
                  <DatePicker className=" btn btn-Default btn-sm" isClearable={true} placeholderText="Select Date" selected={this.state.startDate} onChange={this.handleChange}/>
                </div>
                <div className="col-sm-4">
                  <button className="btn btn-primary btn-sm" onClick={this.addReservationDate}>Search</button>
                </div>
              </div>

            </div>

          </div>
          <br/><br/><br/>
          <div className="container-fluid">
            <div className="col-md-1"> </div>
            <div className="col-md-10">
              {
                this.state.labData.map(function(exp){
                  return (
                    <table style={{backgroundColor: '#eff9db'}} className="table btn-sm">
                      <thead>
                      <tr  style={{backgroundColor: 'white'}} >
                        <th colSpan="4" style={{textAlign:'center'}} >LAB A</th><th colSpan="4" style={{textAlign:'center'}}>LAB B</th><th colSpan="4" style={{textAlign:'center'}} >LAB C</th>
                      </tr>
                      <tr style={{backgroundColor: '#f1ffdb'}}>
                        <th style={{textAlign:'center'}} >Time</th><th style={{textAlign:'center'}}>Availability</th><th style={{textAlign:'center'}}>Reserve</th><th></th ><th className='table-info' style={{textAlign:'center'}}>Time</th><th style={{textAlign:'center'}}>Availability</th><th style={{textAlign:'center'}}>Reserve</th><th></th><th className='table-info' style={{textAlign:'center'}}>Time</th><th style={{textAlign:'center'}}>Availability</th><th style={{textAlign:'center'}}>Reserve</th><th></th>
                      </tr>
                      </thead>


                      <tbody>
                      <tr>
                        <td>08.00-09.00</td>
                        <td>{exp.lab_a.a}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_a',slots:'a'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_a',slots:'a'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>

                        <td></td>
                        <td>08.00-09.00</td>
                        <td>{exp.lab_b.a}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_b',slots:'a'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_b',slots:'a'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>08.00-09.00</td>
                        <td>{exp.lab_c.a}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_c',slots:'a'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_c',slots:'a'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>09.00-10.00</td>
                        <td>{exp.lab_a.b}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_a',slots:'b'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_a',slots:'b'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>09.00-10.00</td>
                        <td>{exp.lab_b.b}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_b',slots:'b'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_b',slots:'b'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>09.00-10.00</td>
                        <td>{exp.lab_c.b}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_c',slots:'b'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_c',slots:'b'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>10.00-11.00</td>
                        <td>{exp.lab_a.c}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_a',slots:'c'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_a',slots:'c'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>10.00-11.00</td>
                        <td>{exp.lab_b.c}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_b',slots:'c'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_b',slots:'c'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>10.00-11.00</td>
                        <td>{exp.lab_c.c}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_c',slots:'c'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_c',slots:'c'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td >11.00-12.00</td>
                        <td>{exp.lab_a.d}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_a',slots:'d'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_a',slots:'d'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>11.00-12.00</td>
                        <td>{exp.lab_b.d}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_b',slots:'d'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_b',slots:'d'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>11.00-12.00</td>
                        <td>{exp.lab_c.d}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_c',slots:'d'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_c',slots:'d'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>12.00-01.00</td>
                        <td>{exp.lab_a.e}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_a',slots:'e'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_a',slots:'e'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>12.00-01.00</td>
                        <td>{exp.lab_b.e}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_b',slots:'e'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_b',slots:'e'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>12.00-01.00</td>
                        <td>{exp.lab_c.e}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_c',slots:'e'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_c',slots:'e'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>01.00-02.00</td>
                        <td>{exp.lab_a.f}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_a',slots:'f'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_a',slots:'f'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>01.00-02.00</td>
                        <td>{exp.lab_b.f}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_b',slots:'f'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_b',slots:'f'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>01.00-02.00</td>
                        <td>{exp.lab_c.f}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_c',slots:'f'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_c',slots:'f'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>02.00-03.00</td>
                        <td>{exp.lab_a.g}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_a',slots:'g'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_a',slots:'g'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>02.00-03.00</td>
                        <td>{exp.lab_b.g}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_b',slots:'g'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_b',slots:'g'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>02.00-03.00</td>
                        <td>{exp.lab_c.g}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_c',slots:'g'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_c',slots:'g'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>03.00-04.00</td>
                        <td>{exp.lab_a.h}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_a',slots:'h'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_a',slots:'h'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>03.00-04.00</td>
                        <td>{exp.lab_b.h}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_b',slots:'h'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_b',slots:'h'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>03.00-04.00</td>
                        <td>{exp.lab_c.h}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_c',slots:'h'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_c',slots:'h'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>04.00-05.00</td>
                        <td>{exp.lab_a.i}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_a',slots:'i'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_a',slots:'i'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>04.00-05.00</td>
                        <td>{exp.lab_b.i}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_b',slots:'i'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_b',slots:'i'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>04.00-05.00</td>
                        <td>{exp.lab_c.i}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_c',slots:'i'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlotAdmin({lab:'lab_c',slots:'i'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                      </tr>

                      </tbody>

                    </table>
                  )
                }.bind(this))
              }
            </div>
            <div className="col-md-1"> </div>

          </div>
        </div>
      );
    }

    if((userLevelState === 'admin') && (this.state.userSearch === 'true')){
      return(
        <div style={{backgroundColor:'#dbc100'}} className='col-lg-12' ><br/>
          <div className="container-fluid">
            <div style={{backgroundColor:'#7c4301'}} className='col-md-12'>
              <div className="col-sm-3">

              </div>
              <div className="col-sm-7"> </div>
              <div className="col-sm-2">

                <label style={{backgroundColor:'white',border:'1px'}} className="btn btn-link" onClick={this.reservation}>Reservation</label>
                <label style={{backgroundColor:'white',border:'1px'}} className="btn btn-link" onClick={this.logout}>Logout</label>

              </div>
            </div>
          </div>
          <br/><br/>
          <div className="container-fluid col-lg-12">
            <div className="col-md-4"> </div>
            <div className="col-md-6">
              <div className="col-sm-6">
                <input value={emailSearch} onChange={this.onBoxChangeHandleEmail} className="form-control" placeholder="Enter User Email" />
              </div>
              <div className="col-sm-6">
                <button onClick={this.searchUserData} className="btn btn-primary btn-sm" >search</button>
              </div>
            </div>
          </div>
          <br/>
          <br/>
          <br/><br/>

          {
            this.state.userData.map(function(exp){
              return (
          <div className="container-fluid col-lg-12">
            <div className="col-md-3"> </div>
            <div className="col-md-6 modal-content" style={{backgroundColor:'#f1ffdb'}}>
              <br/><br/>
              <div className="col-sm-2"> </div>
              <div className="col-sm-10">
                <div className='col-sm-12'>
                  <div className='col-sm-6'>
                    <h4><label className='label label-info'>first name  : </label></h4>
                  </div>
                  <div className='col-sm-6'>
                    <h4><label  className='label label-default'>{exp.firstName}</label></h4><br/>
                  </div>
                </div>
                <div className='col-sm-12'>
                  <div className='col-sm-6'>
                    <h4><label  className='label label-info'>Last Name  : </label></h4>
                  </div>
                  <div className='col-sm-6'>
                    <h4><label className='label label-default'>{exp.lastName}</label></h4><br/>
                  </div>
                </div>
                <div className='col-sm-12'>
                  <div className='col-sm-6'>
                    <h4><label  className='label label-info'>Email  : </label></h4>
                  </div>
                  <div className='col-sm-6'>
                    <h4><label className='label label-default'>{exp.email}</label></h4><br/>
                  </div>
                </div>
                <div className='col-sm-12'>
                  <div className='col-sm-6'>
                    <h4><label  className='label label-info'>University ID  : </label></h4>
                  </div>
                  <div className='col-sm-6'>
                    <h4><label className='label label-default'>{exp.universityId}</label></h4><br/>
                  </div>
                </div>
                <div className='col-sm-12'>
                  <div className='col-sm-6'>
                    <h4><label  className='label label-info'>User Level  : </label></h4>
                  </div>
                  <div className='col-sm-6'>
                    <h4><label className='label label-default'>{exp.userLevel}</label></h4><br/>
                  </div>
                </div>



                <br/>
                <br/><br/><br/>
              </div>


            </div>
          </div>
                )}.bind(this)
            )}
          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        </div>
      )
    }


    if(userLevelState === 'user'){
      return (
        <div style={{backgroundColor:'#dbc100'}} className="col-lg-12"><br/>
          <div className="container-fluid">

            <div style={{backgroundColor:'black'}} className='col-md-12'>
            <div className="col-sm-3">

            </div>
            <div className="col-sm-8"> </div>
            <div className="col-sm-1">

                <label style={{backgroundColor:'white',border:'1px'}} className="btn btn-link" onClick={this.logout}>Logout</label>

            </div>
            </div>
          </div>
          <br/><br/>
          <div className="container-fluid">

            <div className="col-lg-12">
              <div className="col-md-4"> </div>
              <div className="col-md-6">
                <div className="col-sm-4">
                  <DatePicker className=" btn btn-Default btn-sm" isClearable={true} placeholderText="Select Date" minDate={moment().startOf('day')} selected={this.state.startDate} onChange={this.handleChange}/>
                </div>
                <div className="col-sm-4">
                  <button className="btn btn-primary btn-sm" onClick={this.addReservationDate}>Search</button>
                </div>
              </div>

            </div>

          </div>
          <br/><br/><br/>
          <div className="container-fluid">
            <div className="col-md-1"> </div>
            <div className="col-md-10">
              {
                this.state.labData.map(function(exp){
                  return (
                    <table style={{backgroundColor: '#eff9db'}} className="table btn-sm">
                      <thead>
                      <tr  style={{backgroundColor: 'white'}} >
                        <th colSpan="4" style={{textAlign:'center'}} >LAB A</th><th colSpan="4" style={{textAlign:'center'}}>LAB B</th><th colSpan="4" style={{textAlign:'center'}} >LAB C</th>
                      </tr>
                      <tr style={{backgroundColor: '#f1ffdb'}}>
                        <th style={{textAlign:'center'}} >Time</th><th style={{textAlign:'center'}}>Availability</th><th style={{textAlign:'center'}}>Reserve</th><th></th ><th className='table-info' style={{textAlign:'center'}}>Time</th><th style={{textAlign:'center'}}>Availability</th><th style={{textAlign:'center'}}>Reserve</th><th></th><th className='table-info' style={{textAlign:'center'}}>Time</th><th style={{textAlign:'center'}}>Availability</th><th style={{textAlign:'center'}}>Reserve</th><th></th>
                      </tr>
                      </thead>


                      <tbody>
                      <tr>
                        <td>08.00-09.00</td>
                        <td>{exp.lab_a.a}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_a',slots:'a'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_a',slots:'a'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>

                        <td></td>
                        <td>08.00-09.00</td>
                        <td>{exp.lab_b.a}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_b',slots:'a'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_b',slots:'a'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>08.00-09.00</td>
                        <td>{exp.lab_c.a}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_c',slots:'a'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_c',slots:'a'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>09.00-10.00</td>
                        <td>{exp.lab_a.b}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_a',slots:'b'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_a',slots:'b'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>09.00-10.00</td>
                        <td>{exp.lab_b.b}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_b',slots:'b'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_b',slots:'b'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>09.00-10.00</td>
                        <td>{exp.lab_c.b}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_c',slots:'b'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_c',slots:'b'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>10.00-11.00</td>
                        <td>{exp.lab_a.c}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_a',slots:'c'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_a',slots:'c'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>10.00-11.00</td>
                        <td>{exp.lab_b.c}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_b',slots:'c'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_b',slots:'c'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>10.00-11.00</td>
                        <td>{exp.lab_c.c}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_c',slots:'c'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_c',slots:'c'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td >11.00-12.00</td>
                        <td>{exp.lab_a.d}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_a',slots:'d'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_a',slots:'d'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>11.00-12.00</td>
                        <td>{exp.lab_b.d}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_b',slots:'d'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_b',slots:'d'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>11.00-12.00</td>
                        <td>{exp.lab_c.d}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_c',slots:'d'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_c',slots:'d'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>12.00-01.00</td>
                        <td>{exp.lab_a.e}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_a',slots:'e'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_a',slots:'e'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>12.00-01.00</td>
                        <td>{exp.lab_b.e}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_b',slots:'e'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_b',slots:'e'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>12.00-01.00</td>
                        <td>{exp.lab_c.e}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_c',slots:'e'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_c',slots:'e'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>01.00-02.00</td>
                        <td>{exp.lab_a.f}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_a',slots:'f'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_a',slots:'f'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>01.00-02.00</td>
                        <td>{exp.lab_b.f}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_b',slots:'f'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_b',slots:'f'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>01.00-02.00</td>
                        <td>{exp.lab_c.f}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_c',slots:'f'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_c',slots:'f'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>02.00-03.00</td>
                        <td>{exp.lab_a.g}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_a',slots:'g'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_a',slots:'g'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>02.00-03.00</td>
                        <td>{exp.lab_b.g}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_b',slots:'g'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_b',slots:'g'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>02.00-03.00</td>
                        <td>{exp.lab_c.g}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_c',slots:'g'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_c',slots:'g'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>03.00-04.00</td>
                        <td>{exp.lab_a.h}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_a',slots:'h'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_a',slots:'h'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>03.00-04.00</td>
                        <td>{exp.lab_b.h}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_b',slots:'h'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_b',slots:'h'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>03.00-04.00</td>
                        <td>{exp.lab_c.h}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_c',slots:'h'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_c',slots:'h'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>04.00-05.00</td>
                        <td>{exp.lab_a.i}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_a',slots:'i'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_a',slots:'i'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>04.00-05.00</td>
                        <td>{exp.lab_b.i}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_b',slots:'i'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_b',slots:'i'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                        <td>04.00-05.00</td>
                        <td>{exp.lab_c.i}</td>
                        <td>
                          <div className="col-md-6">
                            <button onClick={(e) => this.bookTimeSlot({lab:'lab_c',slots:'i'},e)} className="btn btn-success btn-sm">Book</button>
                          </div>
                          <div className="col-md-6">
                            <button onClick={(e) => this.removeTimeSlot({lab:'lab_c',slots:'i'},e)} className="btn btn-danger btn-sm">Undo</button>
                          </div>
                        </td>
                        <td></td>
                      </tr>

                      </tbody>

                    </table>
                  )
                }.bind(this))
              }
            </div>
            <div className="col-md-1"> </div>

          </div>
        </div>
      );
    }
    return(
      <div>system error</div>
    )

  };
}

export default Home;

/*
 fetch('/api/counters')
   .then(res => res.json())
   .then(json => {
     this.setState({
       counters: json
     });
   });
   */

/*
fetch('/api/counters', { method: 'POST' })
  .then(res => res.json())
  .then(json => {
    let data = this.state.counters;
    data.push(json);

    this.setState({
      counters: data
    });
  });
  */

