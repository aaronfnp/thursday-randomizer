import { useState } from 'react'
import { ChevronDown, ChevronUp, Settings, RotateCcw } from 'lucide-react'

// Component: Role preference gear box
const GearBox = ({ player, playerIndex, onPreferenceChange }) => {
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
    },
    {
      title: "Support", 
      img: "https://wowmeta.com/_app/immutable/assets/evoker-augmentation.Bn0_ORdu.avif"
    }
  ]

  const getRoleIcon = (role) => {
    const roleObj = roles.find(r => r.title === role)
    return roleObj ? roleObj.img : null
  }

  return (
    <div className="gear-box">
      <h4>Role Preferences for {player.name}</h4>
      <div className="preferences-grid">
        {player.roles && player.roles.map(role => (
          <div key={role} className="preference-item">
            <img src={getRoleIcon(role)} alt={role} className="pref-role-icon" />
            <label>{role}</label>
            <input 
              type="number"
              min="0"
              max="100"
              value={player.preferences[role] || 0}
              onChange={(e) => onPreferenceChange(playerIndex, role, e.target.value)}
              className="preference-input"
            />
            <span>%</span>
          </div>
        ))}
      </div>
      <div className="preference-note">
        Higher percentages = more likely to get that role
      </div>
    </div>
  )
}

