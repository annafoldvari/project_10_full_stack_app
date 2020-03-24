import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Data from '../Data';

export default class Courses extends Component {

  constructor() {
    super();
    this.data = new Data()
    this.state = {
      courses: []
    }
  }
  

  // Courses details fetched when component mounts
  
  componentDidMount() {
    this.data.getCourses().then(courses => {
      this.setState(() => {
        return {
          courses: courses
        }
      });
    })
    .catch( err => {
      console.log(err);
      this.props.history.push('/error');
    });
  } 

  renderCourses() {
    if (this.state.courses.length > 0) {
      return this.state.courses.map(course => {
        return (
         <div className="grid-33" key={course.id}>
           <Link className="course--module course--link" to={`/courses/${course.id}`}>
            <h4 className="course--label">Course</h4>
            <h3 className="course--title">{course.title}</h3>
           </Link>
        </div>
        );
      });
    }
  } 

  render() {
    return (
      <div className="bounds">
        { this.renderCourses() }
        <div className="grid-33">
          <Link className="course--module course--add--module" to="/courses/create">
            <h3 className="course--add--title">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 13 13" className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>New Course
            </h3>
          </Link>
        </div>
      </div>
    );
  }

}