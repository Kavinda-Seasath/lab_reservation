import React, { Component } from 'react';
import 'whatwg-fetch';

import {
  getFromStorage,
  setInStorage,
} from "../../utils/storage";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpEmail: '',
      signUpPassword: '',
    };

    this.onTextBoxChangeSignInEmail = this.onTextBoxChangeSignInEmail.bind(this);
    this.onTextBoxChangeSignInPassword = this.onTextBoxChangeSignInPassword.bind(this);
    this.onTextBoxChangeSignUpEmail = this.onTextBoxChangeSignUpEmail.bind(this);
    this.onTextBoxChangeSignUpPassword = this.onTextBoxChangeSignUpPassword.bind(this);
    this.onTextBoxChangeSignUpFirstName = this.onTextBoxChangeSignUpFirstName.bind(this);
    this.onTextBoxChangeSignUpLastName = this.onTextBoxChangeSignUpLastName.bind(this);

    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');

    if (obj && obj.token) {
      const {token} = obj;
      //verify the token
      fetch('/api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success){
            this.setState({
              token,
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
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: '',
            signInPassword: '',
            token: json.token,
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
      signUpEmail,
      signUpPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    })

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
              token: '',
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


  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpError,
    } = this.state;

    if (isLoading) {
      return(<div><p>Loading...</p></div>);
    }
    if (!token) {
      return (
        <div className="col-lg-12">
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
                    <p>{signInError}</p>
                  ) :(null)
                }
                <h3><span>Sign in</span></h3>
                <input className="form-control" type="email" placeholder="Email" value={signInEmail} onChange={this.onTextBoxChangeSignInEmail} /><br/>
                <input className="form-control" type="password" placeholder="Password" value={signInPassword} onChange={this.onTextBoxChangeSignInPassword} /><br/>
                <button className="btn btn-success" onClick={this.onSignIn}>Sign in</button>
              </div>
              <div className="col-md-2"></div>



              <div className="col-md-4">
                {
                  (signUpError) ? (
                    <p>{signUpError}</p>
                  ) :(null)
                }
                <h3><span>Sign up</span></h3>
                <input className="form-control" type="text" placeholder="First Name" value={signUpFirstName} onChange={this.onTextBoxChangeSignUpFirstName} /><br/>
                <input className="form-control" type="text" placeholder="Last Name" value={signUpLastName} onChange={this.onTextBoxChangeSignUpLastName} /><br/>
                <input className="form-control" type="email" placeholder="Email" value={signUpEmail} onChange={this.onTextBoxChangeSignUpEmail} /><br/>
                <input className="form-control" type="password" placeholder="Password" value={signUpPassword} onChange={this.onTextBoxChangeSignUpPassword} /><br/>
                <button className="btn btn-success" onClick={this.onSignUp} >Sign up</button>
              </div>
              <div className="col-md-1"> </div>
          </div>

        </div>
      );
    }

    return (
      <div>
        <p>Account</p>
        <button onClick={this.logout}>Logout</button>
      </div>
    );
  }
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

