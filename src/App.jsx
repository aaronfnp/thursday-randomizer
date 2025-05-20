import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [players, setPlayers] = useState([{name: "Chris", role: "Healer"},{name: "Aaron", role: "DPS"}])
  const [groups, setGroups] = useState([])
  const roles = ["Healer", "DPS", "Tank"]

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Thursday M+</h1>
      <div className="content-container">
        <div className='input-container'>
          <h2>Compadres</h2>
        {players.map(player => (
          <div className='player-input-container'>
            <li>{player.name}</li> 
            {roles.map(role => (
              <div>
                <label>{role}</label>
                <input type="checkbox"></input>
              </div>
            ))}
          </div>
        ))}
        </div>
        <div className='output-container'>
        {groups.map(member => (
          <div className='player-output-container'>
         <li>{member}</li> 
         </div>
        ))}
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
