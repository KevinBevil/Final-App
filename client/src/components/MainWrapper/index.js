import React from "react";
import LoginButton from "../LoginButton";
import LogoutButton from "../LogoutButton";
import Greeting from "../Greeting";
import CreateNewButton from "../CreateNewBtn";
import { List, ListItem, resItem } from "../List";
import DeleteBtn from "../DeleteBtn";
import API from "../../utils/API";

import * as firebase from "firebase";

var firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: "1:523402458186:web:859c24e987d60d43"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleCreateNew = this.handleCreateNew.bind(this);
    this.state = {
      isLoggedIn: false,
      newHabit: "",
      username: "",
      email: "",
      password: "",
      userId: "",
      allhabits: [],
      user: {}
    };
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  // handleFormSubmit = event => {
  //   event.preventDefault();
  //   if (this.state.email && this.state.password) {
  //     API.saveUser({
  //       email: this.state.email,
  //       password: this.state.password
  //     })
  //       .then(res => this.loadUser())
  //       .catch(err => console.log(err));
  //   }
  // };

  loadUser = () => {
    API.getUser(this.state.email)
      .then(res => {
        this.setState({
          user: res.data[0]
        });
      })
      .catch(err => console.log(err));
  };

  loadHabits = () => {
    API.getHabits()
      .then(res => {
        this.setState({
          allhabits: res.data
        });
      })
      .catch(err => console.log(err));
  };

  handleCreateNew() {
    auth
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(data => {
        db.ref("users").push({});
        // userId = data.user.uid;
        if (this.state.username && this.state.email) {
          API.saveUser({
            username: this.state.username,
            email: this.state.email,
            habits: []
          })
            .then(res => this.loadUser())
            .catch(err => console.log(err));
        }
        alert("Account created.  Please login now.");
        this.setState({ userId: auth.currentUser.uid });
      })
      .catch(function(err) {
        alert(err.message);
      });
  }

  handleLoginClick() {
    auth
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.setState({ isLoggedIn: true });
        this.loadUser();
        this.loadHabits();
        this.setState({ userId: auth.currentUser.uid });
      })
      .catch(error => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === "auth/wrong-password") {
          alert("Wrong password.");
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  }

  handleLogoutClick() {
    auth
      .signOut()
      .then(function() {
        // Sign-out successful.
      })
      .catch(function(error) {
        // An error happened.
      });
    this.setState({
      isLoggedIn: false,
      email: "",
      password: "",
      userId: "",
      user: {}
    });
  }

  componentDidMount() {
    this.loadUser();
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;

    return (
      <div>
        {!isLoggedIn ? (
          <div>
            <input
              type="text"
              value={this.state.username}
              onChange={this.handleInputChange}
              name="username"
              placeholder="username"
              required
            />
            <input
              type="text"
              value={this.state.email}
              onChange={this.handleInputChange}
              name="email"
              placeholder="email"
              required
            />
            <input
              type="text"
              value={this.state.password}
              onChange={this.handleInputChange}
              type="password"
              name="password"
              placeholder="password"
              required
            />
            <LoginButton onClick={this.handleLoginClick} />
            <CreateNewButton onClick={this.handleCreateNew} />
          </div>
        ) : (
          <div>
            <LogoutButton onClick={this.handleLogoutClick} />
            <div>
              <h1>Hello {this.state.user.username}</h1>
            </div>
            <Greeting isLoggedIn={isLoggedIn} />
            {this.state.user.habits.length ? (
              <div>
                <h5>Your Habits:</h5>
                {this.state.user.habits.map(element => (
                  <h6>{element}</h6>
                ))}
              </div>
            ) : (
              <div>
                <h5>Your Habits will go here:</h5>
              </div>
            )}
            <h4>All Habits</h4>
            {this.state.allhabits.length ? (
              <div>
                {this.state.allhabits.map(element => (
                  <h6 id="">{element.habitname}</h6>
                ))}
                <input
                  type="text"
                  value={this.state.newHabit}
                  onChange={this.handleInputChange}
                  name="newHabit"
                  placeholder="newHabit"
                  required
                />
              </div>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default LoginControl;