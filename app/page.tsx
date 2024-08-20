'use client';

import { useState, useEffect } from 'react';

type Todo = { id: number; text: string };

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos from the API when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('Failed to fetch todos');
      const data = await res.json();
      setTodos(data);
    } catch (err: any) {
      console.error(err.message);
      setError('Could not load todos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() === '') return; // prevent empty todos
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo }),
      });
      if (!res.ok) throw new Error('Failed to add todo');
  
      // Log the raw response text to see what the API is returning
      const addedTodo = await res.json();
      console.log('API response:', addedTodo);
  
      // Assuming the API response is the added todo item
      if (typeof addedTodo === 'object' && addedTodo !== null) {
        setTodos([...todos, addedTodo]); // Add the new todo to the list
        setNewTodo(''); // Clear the input field
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (err: any) {
      console.error(err.message);
      setError('Could not add todo. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  

  const updateTodo = async (id: number) => {
    const newText = prompt('New text:', '');
    if (newText && newText.trim() !== '') {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/todos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, text: newText }),
        });
        if (!res.ok) throw new Error('Failed to update todo');
        fetchTodos(); // Reload todos after update
      } catch (err: any) {
        console.error(err.message);
        setError('Could not update todo. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteTodo = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/todos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete todo');
      fetchTodos(); // Reload todos after delete
    } catch (err: any) {
      console.error(err.message);
      setError('Could not delete todo. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>My Todo List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={addTodo} disabled={loading}>
        Add Todo
      </button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => updateTodo(todo.id)} disabled={loading}>
              Update
            </button>
            <button onClick={() => deleteTodo(todo.id)} disabled={loading}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
