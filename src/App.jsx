import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [players, setPlayers] = useState([{name: "Chris", role: "Healer"},{name: "Aaron", role: "DPS"}])
  const [groups, setGroups] = useState([])
  const roles = [
    {
      title: "Healer", 
      img: "https://ih1.redbubble.net/image.331548773.1098/raf,360x360,075,t,fafafa:ca443f4786.u2.jpg"
    }, 
    {
      title: "DPS", 
      img: "https://ih1.redbubble.net/image.331565552.1599/raf,360x360,075,t,fafafa:ca443f4786.jpg"
    }, 
    {
      title: "Tank", 
      img: "https://ih1.redbubble.net/image.331545985.1023/raf,360x360,075,t,fafafa:ca443f4786.jpg"
    }
  ]
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
              <div key={role.title} className="role-option">
                <input 
                  type="checkbox" 
                  id={`${role.title}-checkbox`} 
                  aria-label={role.title}
                />
                <img 
                  src={role.img} 
                  alt={role.title} 
                  title={role.title} 
                  className="role-icon" 
                />
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
