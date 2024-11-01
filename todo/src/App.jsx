import './App.css';
import { useState } from 'react';

function App() {

  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    setTasks([...tasks, task]);
    setTask('');
  }

  const deleteTask = (del) => {
    const withoutRemoved = tasks.filter((item) => item !== del);
    setTasks(withoutRemoved);
  }

  return (
    <div id='container'>
      <h3>Todos</h3>
      <form>
        <input 
          placeholder='Add new task'
          value={task}
          onChange={e => setTask(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter'){
              e.preventDefault()
              addTask()
            }
          }}
        />
      </form>
      <ul>
        {tasks.map(v => (
          <li>
            {v}
            <button className='delete-button' onClick={() => deleteTask(v)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
