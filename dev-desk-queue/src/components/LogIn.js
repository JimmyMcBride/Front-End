import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

export default class LogIn extends Component {
  //State

  state = {
    email: "",
    password: ""
  };

  //Axios calls
  logIn = event => {
    const user = {
      email: this.state.email,
      password: this.state.password,
    };

    axios
      .post("https://api-devdesk.herokuapp.com/api/login", JSON.stringify(user))
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  //Handlers
  handleChange = e => {
    this.setState({
      ...this.state.user,
      [e.target.name]: e.target.value
    });
  };

  handleLogin = e => {
    this.props.history.push("/dashboard");
  };

  //Log Out
  //   const logout = () => {
  //     localStorage.removeItem("access_token");
  //     localStorage.removeItem("expire_at");
  // }

  render() {
    return (
      <Container>
        <div>
          <form onSubmit={this.handleLogin}>
            <input
              placeholder="Email"
              type="text"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
            <input
              placeholder="Password"
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
            <button onClick={this.logIn}>Log in</button>
          </form>
        </div>
      </Container>
    );
  }
}