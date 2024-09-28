import axios from 'axios';

const baseUrl = 'http://localhost:3001';

const getTodos = async () => {
  try {
    const response = await axios.get(`${baseUrl}/todos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
};

const createTodo = async (payload) => {
  try {
    const { title, isDone } = payload;
    const response = await axios.post(`${baseUrl}/todos`, {
      title,
      isDone,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating todo:', error);
  }
};

const updateTodo = async (payload) => {
  try {
    const { id, title, isDone } = payload;
    const response = await axios.patch(`${baseUrl}/todos/${id}`, {
      title,
      isDone,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating todo:', error);
  }
};

const deleteTodo = async (id) => {
  try {
    await axios.delete(`${baseUrl}/todos/${id}`);
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};

export { getTodos, createTodo, updateTodo, deleteTodo };
