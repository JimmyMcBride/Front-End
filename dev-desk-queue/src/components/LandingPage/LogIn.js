import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Auth } from "../../authentication/Authentication";
import {
  Container,
  FormHeader,
  Form,
  InputWrapper,
  ButtonContainer
} from "../../styled-components/TicketForm_Styles";

export default class LogIn extends Component {
  //State
  state = {
    email: "",
    password: "",
    redirectToReferrer: false,
    formError: {
      email: "",
      password: ""
    }
  };

  // Axios calls
  // logIn = event => {
  //   const user = {
  //     email: this.state.email,
  //     password: this.state.password,
  //     redirectToReferrer: true,
  //   };
  //   event.preventDefault();
  //   axios
  //     .post("https://api-devdesk.herokuapp.com/api/login", user)
  //     .then((response) => {
  //       console.log(response);
  //       localStorage.setItem("token", response.data.token);
  //       this.props.setActiveUser(response.data.user);
  //     })
  //     .catch(function(error) {
  //       console.log(error);
  //     });
  // };

  /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     Moved the above into loginAuth so it triggers the authentication
      toggle based on whether or not the axios call returned a success
      response.
  */

  // Toggles Authentication when logging in.
  loginAuth = event => {
    event.preventDefault();

    if (this.formValidated()) {
      const { setActiveUser } = this.props; // method passed down from App.js

      const user = {
        email: this.state.email,
        password: this.state.password,
        redirectToReferrer: true
      };

      axios
        .post("https://api-devdesk.herokuapp.com/api/login", user)
        .then(response => {
          console.log("then response", response);

          // localStorage.setItem("token", response.data.token);
          /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            Not sure what to do with the token at this point if the toggle protects the routes.
            
            At the moment, if I refresh the page, the authentication toggle is switched to false,
              and the user is routed to the Login page from the Protected Route.
            
            If the the token has some kind of expiration on the server that could be checked every so
              often, I might be able to keep the user logged in based on whether or not the token is
              still valid.
            
            Until then, the user is just going to have to login if they refresh the page.
          */

          Auth.authenticate(() => {
            this.setState({ redirectToReferrer: true });
            setActiveUser(response.data.user);
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };

  //Handlers
  handleChange = e => {
    this.setState({
      ...this.state.user,
      [e.target.name]: e.target.value
    });
  };

  formValidated() {
    let isValid = true;
    const { email, password } = this.state;
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    const newFormError = {
      email: "",
      password: ""
    };

    if (!email) {
      newFormError.email = "Please enter your email address.";
      isValid = false;
    }
    else if (!emailRegex.test(email)) {
      newFormError.email = "An invalid email address was entered.";
    }
    if (!password) {
      newFormError.password = "Please enter your password";
      isValid = false;
    }

    if (!isValid) {
      this.setState({
        ...this.state,
        formError: newFormError
      });
    }
    return isValid;
  }

  render() {
    //Redirects to Dashboard once authenticated.
    const { redirectToReferrer, formError } = this.state;

    if (redirectToReferrer === true) {
      return <Redirect to="/tickets" />;
    }

    return (
      <Container>
        <FormHeader>
          <h1>Login</h1>
        </FormHeader>
        <Form onSubmit={this.loginAuth}>
          <InputWrapper>
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
            {formError.email && <span>{formError.email}</span>}
          </InputWrapper>
          <InputWrapper>
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
            {formError.password && <span>{formError.password}</span>}
          </InputWrapper>
          <ButtonContainer>
            <button onClick={this.loginAuth}>Log in</button>
          </ButtonContainer>
        </Form>
      </Container>
    );
  }
}
