import config from './config';

export default class Data {
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;
  
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requiresAuth) {    
      const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }

  // Gets the authenticated user
  async getUser(emailAddress, password) {
    const response = await this.api(`/users`, 'GET', null, true, { emailAddress, password });
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }

  // Creates user
  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return 'success';
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data;
      });
    } else {
      throw new Error();
    }
  } 

// Gets courses
  async getCourses() {
    const response = await this.api(`/courses`);
    if (response.status === 200) {
     return response.json().then(data => data);
    } else {
      throw new Error();
    }
  }

  // Gets a single course
  async getSingleCourse(course_id) {
    const response = await this.api(`/courses/${course_id}`);
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 404) {
      return 'notfound';
    }
    else {
      throw new Error();
    }
  }

  // Creates courses
  async createCourse(course, emailAddress, password) {
    const response = await this.api('/courses', 'POST', course, true, { emailAddress, password });
    if (response.status === 201) {
      return 'success';
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        console.log(data);
        return data;
      });
    }
    else {
      throw new Error();
    }
  }

  // Updates course
  async updateCourse(course_id, course, emailAddress, password) {
    const response = await this.api(`/courses/${course_id}`, 'PUT', course, true, { emailAddress, password } );
    if (response.status === 204) {
      return 'success';
    } else if (response.status === 403) {
      return 'forbidden';
    } else if (response.status === 400) {
      return response.json().then(data => {
        return data;
      });
    }
    else {
      throw new Error();
    }
  }

  // Deletes course
  async deleteCourse(course_id, emailAddress, password) {
    const response = await this.api(`/courses/${course_id}`, 'DELETE', null, true, { emailAddress, password });
    if (response.status === 204) {
      return [];
    }
    else if (response.status === 401) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }
}