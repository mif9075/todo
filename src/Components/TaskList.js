import React, { Component } from 'react'

class TaskList extends Component {

  state = {
      isToggle: false,
      newInput: ''
  }  

  taskListHandleDeleteByID = (id) => {
     
      this.props.taskHandleDeleteByIDProps(id)
  }

  taskListHandleToggle = (id) => {


    this.setState({
        isToggle: !this.state.isToggle
    }, () => {
    
        if (this.props.task.todo === this.state.newInput) {
            return;
        } else {
            this.props.taskHandleEditInput(id, this.state.newInput)
        }

    })
  }

  taskListHandleEdit = (event) => {
  
    this.setState({
        newInput: event.target.value
    })

  }

  componentDidMount() {
      this.setState({
          newInput: this.props.task.todo
      })
  }

  render() {


    const { todo, _id } = this.props.task;
    const { isToggle, newInput } = this.state; 
    return (
        <div style={{marginBottom: '10px'}}>
            {  isToggle ? <input 
                            value={newInput} 
                            onChange={this.taskListHandleEdit.bind(this)} 
                            name="newInput"
                            /> 
                            : todo } 
            <button onClick={() => this.taskListHandleToggle(_id)} style={{marginLeft: '5px', marginRight: '5px'}}>Edit</button>
            <button onClick={() => this.taskListHandleDeleteByID(_id)}>Delete</button>
        </div>
    )
  }
}

export default TaskList;