// Component: Individual player row
const PlayerRow = ({ 
  player, 
  index, 
  rotationMode, 
  expandedGearBoxes, 
  draggedIndex,
  onDragStart, 
  onDragEnd, 
  onRoleToggle, 
  onToggleGearBox,
  onPreferenceChange 
}) => {
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
    },
    {
      title: "Support", 
      img: "https://wowmeta.com/_app/immutable/assets/evoker-augmentation.Bn0_ORdu.avif"
    }
  ]

  const getRoleIcon = (role) => {
    const roleObj = roles.find(r => r.title === role)
    return roleObj ? roleObj.img : null
  }

  return (
    <div key={index}>
      <div 
        className={`player-input-container ${draggedIndex === index ? 'dragging' : ''}`}
        draggable
        onDragStart={(e) => onDragStart(e, index)}
        onDragEnd={onDragEnd}
      >
        <div className="drag-handle">
          <span className="drag-icon">⋮⋮</span>
        </div>
        <li>{player.name}</li>
        
        {/* Role checkboxes */}
        {roles.map(role => (
          <div key={role.title} className="role-option">
            <input 
              type="checkbox" 
              id={`${player.name}-${role.title}-checkbox`} 
              checked={player.roles && player.roles.includes(role.title)}
              onChange={() => onRoleToggle(index, role.title)}
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
        
        {/* Used roles indicator in rotation mode - now below the main row */}
        {rotationMode && player.usedRoles && player.usedRoles.length > 0 && (
          <div className="used-roles">
            <span className="used-roles-text">Used: </span>
            {player.usedRoles.map(role => (
              <img 
                key={role}
                src={getRoleIcon(role)} 
                alt={role} 
                className="used-role-icon" 
                title={`Already played ${role}`}
              />
            ))}
          </div>
        )}

         {/* Gear box toggle */}
         <button 
          className="gear-toggle"
          onClick={() => onToggleGearBox(index)}
          title="Role Preferences"
        >
          <Settings size={16} />
          {expandedGearBoxes[index] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        
      </div>
      
      {/* Expandable gear box for preferences */}
      {expandedGearBoxes[index] && (
        <GearBox 
          player={player}
          playerIndex={index}
          onPreferenceChange={onPreferenceChange}
        />
      )}
    </div>
  )
}

// Component: Group display
const GroupDisplay = ({ groups }) => {
  const getRoleIcon = (role) => {
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
      },
      {
        title: "Support", 
        img: "https://wowmeta.com/_app/immutable/assets/evoker-augmentation.Bn0_ORdu.avif"
      }
    ]
    const roleObj = roles.find(r => r.title === role)
    return roleObj ? roleObj.img : null
  }

  if (groups.length === 0) {
    return (
      <div className="empty-state">
        No groups generated yet
      </div>
    )
  }

  return (
    <>
      {groups.map((group, groupIndex) => (
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
      ))}
    </>
  )
}

// Component: Loading dice animation
const DiceAnimation = () => {
  return (
    <div className="dice-container">
      <div className="dice">
        <div className="dice-face one">
          <div className="dot center"></div>
        </div>
        <div className="dice-face two">
          <div className="dot top-left"></div>
          <div className="dot bottom-right"></div>
        </div>
        <div className="dice-face three">
          <div className="dot top-left"></div>
          <div className="dot center"></div>
          <div className="dot bottom-right"></div>
        </div>
        <div className="dice-face four">
          <div className="dot top-left"></div>
          <div className="dot top-right"></div>
          <div className="dot bottom-left"></div>
          <div className="dot bottom-right"></div>
        </div>
        <div className="dice-face five">
          <div className="dot top-left"></div>
          <div className="dot top-right"></div>
          <div className="dot center"></div>
          <div className="dot bottom-left"></div>
          <div className="dot bottom-right"></div>
        </div>
        <div className="dice-face six">
          <div className="dot top-left"></div>
          <div className="dot top-right"></div>
          <div className="dot middle-left"></div>
          <div className="dot middle-right"></div>
          <div className="dot bottom-left"></div>
          <div className="dot bottom-right"></div>
        </div>
      </div>
      <p className="dice-text">Creating groups...</p>
    </div>
  )
}

// Main App Component
function App() {
  const [players, setPlayers] = useState([
    {
      name: "Aidan", 
      roles: ["Healer", "DPS", "Tank"],
      preferences: { Healer: 40, DPS: 30, Tank: 30, Support: 0 },
      usedRoles: []
    },
    {
      name: "Chris", 
      roles: ["Healer", "DPS"],
      preferences: { Healer: 60, DPS: 40, Tank: 0, Support: 0 },
      usedRoles: []
    },
    {
      name: "Rob", 
      roles: ["Healer", "DPS"],
      preferences: { Healer: 50, DPS: 50, Tank: 0, Support: 0 },
      usedRoles: []
    },
    {
      name: "Kyle", 
      roles: ["DPS"],
      preferences: { Healer: 0, DPS: 100, Tank: 0, Support: 0 },
      usedRoles: []
    },
    {
      name: "Connor", 
      roles: ["Tank", "DPS"],
      preferences: { Healer: 0, DPS: 40, Tank: 60, Support: 0 },
      usedRoles: []
    },
    {
      name: "Aaron J", 
      roles: ["Healer", "DPS"],
      preferences: { Healer: 70, DPS: 30, Tank: 0, Support: 0 },
      usedRoles: []
    },
    {
      name: "Aaron NP", 
      roles: ["DPS", "Healer", "Support"],
      preferences: { Healer: 30, DPS: 40, Tank: 0, Support: 30 },
      usedRoles: []
    },
    {
      name: "David", 
      roles: ["DPS"],
      preferences: { Healer: 0, DPS: 100, Tank: 0, Support: 0 },
      usedRoles: []
    },
  ])
  const [newPlayerName, setNewPlayerName] = useState("")
  const [groups, setGroups] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [groupMode, setGroupMode] = useState("even")
  const [isLoading, setIsLoading] = useState(false)
  const [rotationMode, setRotationMode] = useState(false)
  const [expandedGearBoxes, setExpandedGearBoxes] = useState({})

  // Add CSS styles directly to the component
  const styles = `
    body {
      font-family: 'Inter', 'Segoe UI', sans-serif;
      background-color: #242424;
      color: rgba(255, 255, 255, 0.87);
      line-height: 1.5;
      margin: 0;
      padding: 0;
    }
  `

  // Random PUG names
  const pugNames = [
    "XxLegolasxX", "TankMcTankface", "ImNotHealing", "DPSGoGoGo", "HealzPlz",
    "CantInterrupt", "NoLeaveGroup", "StoodInFire", "WhatsAMechanic", "BossPuller",
    "NeedGear", "SellPortals", "NeverDies", "ALWAYSDies", "TopDPS",
    "NinjaPuller", "VendorGear", "InviteMe", "NeedCarry", "HugsBosses"
  ]

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, { 
        name: newPlayerName, 
        roles: [],
        preferences: { Healer: 0, DPS: 0, Tank: 0, Support: 0 },
        usedRoles: []
      }])
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
    if (e.target.classList.contains('delete-zone') || e.target.closest('.delete-zone')) {
      if (draggedIndex !== null) {
        const newPlayers = [...players]
        newPlayers.splice(draggedIndex, 1)
        setPlayers(newPlayers)
        // Also remove from expandedGearBoxes
        const newExpanded = {...expandedGearBoxes}
        delete newExpanded[draggedIndex]
        // Shift indices for remaining players
        const shiftedExpanded = {}
        Object.keys(newExpanded).forEach(key => {
          const numKey = parseInt(key)
          if (numKey > draggedIndex) {
            shiftedExpanded[numKey - 1] = newExpanded[key]
          } else {
            shiftedExpanded[key] = newExpanded[key]
          }
        })
        setExpandedGearBoxes(shiftedExpanded)
      }
    }
  }

  const normalizePreferences = (player) => {
    const activeRoles = player.roles || []
    const totalPref = activeRoles.reduce((sum, role) => sum + (player.preferences[role] || 0), 0)
    
    if (totalPref > 0 && activeRoles.length > 0) {
      activeRoles.forEach(role => {
        player.preferences[role] = Math.round((player.preferences[role] / totalPref) * 100)
      })
    }
    
    // Set inactive roles to 0
    Object.keys(player.preferences).forEach(role => {
      if (!activeRoles.includes(role)) {
        player.preferences[role] = 0
      }
    })
  }

  const handleRoleToggle = (playerIndex, role) => {
    const newPlayers = [...players]
    const playerRoles = newPlayers[playerIndex].roles || []
    
    if (playerRoles.includes(role)) {
      // Remove role if already selected
      newPlayers[playerIndex].roles = playerRoles.filter(r => r !== role)
      // Reset preference for removed role
      newPlayers[playerIndex].preferences[role] = 0
    } else {
      // Add role if not already selected
      newPlayers[playerIndex].roles = [...playerRoles, role]
      // Set default preference
      const currentRoles = [...playerRoles, role]
      const defaultPref = Math.floor(100 / currentRoles.length)
      newPlayers[playerIndex].preferences[role] = defaultPref
    }
    
    // Normalize preferences to sum to 100
    normalizePreferences(newPlayers[playerIndex])
    setPlayers(newPlayers)
  }

  const handlePreferenceChange = (playerIndex, role, value) => {
    const newPlayers = [...players]
    const player = newPlayers[playerIndex]
    const numValue = Math.max(0, Math.min(100, parseInt(value) || 0))
    
    // Get all active roles for this player
    const activeRoles = player.roles || []
    const otherActiveRoles = activeRoles.filter(r => r !== role)
    
    // Set the new value for the changed role
    player.preferences[role] = numValue
    
    // Calculate remaining percentage to distribute
    const remaining = 100 - numValue
    
    if (remaining <= 0) {
      // If the new value is 100% or more, set all other roles to 0
      otherActiveRoles.forEach(r => player.preferences[r] = 0)
    } else if (otherActiveRoles.length > 0) {
      // Calculate current total of other active roles
      const othersTotal = otherActiveRoles.reduce((sum, r) => sum + (player.preferences[r] || 0), 0)
      
      if (othersTotal === 0) {
        // If other roles are 0, distribute equally
        const equalShare = Math.floor(remaining / otherActiveRoles.length)
        const remainder = remaining % otherActiveRoles.length
        otherActiveRoles.forEach((r, index) => {
          player.preferences[r] = equalShare + (index < remainder ? 1 : 0)
        })
      } else {
        // Distribute remaining percentage proportionally among other active roles
        let distributedSoFar = 0
        otherActiveRoles.forEach((r, index) => {
          if (index === otherActiveRoles.length - 1) {
            // Last role gets whatever is left to avoid rounding errors
            player.preferences[r] = remaining - distributedSoFar
          } else {
            const proportion = (player.preferences[r] || 0) / othersTotal
            const newAmount = Math.round(remaining * proportion)
            player.preferences[r] = newAmount
            distributedSoFar += newAmount
          }
        })
      }
    }
    
    // Ensure inactive roles stay at 0
    Object.keys(player.preferences).forEach(r => {
      if (!activeRoles.includes(r)) {
        player.preferences[r] = 0
      }
    })
    
    setPlayers(newPlayers)
  }

  const toggleGearBox = (playerIndex) => {
    setExpandedGearBoxes(prev => ({
      ...prev,
      [playerIndex]: !prev[playerIndex]
    }))
  }

  const resetRotation = () => {
    const newPlayers = players.map(player => ({
      ...player,
      usedRoles: []
    }))
    setPlayers(newPlayers)
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

  // Weighted role selection based on preferences and rotation mode
  const selectRoleForPlayer = (player, neededRoles) => {
    let availableRoles = player.roles.filter(role => neededRoles.includes(role))
    
    // In rotation mode, exclude already used roles
    if (rotationMode) {
      const usedRoles = player.usedRoles || []
      const unusedRoles = availableRoles.filter(role => !usedRoles.includes(role))
      
      // If there are unused roles, use those
      if (unusedRoles.length > 0) {
        availableRoles = unusedRoles
      } else {
        // If all roles have been used, check if ALL player's roles have been exhausted
        const allRolesUsed = player.roles.every(playerRole => usedRoles.includes(playerRole))
        
        if (allRolesUsed) {
          // Reset cycle - player can play any of their roles again
          availableRoles = player.roles.filter(role => neededRoles.includes(role))
        } else {
          // Still have unused roles for other positions, but none for this needed role
          return null
        }
      }
    }
    
    if (availableRoles.length === 0) return null
    if (availableRoles.length === 1) return availableRoles[0]
    
    // Weighted selection based on preferences
    const preferences = player.preferences || {}
    const weights = availableRoles.map(role => Math.max(preferences[role] || 1, 1)) // Minimum weight of 1
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
    
    if (totalWeight === 0) {
      // If no preferences set, choose randomly
      return availableRoles[Math.floor(Math.random() * availableRoles.length)]
    }
    
    // Weighted random selection
    let random = Math.random() * totalWeight
    for (let i = 0; i < availableRoles.length; i++) {
      random -= weights[i]
      if (random <= 0) {
        return availableRoles[i]
      }
    }
    
    return availableRoles[0] // Fallback
  }

  const createGroups = () => {
    // Validate: each player must have at least one role
    const invalidPlayers = players.filter(player => !player.roles || player.roles.length === 0)
    if (invalidPlayers.length > 0) {
      alert(`Please select at least one role for: ${invalidPlayers.map(p => p.name).join(', ')}`)
      return
    }

    // Show loading animation
    setIsLoading(true)
    
    // Use setTimeout to create a slight delay for the animation
    setTimeout(() => {
      // Create a working copy of players
      const playerPool = [...players]
      
      // Analyze the players and determine optimal number of groups
      const finalGroups = generateOptimalGroups(playerPool)
      
      // Set the final groups
      setGroups(finalGroups)
      
      // Hide loading animation
      setIsLoading(false)
    }, 1500)
  }

  const generateOptimalGroups = (playerPool) => {
    // Shuffle the player pool to add randomness and prevent same assignments
    const shuffledPlayerPool = [...playerPool].sort(() => Math.random() - 0.5)
    
    // Calculate how many groups we need based on player count
    const totalPlayers = shuffledPlayerPool.length
    
    // Calculate the ideal number of groups based on player count
    let idealGroups = Math.ceil(totalPlayers / 5)
    
    // If we have 6 or more players, we should create at least 2 groups
    if (totalPlayers >= 6) {
      idealGroups = Math.max(2, idealGroups)
    }
    
    const numGroups = idealGroups
    
    // Initialize the groups
    const groups = Array(numGroups).fill().map(() => [])
    
    // Track assigned players
    const assignedPlayers = new Set()
    const newUsedRoles = {}
    
    // Initialize used roles tracking for rotation mode
    shuffledPlayerPool.forEach(player => {
      newUsedRoles[player.name] = [...(player.usedRoles || [])]
    })

    // Helper function to assign player to group with role
    const assignPlayerToGroup = (player, groupIndex, role) => {
      groups[groupIndex].push({...player, assignedRole: role})
      assignedPlayers.add(player.name)
      if (rotationMode && !newUsedRoles[player.name].includes(role)) {
        newUsedRoles[player.name].push(role)
      }
    }

    // Helper function to get available players for a role
    const getAvailablePlayersForRole = (role) => {
      return shuffledPlayerPool.filter(p => {
        // Must not be already assigned
        if (assignedPlayers.has(p.name)) return false
        
        // Must have the role
        if (!p.roles.includes(role)) return false
        
        // In rotation mode, check if role has been used
        if (rotationMode) {
          const usedRoles = p.usedRoles || []
          // If this role hasn't been used, they can play it
          if (!usedRoles.includes(role)) return true
          
          // If this role HAS been used, check if ALL their roles have been used
          const allRolesUsed = p.roles.every(playerRole => usedRoles.includes(playerRole))
          
          // If all roles have been used, reset and allow any role
          if (allRolesUsed) {
            // Reset this player's used roles for the next cycle
            newUsedRoles[p.name] = []
            return true
          }
          
          // Otherwise, they can't play this role yet
          return false
        }
        
        return true
      })
    }

    // Helper function to select a player based on weighted preferences
    const selectPlayerByPreference = (availablePlayers, role) => {
      if (availablePlayers.length === 0) return null
      if (availablePlayers.length === 1) return availablePlayers[0]
      
      // Create weights based on preferences
      const weights = availablePlayers.map(player => {
        const preference = player.preferences?.[role] || 0
        // If preference is 0, give a small base weight so they can still be selected
        return Math.max(preference, 5) // Minimum weight of 5 for fairness
      })
      
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
      
      // Weighted random selection
      let random = Math.random() * totalWeight
      for (let i = 0; i < availablePlayers.length; i++) {
        random -= weights[i]
        if (random <= 0) {
          return availablePlayers[i]
        }
      }
      
      return availablePlayers[0] // Fallback
    }

    // Phase 1: Assign required roles (Tank and Healer) to each group
    // First pass: Try to assign tanks and healers optimally
    for (let groupIndex = 0; groupIndex < numGroups; groupIndex++) {
      // Assign Tank using weighted selection
      const availableTanks = getAvailablePlayersForRole("Tank")
      
      if (availableTanks.length > 0) {
        const selectedTank = selectPlayerByPreference(availableTanks, "Tank")
        if (selectedTank) {
          assignPlayerToGroup(selectedTank, groupIndex, "Tank")
        }
      }

      // Assign Healer using weighted selection
      const availableHealers = getAvailablePlayersForRole("Healer")
      
      if (availableHealers.length > 0) {
        const selectedHealer = selectPlayerByPreference(availableHealers, "Healer")
        if (selectedHealer) {
          assignPlayerToGroup(selectedHealer, groupIndex, "Healer")
        }
      }
    }

    // Second pass: Fill any missing tanks or healers by reassigning flexible players
    for (let groupIndex = 0; groupIndex < numGroups; groupIndex++) {
      const currentGroup = groups[groupIndex]
      const hasTank = currentGroup.some(p => p.assignedRole === "Tank")
      const hasHealer = currentGroup.some(p => p.assignedRole === "Healer")
      
      // If missing tank, try to find flexible players who can tank
      if (!hasTank) {
        const flexTanks = getAvailablePlayersForRole("Tank")
        
        if (flexTanks.length > 0) {
          const selectedTank = selectPlayerByPreference(flexTanks, "Tank")
          if (selectedTank) {
            assignPlayerToGroup(selectedTank, groupIndex, "Tank")
          }
        }
      }
      
      // If missing healer, try to find flexible players who can heal
      if (!hasHealer) {
        const flexHealers = getAvailablePlayersForRole("Healer")
        
        if (flexHealers.length > 0) {
          const selectedHealer = selectPlayerByPreference(flexHealers, "Healer")
          if (selectedHealer) {
            assignPlayerToGroup(selectedHealer, groupIndex, "Healer")
          }
        }
      }
    }

    // Phase 2: Assign Support (optional, only if available and composition allows)
    for (let groupIndex = 0; groupIndex < numGroups; groupIndex++) {
      const currentGroup = groups[groupIndex]
      const hasTank = currentGroup.some(p => p.assignedRole === "Tank")
      const hasHealer = currentGroup.some(p => p.assignedRole === "Healer")
      
      // Only add support if we have the required tank and healer
      if (hasTank && hasHealer) {
        const availableSupports = getAvailablePlayersForRole("Support")
        
        if (availableSupports.length > 0) {
          const selectedSupport = selectPlayerByPreference(availableSupports, "Support")
          if (selectedSupport) {
            assignPlayerToGroup(selectedSupport, groupIndex, "Support")
          }
        }
      }
    }

    // Phase 3: Fill remaining slots with DPS
    const remainingPlayers = shuffledPlayerPool.filter(p => !assignedPlayers.has(p.name))
    
    // Sort remaining players to prioritize those with fewer role options
    remainingPlayers.sort((a, b) => {
      const aRoleCount = a.roles ? a.roles.length : 0
      const bRoleCount = b.roles ? b.roles.length : 0
      return aRoleCount - bRoleCount // Players with fewer roles get assigned first
    })
    
    remainingPlayers.forEach((player) => {
      let targetGroupIdx
      
      if (groupMode === "even") {
        // Find the group with the fewest players
        const groupSizes = groups.map(g => g.length)
        const minSize = Math.min(...groupSizes)
        const targetGroups = groups
          .map((group, idx) => ({ group, idx }))
          .filter(g => g.group.length === minSize)
        
        // Randomly choose one of the smallest groups
        const randomIndex = Math.floor(Math.random() * targetGroups.length)
        targetGroupIdx = targetGroups[randomIndex].idx
      } else {
        // Random distribution
        targetGroupIdx = Math.floor(Math.random() * numGroups)
      }
      
      // Determine the best role for this player
      const possibleRoles = ["DPS"] // Default to DPS
      const selectedRole = selectRoleForPlayer(player, possibleRoles) || "DPS"
      assignPlayerToGroup(player, targetGroupIdx, selectedRole)
    })

    // Phase 4: Fill missing roles with PUGs and balance compositions
    groups.forEach(group => {
      const hasTank = group.some(p => p.assignedRole === "Tank")
      const hasHealer = group.some(p => p.assignedRole === "Healer")
      const hasSupport = group.some(p => p.assignedRole === "Support")
      const dpsCount = group.filter(p => p.assignedRole === "DPS").length
      
      // Add tank if missing (required)
      if (!hasTank) {
        group.push(getRandomPUG("Tank"))
      }
      
      // Add healer if missing (required)
      if (!hasHealer) {
        group.push(getRandomPUG("Healer"))
      }
      
      // Determine target composition
      let targetDpsCount = 3 // Default: 3 DPS, 1 Tank, 1 Healer
      if (hasSupport) {
        targetDpsCount = 2 // With support: 2 DPS, 1 Support, 1 Tank, 1 Healer
      }
      
      // Fill up to target DPS count
      for (let i = dpsCount; i < targetDpsCount; i++) {
        group.push(getRandomPUG("DPS"))
      }
    })

    // Update player used roles if in rotation mode
    if (rotationMode) {
      const updatedPlayers = players.map(player => ({
        ...player,
        usedRoles: newUsedRoles[player.name] || player.usedRoles
      }))
      setPlayers(updatedPlayers)
    }
    
    return groups
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Inter', 'Segoe UI', sans-serif;
          background-color: #242424;
          color: rgba(255, 255, 255, 0.87);
          line-height: 1.5;
        }

        .app-header {
          margin-bottom: 2rem;
          position: relative;
          display: flex;
          justify-content: center;
          padding: 1rem 0;
        }

        .title {
          font-size: 3rem;
          font-weight: 800;
          position: relative;
          padding: 0.5rem 1.5rem;
          text-align: center;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(35, 39, 60, 0.8), rgba(30, 34, 52, 0.9));
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), 
                      0 10px 30px rgba(40, 57, 122, 0.2);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          z-index: 1;
        }

        .title-thursday {
          background: linear-gradient(to bottom, #ffffff, #a5a7dd);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 2px 10px rgba(116, 124, 207, 0.3);
          margin-right: 0.3rem;
        }

        .title-plus {
          background: linear-gradient(to bottom, #8e6fff, #4f34c3);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-size: 3.5rem;
          font-weight: 900;
          text-shadow: 0 0 20px rgba(142, 111, 255, 0.7);
          position: relative;
        }

        .title-plus::after {
          content: '';
          position: absolute;
          bottom: 0.2rem;
          left: -0.2rem;
          right: -0.2rem;
          height: 3px;
          background: linear-gradient(90deg, transparent, #8e6fff, transparent);
          border-radius: 3px;
          opacity: 0.7;
        }

        .title-glow {
          position: absolute;
          width: 120%;
          height: 120%;
          background: radial-gradient(circle, rgba(96, 108, 255, 0.1) 0%, rgba(30, 34, 52, 0) 70%);
          top: -10%;
          left: -10%;
          pointer-events: none;
          z-index: -1;
          animation: pulse 3s infinite;
        }

        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }

        h2 {
          margin-bottom: 0.8rem;
          color: #61dafb;
          font-size: 1.25rem;
        }

        .content-container {
          display: flex;
          flex-direction: row;
          gap: 2rem;
          margin: 2rem auto;
          min-height: 70vh;
          width: 1500px;
        }

        .input-container {
          flex: 2;
          display: flex;
          flex-direction: column;
          background-color: #1a1a1a;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: left;
          max-height: 70vh;
          overflow-y: auto;
        }

        .output-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: #1a1a1a;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: left;
          max-height: 70vh;
          overflow-y: auto;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .reset-rotation-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(142, 111, 255, 0.2);
          border: 1px solid #8e6fff;
          color: #8e6fff;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
        }

        .reset-rotation-btn:hover {
          background: rgba(142, 111, 255, 0.3);
          transform: translateY(-1px);
        }

        .player-input-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem;
          margin-bottom: 0.6rem;
          background-color: #2a2a2a;
          border-radius: 4px;
          position: relative;
          cursor: grab;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .player-input-container li {
          list-style: none;
          min-width: 90px;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .player-input-container.dragging {
          opacity: 0.5;
          transform: scale(0.98);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
        }

        .used-roles {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-left: 0.75rem;
        }

        .used-roles-text {
          font-size: 0.75rem;
          color: #888;
        }

        .used-role-icon {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          opacity: 0.6;
          border: 2px solid #8e6fff;
        }

        input[type="checkbox"] {
          accent-color: #8e6fff;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .role-option {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-right: 0.75rem;
        }

        .role-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .gear-toggle {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          background: rgba(142, 111, 255, 0.1);
          border: 1px solid rgba(142, 111, 255, 0.3);
          color: #8e6fff;
          padding: 0.4rem 0.6rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s;
          margin-left: auto;
        }

        .gear-toggle:hover {
          background: rgba(142, 111, 255, 0.2);
        }

        .gear-box {
          background: rgba(30, 30, 30, 0.95);
          border: 1px solid #444;
          border-radius: 6px;
          padding: 0.75rem;
          margin: 0.4rem 0 0.8rem 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          max-height: 400px;
          overflow: hidden;
          opacity: 1;
          transform: translateY(0);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gear-box h4 {
          color: #8e6fff;
          margin-bottom: 0.6rem;
          font-size: 0.9rem;
        }

        .preferences-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .preference-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(42, 42, 42, 0.7);
          padding: 0.5rem;
          border-radius: 4px;
        }

        .pref-role-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }

        .preference-item label {
          font-size: 0.85rem;
          min-width: 50px;
          color: #ccc;
        }

        .preference-input {
          width: 50px;
          padding: 0.2rem 0.4rem;
          background: #333;
          border: 1px solid #555;
          border-radius: 3px;
          color: #fff;
          font-size: 0.85rem;
          text-align: center;
        }

        .preference-note {
          font-size: 0.8rem;
          color: #888;
          font-style: italic;
          text-align: center;
        }

        .drag-handle {
          display: flex;
          align-items: center;
          padding-right: 10px;
          color: #777;
          cursor: grab;
        }

        .drag-icon {
          font-size: 1.2rem;
          user-select: none;
        }

        .new-player {
          display: flex;
          align-items: center;
          border: 2px dashed #444;
          background-color: rgba(42, 42, 42, 0.5);
          transition: background-color 0.3s;
        }

        .new-player:hover {
          background-color: #2a2a2a;
        }

        .new-player-input {
          flex: 1;
          padding: 0.5rem;
          background-color: #333;
          border: 1px solid #444;
          border-radius: 4px;
          color: #fff;
          margin-right: 10px;
          font-size: 0.9rem;
        }

        .add-player-btn {
          background: linear-gradient(to bottom, #8e6fff, #4f34c3);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
        }

        .add-player-btn:hover {
          background: linear-gradient(to bottom, #9d80ff, #5e43d2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(79, 52, 195, 0.4);
        }

        .add-player-btn:active {
          transform: translateY(1px);
        }

        .player-output-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          margin-bottom: 0.75rem;
          background-color: #2a2a2a;
          border-radius: 4px;
          position: relative;
          background-blend-mode: overlay;
          transition: transform 0.2s;
        }

        .player-output-container:hover {
          transform: translateX(5px);
        }

        .player-output-container li {
          list-style: none;
        }

        .player-name {
          font-weight: 500;
        }

        .role-indicators {
          display: flex;
          align-items: center;
        }

        .role-output-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
        }

        .empty-state {
          text-align: center;
          color: #888;
          padding: 2rem;
          font-style: italic;
        }

        .delete-zone {
          position: fixed;
          bottom: -100px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 80px;
          background-color: #3a0000;
          border: 2px dashed #ff5252;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #ff5252;
          transition: bottom 0.3s ease-in-out;
          z-index: 1000;
        }

        .delete-zone.visible {
          bottom: 20px;
        }

        .delete-icon {
          font-size: 1.5rem;
          margin-bottom: 5px;
        }

        .ghost-element {
          position: absolute;
          top: -1000px;
          background-color: #2a2a2a;
          padding: 5px 10px;
          border-radius: 4px;
          color: white;
          opacity: 0.8;
        }

        .group-output {
          margin-bottom: 1.5rem;
        }

        .group-output h3 {
          margin-top: 0;
          margin-bottom: 0.75rem;
          color: #8e6fff;
          border-bottom: 1px solid #333;
          padding-bottom: 0.5rem;
        }

        .pug-player {
          background-color: rgba(42, 42, 42, 0.9);
          border-left: 3px solid #8e6fff;
        }

        .pug-badge {
          background-color: #8e6fff;
          color: #1a1a1a;
          font-size: 0.7rem;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 4px;
          margin-right: 8px;
        }

        .controls-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #1a1a1a;
          border-top: 1px solid #333;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1500px;
          margin: 0 auto;
        }

        .controls-left {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .mode-section h4 {
          color: #8e6fff;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .mode-options {
          display: flex;
          gap: 1rem;
        }

        .mode-bubble {
          display: flex;
          padding: 0.75rem 1.25rem;
          background-color: #2a2a2a;
          border-radius: 25px;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .mode-bubble.selected {
          border-color: #8e6fff;
          background-color: rgba(142, 111, 255, 0.1);
        }

        .mode-bubble input {
          display: none;
        }

        .bubble-text {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .rotation-section h4 {
          color: #8e6fff;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .rotation-toggle {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .toggle-slider {
          position: relative;
          width: 50px;
          height: 26px;
          background: #444;
          border-radius: 13px;
          transition: background-color 0.3s;
        }

        .toggle-slider::before {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 22px;
          height: 22px;
          background: white;
          border-radius: 50%;
          transition: transform 0.3s;
        }

        .rotation-toggle input[type="checkbox"] {
          display: none;
        }

        .rotation-toggle input[type="checkbox"]:checked + .toggle-slider {
          background: #8e6fff;
        }

        .rotation-toggle input[type="checkbox"]:checked + .toggle-slider::before {
          transform: translateX(24px);
        }

        .toggle-text {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .create-groups-btn {
          padding: 0.8rem 2rem;
          background: linear-gradient(to bottom, #8e6fff, #4f34c3);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .create-groups-btn:hover {
          background: linear-gradient(to bottom, #9d80ff, #5e43d2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(79, 52, 195, 0.4);
        }

        .create-groups-btn:active {
          transform: translateY(1px);
        }

        .create-groups-btn:disabled {
          background-color: #555;
          cursor: not-allowed;
          opacity: 0.7;
          transform: none;
          box-shadow: none;
        }

        .dice-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
        }

        .dice {
          position: relative;
          width: 100px;
          height: 100px;
          transform-style: preserve-3d;
          animation: rolling 2s linear infinite;
        }

        .dice-face {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          background: rgba(142, 111, 255, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.3);
        }

        .dot {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }

        .center { top: 42px; left: 42px; }
        .top-left { top: 16px; left: 16px; }
        .top-right { top: 16px; right: 16px; }
        .bottom-left { bottom: 16px; left: 16px; }
        .bottom-right { bottom: 16px; right: 16px; }
        .middle-left { top: 42px; left: 16px; }
        .middle-right { top: 42px; right: 16px; }

        .one { transform: translateZ(50px); }
        .two { transform: rotateY(180deg) translateZ(50px); }
        .three { transform: rotateY(90deg) translateZ(50px); }
        .four { transform: rotateY(-90deg) translateZ(50px); }
        .five { transform: rotateX(90deg) translateZ(50px); }
        .six { transform: rotateX(-90deg) translateZ(50px); }

        @keyframes rolling {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          25% { transform: rotateX(90deg) rotateY(180deg); }
          50% { transform: rotateX(180deg) rotateY(90deg); }
          75% { transform: rotateX(270deg) rotateY(270deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }

        .dice-text {
          margin-top: 20px;
          font-size: 18px;
          font-weight: 500;
          color: #8e6fff;
          animation: pulse-text 1.5s infinite;
        }

        @keyframes pulse-text {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      ` }} />
      
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
          <div className="section-header">
            <h2>Compadres</h2>
            {rotationMode && (
              <button 
                className="reset-rotation-btn"
                onClick={resetRotation}
                title="Reset role rotation for all players"
              >
                <RotateCcw size={16} />
                Reset Rotation
              </button>
            )}
          </div>
          
          {players.map((player, index) => (
            <PlayerRow
              key={index}
              player={player}
              index={index}
              rotationMode={rotationMode}
              expandedGearBoxes={expandedGearBoxes}
              draggedIndex={draggedIndex}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onRoleToggle={handleRoleToggle}
              onToggleGearBox={toggleGearBox}
              onPreferenceChange={handlePreferenceChange}
            />
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
          
          {isLoading ? (
            <DiceAnimation />
          ) : (
            <GroupDisplay groups={groups} />
          )}
        </div>
      </div>
      
      {/* Horizontal controls bar */}
      <div className="controls-bar">
        <div className="controls-left">
          <div className="mode-section">
            <h4>Distribution:</h4>
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
              </label>
              
              <label className={`mode-bubble ${groupMode === 'random' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="groupMode" 
                  value="random"
                  checked={groupMode === 'random'}
                  onChange={() => setGroupMode('random')}
                />
                <span className="bubble-text">Random</span>
              </label>
            </div>
          </div>

          <div className="rotation-section">
            <h4>Rotation:</h4>
            <label className="rotation-toggle">
              <input 
                type="checkbox"
                checked={rotationMode}
                onChange={(e) => setRotationMode(e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">Role Rotation</span>
            </label>
          </div>
        </div>
        
        <button 
          className="create-groups-btn"
          onClick={createGroups}
          disabled={players.length < 1 || isLoading}
        >
          {isLoading ? "Rolling..." : "Create Groups"}
        </button>
      </div>
    </>
  )
}

export default App