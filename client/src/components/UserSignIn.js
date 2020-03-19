import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class UserSignin extends Component {
  state = {
    emailAddress: '',
    password: '',
    errors: [],
  }

  render() {
    const {
      emailAddress,
      password,
      errors
    } = this.state;

    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <div>
            <form onSubmit={this.submit} >
              <div>
                <input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value={emailAddress} onChange={this.change} />
              </div>
              <div>
                <input id="password" name="password" type="password" className="" placeholder="Password" value={password} onChange={this.change} />
              </div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit">Sign In</button>
                <button className="button button-secondary" onClick={this.cancel}>Cancel</button>
                </div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
        </div>
      </div>
    );
  }

  change = (event) => {
    const name = event.target.name;
    const value= event.target.value;

    this.setState(() => {
      return {
        [name]: value 
      }
    })
  }

  submit = (event) => {
    event.preventDefault();
    const { context } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { emailAddress, password } = this.state;
    context.actions.signIn(emailAddress, password)
      .then(user => {
        if (user === null) {
          this.setState(() => {
            return { errors: [ 'Sign-in was unsuccessful' ] };
          });
        } else {
          this.props.history.push(from);
        }
      })
      .catch( err => {
        console.log(err);
        this.props.history.push('/error');
      })  
  }

  cancel = () => {
    this.props.history.push('/');
  }
}