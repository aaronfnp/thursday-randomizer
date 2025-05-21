import { useState } from 'react'
import './App.css'

function App() {
  const [players, setPlayers] = useState([
    {name: "Aidan", roles: ["Healer", "DPS"]},
    {name: "Chris", roles: ["Healer", "DPS"]},
    {name: "Rob", roles: ["Healer", "DPS"]},
    {name: "Kyle", roles: ["DPS"]},
    {name: "Connor", roles: ["Tank", "DPS"]},
    {name: "Aaron J", roles: ["Healer", "DPS"]},
    {name: "Aaron NP", roles: ["DPS", "Healer"]},
    {name: "David", roles: ["DPS"]},
  ])
  const [newPlayerName, setNewPlayerName] = useState("")
  const [groups, setGroups] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [groupMode, setGroupMode] = useState("even") // "even" or "random"
  
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

  // Random PUG names
  const pugNames = [
    "XxLegolasxX", "TankMcTankface", "ImNotHealing", "DPSGoGoGo", "HealzPlz",
    "CantInterrupt", "NoLeaveGroup", "StoodInFire", "WhatsAMechanic", "BossPuller",
    "NeedGear", "SellPortals", "NeverDies", "ALWAYSDies", "TopDPS",
    "NinjaPuller", "VendorGear", "InviteMe", "NeedCarry", "HugsBosses"
  ]

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, { name: newPlayerName, roles: [] }])
      setNewPlayerName("")
    }
  }
  
  const handleDragStart = (e, index) => {
    setIsDragging(true)
    setDraggedIndex(index)
    e.dataTransfer.setData('text/plain', index)
    // Add a ghost image for drag
    const ghostElement = document.createElement('div')
    ghostElement.classList.add('ghost-element')
    ghostElement.textContent = players[index].name
    document.body.appendChild(ghostElement)
    e.dataTransfer.setDragImage(ghostElement, 0, 0)
    setTimeout(() => {
      document.body.removeChild(ghostElement)
    }, 0)
  }
  
  const handleDragEnd = () => {
    setIsDragging(false)
    setDraggedIndex(null)
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
  }
  
  const handleDrop = (e) => {
    // Create a drop zone for deleting players
    if (e.target.classList.contains('delete-zone') || e.target.closest('.delete-zone')) {
      if (draggedIndex !== null) {
        const newPlayers = [...players]
        newPlayers.splice(draggedIndex, 1)
        setPlayers(newPlayers)
      }
    }
  }

  const handleRoleToggle = (playerIndex, role) => {
    const newPlayers = [...players]
    const playerRoles = newPlayers[playerIndex].roles || []
    
    if (playerRoles.includes(role)) {
      // Remove role if already selected
      newPlayers[playerIndex].roles = playerRoles.filter(r => r !== role)
    } else {
      // Add role if not already selected
      newPlayers[playerIndex].roles = [...playerRoles, role]
    }
    
    setPlayers(newPlayers)
  }

  const getRoleIcon = (role) => {
    const roleObj = roles.find(r => r.title === role)
    return roleObj ? roleObj.img : null
  }

  // Get a random PUG player
  const getRandomPUG = (role) => {
    const randomName = pugNames[Math.floor(Math.random() * pugNames.length)]
    return {
      name: randomName,
      assignedRole: role,
      isPug: true,
      roles: [role]
    }
  }

  const createGroups = () => {
    // Validate: each player must have at least one role
    const invalidPlayers = players.filter(player => !player.roles || player.roles.length === 0)
    if (invalidPlayers.length > 0) {
      alert(`Please select at least one role for: ${invalidPlayers.map(p => p.name).join(', ')}`)
      return
    }

    // Create a working copy of players
    const playerPool = [...players]
    
    // Analyze the players and determine optimal number of groups
    const finalGroups = generateOptimalGroups(playerPool)
    
    // Set the final groups
    setGroups(finalGroups)
  }

  const generateOptimalGroups = (playerPool) => {
    // Calculate how many groups we need based on player count
    const totalPlayers = playerPool.length
    
    // Calculate the ideal number of groups based on player count
    let idealGroups = Math.ceil(totalPlayers / 5)
    
    // If we have 6 or more players, we should create at least 2 groups
    // even if we need to use PUG tanks/healers
    if (totalPlayers >= 6) {
      idealGroups = Math.max(2, idealGroups)
    }
    
    // Use the ideal number of groups, regardless of available tanks/healers
    // We'll add PUGs for missing roles later
    const numGroups = idealGroups
    
    // Initialize the groups
    const groups = Array(numGroups).fill().map(() => [])
    
    // ----- IMPROVED ROLE DISTRIBUTION LOGIC -----
    
    // First, collect all players by their roles
    const tankPlayers = [...playerPool.filter(p => p.roles.includes("Tank"))]
    const healerPlayers = [...playerPool.filter(p => p.roles.includes("Healer"))]
    const dpsPlayers = [...playerPool.filter(p => p.roles.includes("DPS"))]
    
    // Shuffle these collections to avoid always picking the same players
    tankPlayers.sort(() => Math.random() - 0.5)
    healerPlayers.sort(() => Math.random() - 0.5)
    dpsPlayers.sort(() => Math.random() - 0.5)
    
    // Track assigned players
    const assignedPlayers = new Set()
    
    // First, assign tank-only players to distribute them evenly
    const tankOnlyPlayers = tankPlayers.filter(p => p.roles.length === 1)
    tankOnlyPlayers.forEach((player, index) => {
      const groupIndex = index % numGroups
      groups[groupIndex].push({...player, assignedRole: "Tank"})
      assignedPlayers.add(player.name)
    })
    
    // Then assign remaining tanks
    const remainingTanks = tankPlayers.filter(p => !assignedPlayers.has(p.name))
    remainingTanks.forEach((player, index) => {
      const groupIndex = index % numGroups
      
      // Skip groups that already have a tank
      if (groups[groupIndex].some(p => p.assignedRole === "Tank")) {
        return
      }
      
      groups[groupIndex].push({...player, assignedRole: "Tank"})
      assignedPlayers.add(player.name)
    })
    
    // Assign healer-only players next
    const healerOnlyPlayers = healerPlayers.filter(p => p.roles.length === 1 && !assignedPlayers.has(p.name))
    healerOnlyPlayers.forEach((player, index) => {
      const groupIndex = index % numGroups
      
      // Skip groups that already have a healer
      if (groups[groupIndex].some(p => p.assignedRole === "Healer")) {
        const availableGroups = groups
          .map((group, idx) => ({ group, idx }))
          .filter(g => !g.group.some(p => p.assignedRole === "Healer"))
        
        if (availableGroups.length > 0) {
          const targetGroup = availableGroups[0]
          groups[targetGroup.idx].push({...player, assignedRole: "Healer"})
          assignedPlayers.add(player.name)
        }
      } else {
        groups[groupIndex].push({...player, assignedRole: "Healer"})
        assignedPlayers.add(player.name)
      }
    })
    
    // Assign remaining healers
    const remainingHealers = healerPlayers.filter(p => !assignedPlayers.has(p.name))
    for (let i = 0; i < numGroups; i++) {
      // Skip if this group already has a healer
      if (groups[i].some(p => p.assignedRole === "Healer")) {
        continue
      }
      
      if (remainingHealers.length > 0) {
        const player = remainingHealers.shift()
        groups[i].push({...player, assignedRole: "Healer"})
        assignedPlayers.add(player.name)
      }
    }
    
    // Distribute remaining players as DPS
    const remainingPlayers = playerPool.filter(p => !assignedPlayers.has(p.name))
    
    if (groupMode === "even") {
      // Distribute players evenly
      remainingPlayers.forEach((player) => {
        // Find the group with the fewest players
        const groupSizes = groups.map(g => g.length)
        const minSize = Math.min(...groupSizes)
        const targetGroups = groups
          .map((group, idx) => ({ group, idx }))
          .filter(g => g.group.length === minSize)
        
        // Randomly choose one of the smallest groups
        const randomIndex = Math.floor(Math.random() * targetGroups.length)
        const targetGroup = targetGroups[randomIndex]
        
        groups[targetGroup.idx].push({...player, assignedRole: "DPS"})
        assignedPlayers.add(player.name)
      })
    } else {
      // Random distribution
      remainingPlayers.forEach((player) => {
        // Randomly select a group
        const randomIndex = Math.floor(Math.random() * numGroups)
        
        groups[randomIndex].push({...player, assignedRole: "DPS"})
        assignedPlayers.add(player.name)
      })
    }
    
    // Fill missing roles with PUGs
    groups.forEach(group => {
      // Add tank if missing
      if (!group.some(p => p.assignedRole === "Tank")) {
        group.push(getRandomPUG("Tank"))
      }
      
      // Add healer if missing
      if (!group.some(p => p.assignedRole === "Healer")) {
        group.push(getRandomPUG("Healer"))
      }
      
      // Fill up to 3 DPS
      const dpsCount = group.filter(p => p.assignedRole === "DPS").length
      for (let i = dpsCount; i < 3; i++) {
        group.push(getRandomPUG("DPS"))
      }
    })
    
    return groups
  }

  return (
    <>
      <div className="app-header">
        <h1 className="title">
          <span className="title-thursday">Thursday</span>
          <span className="title-plus">M+</span>
          <div className="title-glow"></div>
        </h1>
      </div>
      
      {/* Delete zone that appears when dragging */}
      <div 
        className={`delete-zone ${isDragging ? 'visible' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="delete-icon">🗑️</div>
        <div>Drop to delete</div>
      </div>
      
      <div className="content-container">
        <div className='input-container'>
          <h2>Compadres</h2>
          {players.map((player, index) => (
            <div 
              className={`player-input-container ${draggedIndex === index ? 'dragging' : ''}`}
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="drag-handle">
                <span className="drag-icon">⋮⋮</span>
              </div>
              <li>{player.name}</li> 
              {roles.map(role => (
                <div key={role.title} className="role-option">
                  <input 
                    type="checkbox" 
                    id={`${player.name}-${role.title}-checkbox`} 
                    checked={player.roles && player.roles.includes(role.title)}
                    onChange={() => handleRoleToggle(index, role.title)}
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
          
          {/* Add new player component */}
          <div className='player-input-container new-player'>
            <input
              type="text"
              placeholder="New player name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className="new-player-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddPlayer()
              }}
            />
            <button 
              onClick={handleAddPlayer}
              className="add-player-btn"
            >
              Add Player
            </button>
          </div>
        </div>
        
        <div className='output-container'>
          <h2>Groups</h2>
          {groups.length > 0 ? (
            groups.map((group, groupIndex) => (
              <div className='group-output' key={groupIndex}>
                <h3>Group {groupIndex + 1} ({group.filter(p => !p.isPug).length} players)</h3>
                {group.map((player, playerIndex) => (
                  <div 
                    className={`player-output-container ${player.isPug ? 'pug-player' : ''}`}
                    key={playerIndex}
                    style={{
                      backgroundImage: player.assignedRole ? 
                        `linear-gradient(rgba(26, 26, 26, 0.8), rgba(26, 26, 26, 0.8)), url(${getRoleIcon(player.assignedRole)})` : 
                        'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <span className="player-name">{player.name}</span>
                    <div className="role-indicators">
                      {player.isPug && <span className="pug-badge">PUG</span>}
                      <img 
                        src={getRoleIcon(player.assignedRole)} 
                        alt={player.assignedRole} 
                        className="role-output-icon" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="empty-state">
              No groups generated yet
            </div>
          )}
        </div>
      </div>
      
      {/* Randomizer controls */}
      <div className="randomizer-container">
        <div className="mode-selection">
          <h3>Distribution Mode</h3>
          <div className="mode-options">
            <label className={`mode-bubble ${groupMode === 'even' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="groupMode" 
                value="even"
                checked={groupMode === 'even'}
                onChange={() => setGroupMode('even')}
              />
              <span className="bubble-text">Even Groups</span>
              <span className="bubble-description">Split players evenly across groups</span>
            </label>
            
            <label className={`mode-bubble ${groupMode === 'random' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="groupMode" 
                value="random"
                checked={groupMode === 'random'}
                onChange={() => setGroupMode('random')}
              />
              <span className="bubble-text">Random Distribution</span>
              <span className="bubble-description">Randomly distribute players</span>
            </label>
          </div>
        </div>
        
        <button 
          className="create-groups-btn"
          onClick={createGroups}
          disabled={players.length < 1}
        >
          Create Groups
        </button>
      </div>
    </>
  )
}

export default App