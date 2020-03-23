import React, { Component } from 'react';

export default class CourseDetail extends Component {

  constructor() {
    super();
    this.state = {
      title: '',
      description: '',
      materialsNeeded: '',
      estimatedTime: '',
      userId: '',
      errors: ''
    }
  }
  
  // Getting the the course details for the update
  componentDidMount() {
    const { context } = this.props;

    context.data.getSingleCourse(this.props.match.params.id)
      .then(response => {
        if (response === 'notfound') {
          this.props.history.push('/notfound');
        } else {
          this.setState(() => {
            return response[0];
          });
          if (context.authenticatedUser.userId !== this.state.userId) {
            this.props.history.push('/forbidden');
          }
        }
    }).catch((err) => {
      this.props.history.push('/error');
    });
  }

  // Renders course owner
  renderCourseOwner() {
    const { context } = this.props;

    if (context.authenticatedUser) {
      if (this.state.title && this.state.userId === context.authenticatedUser.userId) {
        return `By ${context.authenticatedUser.firstName} ${context.authenticatedUser.lastName}`;
      }
    }
  }

  // Renders Validation errors

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
      title,
      description,
      estimatedTime,
      materialsNeeded,
    } = this.state;
    return (
      
      <div className="bounds course--detail">
        <h1>Update Course</h1>
        <div>
          {this.renderValidationErrorBlock()}
          <form onSubmit={this.submit}>
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."
                    value={title} onChange={this.change} /></div>
                <p>{ this.renderCourseOwner() }</p>
              </div>
              <div className="course--description">
                <div><textarea id="description" name="description" className="" placeholder="Course description..." value={description} onChange={this.change}></textarea></div>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                        placeholder="Hours" value={estimatedTime} onChange={this.change} /></div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." value={materialsNeeded} onChange={this.change}></textarea></div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom"><button className="button" type="submit">Update Course</button><button className="button button-secondary" onClick={this.cancel}>Cancel</button></div>
          </form>
        </div>
      </div>
    );
  }

  // Listens to changes in the form element and populates the state with values

  change = (event) => {
    const name = event.target.name;
    const value= event.target.value;

    this.setState(() => {
      return {
        [name]: value 
      }
    })
  }
// Submit method executed at for submition

  submit = (event) => {
    event.preventDefault();
    const { context } = this.props;
    const { emailAddress, password } = context.authenticatedUser;
    const courseId = this.props.match.params.id;

    const {
      title,
      description,
      estimatedTime,
      materialsNeeded
    } = this.state;

    const course = {
      title,
      description,
      estimatedTime,
      materialsNeeded
    }

    context.data.updateCourse(courseId, course, emailAddress, password)
      .then((response) => {
        if (response === 'success') {
        this.props.history.push('/');
        } else if (response === 'forbidden') {
          this.props.history.push('/forbidden');
        } else {
          this.setState(() => { 
            return {
              errors: response.message
            }   
          });
        }
      })
      .catch( err => {
        console.log(err);
        this.props.history.push('/error');
      })  
  }

  // Function executed when cancel button is pressed

  cancel = (event) => {
    event.preventDefault();
    const courseId = this.props.match.params.id;
    this.props.history.push(`/courses/${courseId}`);
  }
}   