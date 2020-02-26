import React from "react";
import { Link } from "@reach/router";
import uuid from "uuid";

import TodoForm from "./TodoForm";
import Todo from "./Todo";

function createTodo(name) {
  return {
    name,
    id: uuid(),
    checked: false
  };
}

function filterTodos(todo) {
  const filterMap = {
    all: true,
    active: !todo.checked,
    completed: todo.checked
  };
  const filterValue = this.props.location.pathname.substr(1);

  return filterMap[filterValue];
}

function buildTodoList(todo) {
  return (
    <Todo
      {...todo}
      key={todo.id}
      onToggleTodoComplete={this.onToggleTodoComplete}
      onDeleteTodo={this.onDeleteTodo}
      onUpdateTodoName={this.onUpdateTodoName}
    />
  );
}

class App extends React.Component {
  state = {
    todos: this.props.todos
  };

  newTodoInput = React.createRef();

  onCreateTodo = name => {
    const newTodo = createTodo(name);
    this.setState({
      todos: [...this.state.todos, newTodo]
    });
  };

  onDeleteTodo = id => {
    this.setState(
      {
        todos: this.state.todos.filter(t => t.id !== id)
      },
      () => {
        // Move DOM focus back to the new todo form
        // after deleting
        this.newTodoInput.current.focus();
      }
    );
  };

  onToggleTodoComplete = id => {
    this.setState({
      todos: this.state.todos.map(t => ({
        ...t,
        checked: t.id === id ? !t.checked : t.checked
      }))
    });
  };

  onUpdateTodoName = (id, name) => {
    this.setState({
      todos: this.state.todos.map(t => {
        if (t.id === id) {
          t.name = name;
        }
        return t;
      })
    });
  };

  render() {
    const todoList = this.state.todos
      .filter(filterTodos, this)
      .map(buildTodoList, this);
    return (
      <div className="todoapp stack-large">
        <TodoForm onCreateTodo={this.onCreateTodo} ref={this.newTodoInput} />
        <div className="todo-filters">
          <h2 class="list-heading">{todoList.length} tasks remaining</h2>
          <div className="todo-filters-group">
            <Link to="/all" className="link-btn">
              All
            </Link>
            <Link to="/active" className="link-btn">
              Active
            </Link>
            <Link to="/completed" className="link-btn">
              Completed
            </Link>
          </div>
        </div>
        <ul className="todo-list stack-small stack-exception">{todoList}</ul>
      </div>
    );
  }
}

export default App;
