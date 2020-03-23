import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

export default class CourseDetail extends Component {

  constructor() {
    super();
    this.state = {
      course: [],
      error: ''
    }
  }

  // Individual course is fetched when component is mountes
  
  componentDidMount() {
    const { context } = this.props;
    context.data.getSingleCourse(this.props.match.params.id)
      .then(
        response => {
          if (response === 'notfound') {
            this.props.history.push('/notfound');
          } else {
            this.setState(() => {
              return {
                course: response
              }
            });
          } 
      }).catch((err) => {
        this.setState(() => {
          return {
            error: err
          }
        });
      });
  }

// Update and Delete Buttons are rendered if there is an uthenticated user and the authenticated user is equal with the course owner  
  renderButtons() {
    const { context } = this.props;

    if (context.authenticatedUser) {
      if (this.state.course.length && this.state.course[0].userId === context.authenticatedUser.userId) {
        return (
          <span><Link className="button" to={`/courses/${this.state.course[0].id}/update`}>Update Course</Link><button className="button" onClick={this.delete}>Delete Course</button></span>
        );
      }
    }  
  }


// Deletes course

  delete = () => {
    const { context } = this.props;

    const courseId = this.props.match.params.id;
    const { emailAddress, password } = context.authenticatedUser;

    context.data.deleteCourse(courseId, emailAddress, password)
      .then(() => {
        this.props.history.push('/');
      })
      .catch( err => {
        console.log(err);
        this.props.history.push('/error');
      })
  }

  // Renders course owner if the course owner is equal with the authenticated user

  renderCourseOwner() {
    const { context } = this.props;

    if (context.authenticatedUser) {
      if (this.state.course.length && this.state.course[0].userId === context.authenticatedUser.userId) {
        return `By ${context.authenticatedUser.firstName} ${context.authenticatedUser.lastName}`;
      }
    }
  }

  render() {

    return (
      
      <div>
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              { this.renderButtons() }
              <Link className="button button-secondary" to="/">Return to List</Link>
            </div>
          </div>
        </div>
        <div className="bounds course--detail">
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{this.state.course.length ? this.state.course[0].title : ""}</h3>
              <p>{ this.renderCourseOwner() }</p>
            </div>
            <div className="course--description">
              <ReactMarkdown source={this.state.course.length ? this.state.course[0].description : ""} />
            </div>
          </div>
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <h3>{this.state.course.length ? this.state.course[0].estimatedTime : ""}</h3>
                </li>
                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                  <ReactMarkdown source={this.state.course.length ? this.state.course[0].materialsNeeded : ""} />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}   