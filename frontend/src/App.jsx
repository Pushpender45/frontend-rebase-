import { useState, useEffect } from 'react';

// Unified API base URL handling
const API_BASE_URL = import.meta.env.VITE_API_URL || ''; 

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tasks
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/todos`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add a new task
  const addTodo = async (e) => {
    if (e) e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo })
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to add task');
      }

      const data = await response.json();
      
      // FIXED: Refreshing state with the returned data from backend
      // Using functional update to ensure consistency
      setTodos((prevTodos) => [data, ...prevTodos]);
      setNewTodo('');
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error adding todo:', err);
    }
  };

  return (
    <div style={{ 
      padding: '60px 20px', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', 
      color: '#f8fafc', 
      minHeight: '100vh',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '800', 
            background: 'linear-gradient(to right, #ec4899, #8b5cf6)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            Todo AI
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Rebase Full-Stack Challenge</p>
        </header>

        <form onSubmit={addTodo} style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '32px',
          background: 'rgba(30, 41, 59, 0.5)',
          padding: '8px',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <input 
            value={newTodo} 
            onChange={(e) => setNewTodo(e.target.value)} 
            placeholder="What needs to be done?"
            style={{ 
              flex: 1,
              padding: '14px 18px', 
              background: 'transparent', 
              border: 'none', 
              color: 'white',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <button 
            type="submit"
            style={{ 
              padding: '12px 24px', 
              background: '#ec4899', 
              color: 'white', 
              border: 'none', 
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 14px 0 rgba(236, 72, 153, 0.39)'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Add Task
          </button>
        </form>

        {error && (
          <div style={{ 
            padding: '12px 16px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            borderLeft: '4px solid #ef4444', 
            color: '#fca5a5',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', color: '#94a3b8' }}>Loading your tasks...</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {todos.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748b', marginTop: '40px' }}>
                No tasks yet. Start by adding one above!
              </div>
            ) : (
              todos.map(todo => (
                <li 
                  key={todo._id} 
                  style={{ 
                    background: 'rgba(30, 41, 59, 0.7)', 
                    padding: '16px 20px', 
                    borderRadius: '12px', 
                    marginBottom: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    animation: 'fadeIn 0.3s ease-out forwards'
                  }}
                >
                  <span style={{ fontSize: '1.05rem', fontWeight: '500' }}>{todo.title}</span>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: todo.completed ? '#22c55e' : '#f59e0b' }}></div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;
