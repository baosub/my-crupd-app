

import { NextResponse } from 'next/server';
//import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/app/lib/subapaseClient';



let todos = [{ id: 1, text: 'Learn CRUD in Next.js' }];

export async function GET() {
    const { data, error } = await supabase.from('todos').select();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  }
  
  export async function POST(req: Request) {
    try {
      const { text } = await req.json();
  
      if (!text) {
        return NextResponse.json({ error: 'Text is required' }, { status: 400 });
      }
  
      const { data, error } = await supabase
        .from('todos')
        .insert([{ text }])
        .select(); // Use .select() to get the inserted row back
  
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  
      // Return the newly created todo item
      return NextResponse.json(data[0], { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: 'Failed to add todo' }, { status: 500 });
    }
  }
  


// PUT: Update a todo

{/*export async function PUT(request: Request) {
  const { id, text } = await request.json();
  todos = todos.map(todo => todo.id === id ? { ...todo, text } : todo);
  return NextResponse.json({ message: 'Todo updated' });
}*/}
export async function PUT(request: Request) {
    const { id, text } = await request.json();
    const { data, error } = await supabase.from('todos').update({ text }).eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  }




// DELETE: Delete a todo
{/*export async function DELETE(request: Request) {
  const { id } = await request.json();
  todos = todos.filter(todo => todo.id !== id);
  return NextResponse.json({ message: 'Todo deleted' });
} */}


export async function DELETE(request: Request) {
    const { id } = await request.json();
    const { data, error } = await supabase.from('todos').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Todo deleted', data });
  }
