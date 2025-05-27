import { useState } from 'react'
import { ChevronDown, ChevronUp, Settings, RotateCcw } from 'lucide-react'
import './App.css'

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
        
        {/* Gear box toggle */}
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
    const numValue = parseInt(value) || 0
    newPlayers[playerIndex].preferences[role] = Math.max(0, Math.min(100, numValue))
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
      availableRoles = availableRoles.filter(role => !usedRoles.includes(role))
      
      // If all roles have been used, allow any role (reset cycle)
      if (availableRoles.length === 0) {
        availableRoles = player.roles.filter(role => neededRoles.includes(role))
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
        
        // In rotation mode, must not have used this role already
        if (rotationMode && (p.usedRoles || []).includes(role)) return false
        
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