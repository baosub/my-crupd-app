'use client'
import { useState, useEffect } from 'react';

type Todo = { id: number; text: string };

const page = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = async () => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newTodo }),
    });
    const data = await res.json();
    setTodos([...todos, data]);
    setNewTodo('');
  };

  const updateTodo = async (id: number) => {
    const newText = prompt('New text:', '');
    if (newText) {
      await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, text: newText }),
      });
      setTodos(todos.map(todo => todo.id === id ? { ...todo, text: newText } : todo));
    }
  };

  const deleteTodo = async (id: number) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setTodos(todos.filter(todo => todo.id !== id));
  };
  return (
    <div>
      <h1>My Todo List</h1>
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => updateTodo(todo.id)}>Update</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default page
