import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Header from "./components/Header";
import Courses from "./components/Courses";
import UserSignIn from "./components/UserSignIn";
import UserSignUp from "./components/UserSignUp";
import UserSignOut from "./components/UserSignOut";
import CreateCourse from "./components/CreateCourse";
import CourseDetail from "./components/CourseDetail";
import UpdateCourse from "./components/UpdateCourse";
import NotFound from "./components/NotFound";
import Forbidden from "./components/Forbidden";
import UnhandledError from "./components/UnhandledError";

import PrivateRoute from './PrivateRoute';


import withContext from './Context';

// Connect the Header component to context
const HeaderWithContext = withContext(Header);
// Connect UserSignIn to context
const UserSignInWithContext = withContext(UserSignIn);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignOutWithContext = withContext(UserSignOut);
const CreateCourseWithContext = withContext(CreateCourse);
const CourseDetailWithContext = withContext(CourseDetail);
const UpdateCourseWithContext = withContext(UpdateCourse);

const App = () => (
  <Router>
    <div>
      <HeaderWithContext />

      <Switch>
        <Route exact path="/" component={Courses} />
        <Route path="/signin" component={UserSignInWithContext} />
        <Route path="/signup" component={UserSignUpWithContext} />
        <Route path="/signout" component={UserSignOutWithContext} />
        <PrivateRoute path="/courses/create" component={CreateCourseWithContext} />
        <Route exact path="/courses/:id" component={CourseDetailWithContext} />
        <PrivateRoute path="/courses/:id/update" component={UpdateCourseWithContext} />
        <Route path="/notfound" component={NotFound} />
        <Route path="/forbidden" component={Forbidden} />
        <Route path="/error" component={UnhandledError} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>     
);
 

export default App;
