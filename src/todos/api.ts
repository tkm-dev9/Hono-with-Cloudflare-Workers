import { Hono } from 'hono';
import { Bindings } from '../../bindings';
import { CreateTodo, UpdateTodo, createTodo, deleteTodo, getTodo, getTodos, updateTodo } from './model';

const todos = new Hono<{ Bindings: Bindings }>();

todos.get('/', async (c) => {
  const todos = await getTodos(c.env.HONO_TODO);
  return c.json(todos);
})

todos.post('/', async (c) => {
  const param = await c.req.json<CreateTodo>();
  console.warn(c);
  const newTodo = await createTodo(c.env.HONO_TODO, param);
  return c.json(newTodo, 201);
});

todos.put('/:id', async (c) => {
  const id = c.req.param('id');
  const todo = await getTodo(c.env.HONO_TODO, id);
  if (!todo) {
    return c.json({ message: 'not found' }, 404);
  }
  const param = await c.req.json<UpdateTodo>();
  await updateTodo(c.env.HONO_TODO, id, param);
  return new Response(null, { status: 204 });
});

todos.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const todo = await getTodo(c.env.HONO_TODO, id);
  if (!todo) {
    return c.json({ message: 'not found' }, 404);
  }
  await deleteTodo(c.env.HONO_TODO, id);
  return new Response(null, { status: 204 });
})

export { todos };