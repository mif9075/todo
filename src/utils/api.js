import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthJWT from './setAuthJWT';

export const handleSubmitNewTask = (newTask, oldStateArray) => {
    return new Promise((resolve, reject) => {

        let token = localStorage.getItem('jwtToken');
        let decoded = jwt_decode(token);

        let newObj = {
            todo: newTask,
            id: decoded.id
          }

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        }

        axios.post('http://localhost:3001/todo/createtodo', newObj, axiosConfig)
             .then( newTodo => {
                console.log(newTodo)
                let currentTaskArray = [...oldStateArray];
                currentTaskArray.push(newTodo.data);
                resolve(currentTaskArray);

             })
             .catch( error => {
                reject(error)
             })


    });
}



export const handleGetAllTodoApi = () => {

    return new Promise((resolve, reject) => {

        let token = localStorage.getItem('jwtToken');
        let decoded = jwt_decode(token);

        axios.get(`http://localhost:3001/todo?id=${decoded.id}`)
             .then( result => {
                resolve(result);
             })
             .catch( error => {
                reject(error);
             });
    });
}

export const handleSignUpAndLogInApi = (userInfo) => {

    return new Promise((resolve, reject) => {

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': "*"
            }
        };

        axios.post('http://localhost:3001/users/signupandlogin', userInfo, axiosConfig)
             .then( result => {

                const { token } = result.data;

                localStorage.setItem('jwtToken', token);

                const decoded = jwt_decode(token);

                setAuthJWT(token);

                resolve(decoded);

             })
             .catch( error => {
                 reject(error);
             })
    

    });
}

export const handleJWTExpirationApi = () => {

    return new Promise((resolve, reject) => {

        let token = localStorage.getItem('jwtToken');
        let currentTime = Date.now() / 1000;
        let decoded = jwt_decode(token);

        if (decoded.exp < currentTime) {
            localStorage.removeItem('jwtToken');
            setAuthJWT(null);
            reject(null);
        } else {
            setAuthJWT(token);
            resolve(token);
        }
    });
}

export const handleDeleteApi = (todoID) => {

    return new Promise( (resolve, reject) => {

        let token = localStorage.getItem('jwtToken');
        let decoded = jwt_decode(token);

        axios.delete(`http://localhost:3001/todo/deletetodobyid/${decoded.id}/${todoID}`)
             .then( todo => {
                
                resolve(todo.data.todos);

             })
             .catch( error => {
                 reject(error);
             })


    });

}

export const handleEditApi = (id, currentTodoState) => {

    return new Promise( (resolve, reject) => {

        let newObj = {
            id, 
            newTodo: currentTodoState
        }

        axios.put('http://localhost:3001/todo/updatetodobyid',  newObj)
             .then( result => {
               
                resolve(result.data)
             })
             .catch( error => {
                reject(error)
             })


    })
}