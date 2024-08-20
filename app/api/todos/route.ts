import { NextResponse } from 'next/server';

let todos = [{ id: 1, text: 'Learn CRUD in Next.js' }];

// GET: Retrieve all todos
export async function GET() {
  return NextResponse.json(todos);
}

// POST: Create a new todo
export async function POST(request: Request) {
  const { text } = await request.json();
  const newTodo = { id: todos.length + 1, text };
  todos.push(newTodo);
  return NextResponse.json(newTodo);
}

// PUT: Update a todo
export async function PUT(request: Request) {
  const { id, text } = await request.json();
  todos = todos.map(todo => todo.id === id ? { ...todo, text } : todo);
  return NextResponse.json({ message: 'Todo updated' });
}

// DELETE: Delete a todo
export async function DELETE(request: Request) {
  const { id } = await request.json();
  todos = todos.filter(todo => todo.id !== id);
  return NextResponse.json({ message: 'Todo deleted' });
}
