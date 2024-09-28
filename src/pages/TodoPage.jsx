import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api/todos';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TodoPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate;
  const { isAuthenticated, currentMember } = useAuth();

  useEffect(() => {
    const getTodosAsync = async () => {
      try {
        const todos = await getTodos();
        setTodos(todos.map((todo) => ({ ...todo, isEdit: false })));
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    getTodosAsync();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);

  const handleChange = (value) => {
    setInputValue(value);
  };

  const handleAddTodo = async () => {
    try {
      if (!inputValue) return;
      const data = await createTodo({ title: inputValue, isDone: false });
      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
      });
      setInputValue('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleKeyDown = async () => {
    try {
      if (!inputValue) return;
      const data = await createTodo({ title: inputValue, isDone: false });
      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
      });
      setInputValue('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleToggleDone = async (id) => {
    try {
      const currentTodo = todos.find((todo) => todo.id === id);
      await updateTodo({
        id: currentTodo.id,
        isDone: !currentTodo.isDone,
      });
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, isDone: !todo.isDone };
          }
          return todo;
        });
      });
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleChangeMode = ({ id, isEdit }) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isEdit };
        }
        return { ...todo, isEdit: false };
      });
    });
  };

  const handleSave = async ({ id, title }) => {
    try {
      await updateTodo({ id, title });
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, title, isEdit: false };
          }
          return todo;
        });
      });
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prevTodos) => {
        return prevTodos.filter((todo) => todo.id !== id);
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div>
      TodoPage
      <Header username={currentMember?.name} />
      <TodoInput
        inputValue={inputValue}
        onChange={handleChange}
        onAddTodo={handleAddTodo}
        onKeyDown={handleKeyDown}
      />
      <TodoCollection
        todos={todos}
        onToggleDone={handleToggleDone}
        onChangeMode={handleChangeMode}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <Footer todos={todos} />
    </div>
  );
};

export default TodoPage;
