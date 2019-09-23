import React, { Component } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import Nav from './Components/Nav';
import './App.css';

import Context from './Context/Context';

import {
  handleSignUpAndLogInApi,
  handleGetAllTodoApi,
  handleJWTExpirationApi,
  handleSubmitNewTask,
  handleDeleteApi,
  handleEditApi
} from './utils/api';

import Task from './Components/Task';

class App extends Component {

  state = {
    list : [],
    isAuth: false,
    user: null,
    password: '1',
    message: 'Please sign up to use the best Todo Manager System!',
  }

  componentDidMount() {

    handleJWTExpirationApi()
      .then( token => {

        let decoded = jwt_decode(token);

        this.setState({
          user: decoded.email,
          isAuth: true
        }, () => {

          handleGetAllTodoApi()
          .then( result => {

            this.setState({
              list: result.data.todos
            })

          })
          .catch( error => {
            this.setState({
              message: error.message,
              user: null
            })
          }) 

        })

      })
      .catch( error => {
        return;
      })
  
  }

  handleSubmit = (value) => {
  

    handleSubmitNewTask(value, this.state.list)
      .then( newTodoList => {
        console.log(newTodoList)
        this.setState({
          list: newTodoList
        })

      })
      .catch( error => {
        console.log(error);
      })
  }

  handleDelete = (taskID) => {

    handleDeleteApi(taskID)
      .then( newArray => {

        console.log(newArray)

        this.setState({
          list: newArray
        })
      })
      .catch( error => {
        console.log(error);
      })
  }

  handleEditInputUpdate = (id, newTodo) => {
    console.log('TRIGGERD', id, newTodo)

    handleEditApi(id, newTodo)
      .then( result => {

              let updated = [...this.state.list];
     
              updated.map(task => (task._id === id ? task.todo = result.todo : task))
  
            this.setState({
              list: updated
            })
      })
      .catch( error => {
        console.log(error)
      })

    // axios.put('http://localhost:3001/todo/updatetodobyid',  {
    //     id: id,
    //     newTodo: newTodo
    // })
    // .then(newTodo => {
     
    //   let updated = [...this.state.list];
     
    //   updated.map(task => (task._id === id ? task.todo = newTodo.data.todo : task))
  
    //   this.setState({
    //     list: updated
    //   })

    // })
    // .catch(error => {
    //   console.log(error);
    // })
  }

  handleAuth = (userInfo) => {
  
    handleSignUpAndLogInApi(userInfo)
      .then(decoded => {

        this.setState({
          user: decoded.email,
          isAuth: true
        }, () => {

          handleGetAllTodoApi()
            .then( result => {

              this.setState({
                list: result.data.todos
              })

            })
            .catch( error => {
              this.setState({
                message: error.message
              })
            }) 

        });

      })
      .catch( error => {
        this.setState({
          message: error.message
        })
      })



  }

  logout = () => {
    //console.log('85 logout');
    this.setState({
      user: null,
      message: 'Please login to use the app',
      isAuth: false
    });
    localStorage.removeItem("jwtToken");
  }

  render() {

    
    return (
     <Context.Provider
      value={{
        handleAuth: this.handleAuth,
        user: this.state.user,
        logout: this.logout
      }}
     >

      <div className="App">
          <Nav 
            appLogout={this.logout}
          />
          {
            this.state.isAuth ? (
              <Task 
                {...this.state}
                appHandleSubmit={this.handleSubmit}
                appHandleDeleteByID={this.handleDelete}
                appHandleEditInputUpdate={this.handleEditInputUpdate}
              />
            ) : this.state.message
          }
        </div>

     </Context.Provider>
    )
  }


}

export default App;

