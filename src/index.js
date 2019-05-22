import React, { useContext, useReducer, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import * as serviceWorker from './serviceWorker';

import TodosContext from './context';
import todosReducer from './reducer';

import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';

// useAPI is a custom hook
const useAPI = endpoint => {
  // Custom hooks must manage their own state
  const [data, setData] = useState([])

  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    // the endpoint is the only argument for the useAPI - a custom axios getter hook
    const response = await axios.get(endpoint)
  
    setData(response.data);
  }
  return data;
}

const App = () => {
  // take initial state from the  created context
  const initialState = useContext(TodosContext);
  // create a hook for using the context
  const [state, dispatch] = useReducer(todosReducer, initialState);
  // Utilize the custom hook created above
  const savedTodos = useAPI('https://hooks-api.joshuawsample.now.sh/todos');

  // useEffect can utilize the dispatch from the useReducer
  useEffect(() => {
    dispatch({
      type: 'GET_TODOS',
      payload: savedTodos,
    })
  }, [savedTodos]);

  return (
  <TodosContext.Provider value={{state, dispatch}}>
    <TodoForm />
    <TodoList />
  </TodosContext.Provider>
  );
}
ReactDOM.render(
    <App />
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
