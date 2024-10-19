import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import './App.css'
// import Input from './components/Input';

function App() {
  const [score, setScore] = useState({})
  const [allScores, setAllScores] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const socket = io('localhost:3000');


  function connectSocket() {
    socket.on('connection', (socket) => {
      console.log(socket);
    })
  }

  function handleInput(event) {
    let { name, value } = event.target;
    let currentObject = { [name]: value }

    setScore((prev) => ({ ...prev, ...currentObject }));
  }

  function sendScore() {
    socket.emit('score', score);

    socket.on('playerScores', (playerScores) => {
      setAllScores(playerScores);
    })

    setScore({ name: '', score: '' });
  }

  const getEditData = (data) => {
    setScore(data)
    setIsEdit(true);
  }

  const handleEdit = () => {
    console.log(score);

    socket.emit('editScore', score);
    setIsEdit(false);
    setScore({ name: '', score: '' });
  }

  const handleDelete = (id) => {
    socket.emit('deleteScore', id);
  }

  useEffect(() => {
    // connectSocket();

    socket.on('playerScores', (playerScores) => {
      setAllScores(playerScores);
    })
  }, []);

  return (
    <>
      <h1>React Multiplayer Dashboard</h1>

      {/* <Input name='name' placeholder='Enter your name' handleInput={handleInput} />
      <Input name='score' placeholder='Enter your score' handleInput={handleInput} /> */}
      <div className='form-fields'>
        <input
          onChange={handleInput}
          className='input-field'
          name='name'
          placeholder='Enter your name'
          value={score.name}
        />

        <input
          onChange={handleInput}
          className='input-field'
          name='score'
          placeholder='Enter your score'
          value={score.score}
        />
        <button className="send-score" onClick={isEdit ? handleEdit : sendScore}>{isEdit ? 'Edit' : 'Publish Score'}</button>
      </div>


      {allScores.length > 0 ?
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>

            {allScores.map((score) => (
              <tr key={score?.id}>
                <td>{score?.name}</td>
                <td>{score?.score}</td>
                <td><button onClick={() => getEditData(score)}>Edit</button></td>
                <td><button onClick={() => handleDelete(score?.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table> : <></>
      }
    </>
  )
}

export default App
