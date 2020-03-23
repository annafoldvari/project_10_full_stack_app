import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class UserSignUp extends Component {
  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    errors: [],
  }

// Renders validation errors

  renderValidationErrorBlock() {
    if (this.state.errors.length) {
      return (
        <div>
            <h2 className="validation--errors--label">Validation errors</h2>
            <div className="validation-errors">
              <ul>
                { this.renderValidationErrorMessages() }
              </ul>
            </div>
          </div>
      );
    }
  }

  renderValidationErrorMessages() {
    return this.state.errors.map((message,index) => <li key={index}>{message}</li>);
  }

  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
    } = this.state;

    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          <div>
            {this.renderValidationErrorBlock()}
            <form onSubmit={this.submit}>
              <div><input id="firstName" name="firstName" type="text" className="" placeholder="First Name" value={firstName} onChange={this.change} /></div>
              <div><input id="lastName" name="lastName" type="text" className="" placeholder="Last Name" value={lastName} onChange={this.change}/></div>
              <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value={emailAddress} onChange={this.change}/></div>
              <div><input id="password" name="password" type="password" className="" placeholder="Password" value={password} onChange={this.change}/></div>
              <div><input id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Confirm Password"
                  value={confirmPassword} onChange={this.change}/></div>
              <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign Up</button><button className="button button-secondary" onClick={this.cancel}>Cancel</button></div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>Already have a user account? <Link to="/signin">Click here</Link> to sign in!</p>
        </div>
      </div>
    );
  }

  // Listen to changes on input elements and populates the state

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

// Function that executed when form is submitted
  submit = (event) => {
    event.preventDefault();
    const { context } = this.props;

    if (this.state.password !== this.state.confirmPassword ) {
      this.setState( {
        errors: [ "Password don't match." ]
      });
      return;
    } else {

      const {
        firstName,
        lastName,
        emailAddress,
        password,
      } = this.state; 

      // New user payload
      const user = {
        firstName,
        lastName,
        emailAddress,
        password
      };

      context.data.createUser(user)
        .then( response => {
          if (response === 'success') {
            context.actions.signIn(emailAddress, password)
            .then(() => {
              this.props.history.push('/');
            })
          } else if (response.message.length) {
            this.setState(() => {
              return { errors: response.message }
            });
          }
        })
        .catch( err => { // handle rejected promises
          console.log(err);
          this.props.history.push('/error'); // push to history stack
        });
    }     
  }

// Cancels the sign up process and redirest to course list 
  cancel = () => {
    this.props.history.push('/');
  }
}
