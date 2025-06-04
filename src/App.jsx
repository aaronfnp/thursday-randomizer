import { useState } from 'react'
import { ChevronDown, ChevronUp, Settings, RotateCcw } from 'lucide-react'
import './App.css'

// Component: Hard Mode Slot Machine
const HardModeSlotMachine = ({ isVisible, onComplete }) => {
  const [currentSlots, setCurrentSlots] = useState([0, 0, 0])
  const [isSpinning, setIsSpinning] = useState(false)
  const [finalChallenge, setFinalChallenge] = useState(null)

  // Hard Mode Challenges
  const challenges = [
    {
      title: "Interrupt Olympics",
      description: "Most interrupts wins 100g from each player! Time to show off those reflexes.",
      emoji: "🛑",
      icon: "⛔"
    },
    {
      title: "Death Tax Collector",
      description: "Most deaths pays 50g to everyone else! Stay alive or pay up.",
      emoji: "💀",
      icon: "⚰️"
    },
    {
      title: "Compliment Your PUG",
      description: "Give your pug teammate genuine compliments all run! Spread the love.",
      emoji: "🤝",
      icon: "❤️"
    },
    {
      title: "Damage Meter Flask Fund",
      description: "Lowest overall DPS buys everyone flasks! No pressure...",
      emoji: "📊",
      icon: "🧪"
    },
    {
      title: "First to Fall Lottery",
      description: "First player to die owes 200g to the pot - survivors split it!",
      emoji: "🎰",
      icon: "💰"
    },
    {
      title: "Accidental Comedian",
      description: "Every time you mess up a mechanic, tell a dad joke in chat!",
      emoji: "🤡",
      icon: "😂"
    },
    {
      title: "DPS Ends in 4 Feast",
      description: "If your overall DPS ends with the number 4, you buy everyone a feast!",
      emoji: "4️⃣",
      icon: "🍖"
    },
    {
      title: "Dispel Derby",
      description: "If your dispells end in 7, you win! Other players pay 75g to the cleanse champion.",
      emoji: "✨",
      icon: "🧼"
    },
    {
      title: "Pet Battle Royale Prep",
      description: "Summon random battle pets between pulls! Most adorable pet wins hearts.",
      emoji: "🐾",
      icon: "🐕"
    },
    {
      title: "Transmog Fashion Show",
      description: "Rate each other's transmog 1-10! Lowest score buys winner a token.",
      emoji: "👗",
      icon: "✨"
    },
    {
      title: "Deaths End in 7 Penalty",
      description: "If your death count ends with 7, you owe everyone 100g each!",
      emoji: "7️⃣",
      icon: "💀"
    },
    {
      title: "HPS Ends in 9 Jackpot",
      description: "If healer's HPS ends with 9, everyone else owes them 50g!",
      emoji: "9️⃣",
      icon: "💚"
    },
    {
      title: "Helpful Tip Exchange",
      description: "Share your best M+ tip! Most helpful tip earns gold from grateful friends.",
      emoji: "💡",
      icon: "🧠"
    },
    {
      title: "Sexy Transmog Contest",
      description: "Everyone must transmog to look as sexy as possible! Vote for hottest look.",
      emoji: "💋",
      icon: "🔥"
    },
    {
      title: "Cute Transmog Contest",
      description: "Everyone must transmog to look adorable! Cutest outfit wins gold from others.",
      emoji: "🥰",
      icon: "😊"
    },
    {
      title: "Ugly Transmog Contest",
      description: "Everyone must transmog to look hideous! Most disgusting look wins the pot.",
      emoji: "🤮",
      icon: "👹"
    },
    {
      title: "Scary Transmog Contest",
      description: "Everyone must transmog to look terrifying! Spookiest outfit gets gold rewards.",
      emoji: "👻",
      icon: "😱"
    },
    {
      title: "Royal Transmog Contest",
      description: "Everyone must transmog to look like royalty! Most regal appearance wins tribute.",
      emoji: "👑",
      icon: "🏰"
    }
  ]

  const slotSymbols = challenges.map(c => c.icon)

  useState(() => {
    if (isVisible && !isSpinning) {
      setIsSpinning(true)
      
      // Spin animation
      const spinInterval = setInterval(() => {
        setCurrentSlots([
          Math.floor(Math.random() * slotSymbols.length),
          Math.floor(Math.random() * slotSymbols.length),
          Math.floor(Math.random() * slotSymbols.length)
        ])
      }, 100)

      // Stop spinning after 2 seconds and select final challenge
      setTimeout(() => {
        clearInterval(spinInterval)
        const selectedChallenge = challenges[Math.floor(Math.random() * challenges.length)]
        setFinalChallenge(selectedChallenge)
        setIsSpinning(false)
        
        // Show challenge immediately above groups
        onComplete(selectedChallenge)
        
        // Hide slot machine after a shorter delay
        setTimeout(() => {
          // Slot machine will hide when onComplete sets showHardModeSlots to false
        }, 800)
      }, 2000)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="hard-mode-overlay">
      <div className="slot-machine">
        <div className="slot-machine-header">
          <h3>🎰 HARD MODE ACTIVATED 🎰</h3>
          <p>Rolling for your challenge...</p>
        </div>
        
        <div className="slot-container">
          <div className="slot-reel">
            <div className="slot-symbol">{slotSymbols[currentSlots[0]]}</div>
          </div>
          <div className="slot-reel">
            <div className="slot-symbol">{slotSymbols[currentSlots[1]]}</div>
          </div>
          <div className="slot-reel">
            <div className="slot-symbol">{slotSymbols[currentSlots[2]]}</div>
          </div>
        </div>

        {finalChallenge && !isSpinning && (
          <div className="challenge-result">
            <div className="challenge-emoji">{finalChallenge.emoji}</div>
            <div className="challenge-title">{finalChallenge.title}</div>
            <div className="challenge-description">{finalChallenge.description}</div>
          </div>
        )}
        
        <div className="slot-machine-footer">
          {isSpinning ? "🎲 Rolling..." : finalChallenge ? "Challenge Assigned!" : "🎲 Rolling..."}
        </div>
      </div>
    </div>
  )
}

// Component: Hard Mode Challenge Display
const HardModeChallenge = ({ challenge }) => {
  if (!challenge) return null

  return (
    <div className="hard-mode-challenge">
      <div className="challenge-header">
        <span className="challenge-emoji">{challenge.emoji}</span>
        <h3>🎲 HARD MODE 🎲</h3>
      </div>
      <div className="challenge-content">
        <div className="challenge-title">{challenge.title}</div>
        <div className="challenge-description">{challenge.description}</div>
      </div>
    </div>
  )
}

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
        
        {/* Used roles indicator in rotation mode */}
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
const GroupDisplay = ({ groups, hardModeChallenge }) => {
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
      {/* Hard Mode Challenge Display */}
      <HardModeChallenge challenge={hardModeChallenge} />
      
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

// Component: Loading dice animation with hard mode
const DiceAnimation = ({ showHardMode, onHardModeComplete }) => {
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
      
      {/* Hard Mode Slot Machine Overlay */}
      <HardModeSlotMachine 
        isVisible={showHardMode}
        onComplete={onHardModeComplete}
      />
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
  const [hardModeEnabled, setHardModeEnabled] = useState(false)
  const [showHardModeSlots, setShowHardModeSlots] = useState(false)
  const [currentHardModeChallenge, setCurrentHardModeChallenge] = useState(null)

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
        const newExpanded = {...expandedGearBoxes}
        delete newExpanded[draggedIndex]
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
      newPlayers[playerIndex].roles = playerRoles.filter(r => r !== role)
      newPlayers[playerIndex].preferences[role] = 0
    } else {
      newPlayers[playerIndex].roles = [...playerRoles, role]
      const currentRoles = [...playerRoles, role]
      const defaultPref = Math.floor(100 / currentRoles.length)
      newPlayers[playerIndex].preferences[role] = defaultPref
    }
    
    normalizePreferences(newPlayers[playerIndex])
    setPlayers(newPlayers)
  }

  const handlePreferenceChange = (playerIndex, role, value) => {
    const newPlayers = [...players]
    const player = newPlayers[playerIndex]
    const numValue = Math.max(0, Math.min(100, parseInt(value) || 0))
    
    const activeRoles = player.roles || []
    const otherActiveRoles = activeRoles.filter(r => r !== role)
    
    player.preferences[role] = numValue
    
    const remaining = 100 - numValue
    
    if (remaining <= 0) {
      otherActiveRoles.forEach(r => player.preferences[r] = 0)
    } else if (otherActiveRoles.length > 0) {
      const othersTotal = otherActiveRoles.reduce((sum, r) => sum + (player.preferences[r] || 0), 0)
      
      if (othersTotal === 0) {
        const equalShare = Math.floor(remaining / otherActiveRoles.length)
        const remainder = remaining % otherActiveRoles.length
        otherActiveRoles.forEach((r, index) => {
          player.preferences[r] = equalShare + (index < remainder ? 1 : 0)
        })
      } else {
        let distributedSoFar = 0
        otherActiveRoles.forEach((r, index) => {
          if (index === otherActiveRoles.length - 1) {
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

  const getRandomPUG = (role) => {
    const randomName = pugNames[Math.floor(Math.random() * pugNames.length)]
    return {
      name: randomName,
      assignedRole: role,
      isPug: true,
      roles: [role]
    }
  }

  const selectRoleForPlayer = (player, neededRoles) => {
    let availableRoles = player.roles.filter(role => neededRoles.includes(role))
    
    if (rotationMode) {
      const usedRoles = player.usedRoles || []
      const unusedRoles = availableRoles.filter(role => !usedRoles.includes(role))
      
      if (unusedRoles.length > 0) {
        availableRoles = unusedRoles
      } else {
        const allRolesUsed = player.roles.every(playerRole => usedRoles.includes(playerRole))
        
        if (allRolesUsed) {
          availableRoles = player.roles.filter(role => neededRoles.includes(role))
        } else {
          return null
        }
      }
    }
    
    if (availableRoles.length === 0) return null
    if (availableRoles.length === 1) return availableRoles[0]
    
    const preferences = player.preferences || {}
    const weights = availableRoles.map(role => Math.max(preferences[role] || 1, 1))
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
    
    if (totalWeight === 0) {
      return availableRoles[Math.floor(Math.random() * availableRoles.length)]
    }
    
    let random = Math.random() * totalWeight
    for (let i = 0; i < availableRoles.length; i++) {
      random -= weights[i]
      if (random <= 0) {
        return availableRoles[i]
      }
    }
    
    return availableRoles[0]
  }

  const handleHardModeComplete = (challenge) => {
    setShowHardModeSlots(false)
    setCurrentHardModeChallenge(challenge)
  }

  const createGroups = () => {
    const invalidPlayers = players.filter(player => !player.roles || player.roles.length === 0)
    if (invalidPlayers.length > 0) {
      alert(`Please select at least one role for: ${invalidPlayers.map(p => p.name).join(', ')}`)
      return
    }

    setIsLoading(true)
    setCurrentHardModeChallenge(null)
    
    // Show hard mode slots if enabled
    if (hardModeEnabled) {
      setTimeout(() => {
        setShowHardModeSlots(true)
      }, 800)
    }
    
    setTimeout(() => {
      const playerPool = [...players]
      const finalGroups = generateOptimalGroups(playerPool)
      setGroups(finalGroups)
      setIsLoading(false)
    }, 1500)
  }

  const generateOptimalGroups = (playerPool) => {
    const shuffledPlayerPool = [...playerPool].sort(() => Math.random() - 0.5)
    
    const totalPlayers = shuffledPlayerPool.length
    
    let idealGroups = Math.ceil(totalPlayers / 5)
    
    if (totalPlayers >= 6) {
      idealGroups = Math.max(2, idealGroups)
    }
    
    const numGroups = idealGroups
    
    const groups = Array(numGroups).fill().map(() => [])
    
    const assignedPlayers = new Set()
    const newUsedRoles = {}
    
    shuffledPlayerPool.forEach(player => {
      newUsedRoles[player.name] = [...(player.usedRoles || [])]
    })

    const assignPlayerToGroup = (player, groupIndex, role) => {
      groups[groupIndex].push({...player, assignedRole: role})
      assignedPlayers.add(player.name)
      if (rotationMode && !newUsedRoles[player.name].includes(role)) {
        newUsedRoles[player.name].push(role)
      }
    }

    const getAvailablePlayersForRole = (role) => {
      return shuffledPlayerPool.filter(p => {
        if (assignedPlayers.has(p.name)) return false
        
        if (!p.roles.includes(role)) return false
        
        if (rotationMode) {
          const usedRoles = p.usedRoles || []
          if (!usedRoles.includes(role)) return true
          
          const allRolesUsed = p.roles.every(playerRole => usedRoles.includes(playerRole))
          
          if (allRolesUsed) {
            newUsedRoles[p.name] = []
            return true
          }
          
          return false
        }
        
        return true
      })
    }

    const selectPlayerByPreference = (availablePlayers, role) => {
      if (availablePlayers.length === 0) return null
      if (availablePlayers.length === 1) return availablePlayers[0]
      
      const weights = availablePlayers.map(player => {
        const preference = player.preferences?.[role] || 0
        return Math.max(preference, 5)
      })
      
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
      
      let random = Math.random() * totalWeight
      for (let i = 0; i < availablePlayers.length; i++) {
        random -= weights[i]
        if (random <= 0) {
          return availablePlayers[i]
        }
      }
      
      return availablePlayers[0]
    }

    // Phase 1: Assign required roles (Tank and Healer) to each group
    for (let groupIndex = 0; groupIndex < numGroups; groupIndex++) {
      const availableTanks = getAvailablePlayersForRole("Tank")
      
      if (availableTanks.length > 0) {
        const selectedTank = selectPlayerByPreference(availableTanks, "Tank")
        if (selectedTank) {
          assignPlayerToGroup(selectedTank, groupIndex, "Tank")
        }
      }

      const availableHealers = getAvailablePlayersForRole("Healer")
      
      if (availableHealers.length > 0) {
        const selectedHealer = selectPlayerByPreference(availableHealers, "Healer")
        if (selectedHealer) {
          assignPlayerToGroup(selectedHealer, groupIndex, "Healer")
        }
      }
    }

    // Phase 2: Fill any missing tanks or healers
    for (let groupIndex = 0; groupIndex < numGroups; groupIndex++) {
      const currentGroup = groups[groupIndex]
      const hasTank = currentGroup.some(p => p.assignedRole === "Tank")
      const hasHealer = currentGroup.some(p => p.assignedRole === "Healer")
      
      if (!hasTank) {
        const flexTanks = getAvailablePlayersForRole("Tank")
        
        if (flexTanks.length > 0) {
          const selectedTank = selectPlayerByPreference(flexTanks, "Tank")
          if (selectedTank) {
            assignPlayerToGroup(selectedTank, groupIndex, "Tank")
          }
        }
      }
      
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

    // Phase 3: Assign Support (optional)
    for (let groupIndex = 0; groupIndex < numGroups; groupIndex++) {
      const currentGroup = groups[groupIndex]
      const hasTank = currentGroup.some(p => p.assignedRole === "Tank")
      const hasHealer = currentGroup.some(p => p.assignedRole === "Healer")
      
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

    // Phase 4: Fill remaining slots with DPS
    const remainingPlayers = shuffledPlayerPool.filter(p => !assignedPlayers.has(p.name))
    
    remainingPlayers.sort((a, b) => {
      const aRoleCount = a.roles ? a.roles.length : 0
      const bRoleCount = b.roles ? b.roles.length : 0
      return aRoleCount - bRoleCount
    })
    
    remainingPlayers.forEach((player) => {
      let targetGroupIdx
      
      if (groupMode === "even") {
        const groupSizes = groups.map(g => g.length)
        const minSize = Math.min(...groupSizes)
        const targetGroups = groups
          .map((group, idx) => ({ group, idx }))
          .filter(g => g.group.length === minSize)
        
        const randomIndex = Math.floor(Math.random() * targetGroups.length)
        targetGroupIdx = targetGroups[randomIndex].idx
      } else {
        targetGroupIdx = Math.floor(Math.random() * numGroups)
      }
      
      const possibleRoles = ["DPS"]
      const selectedRole = selectRoleForPlayer(player, possibleRoles) || "DPS"
      assignPlayerToGroup(player, targetGroupIdx, selectedRole)
    })

    // Phase 5: Fill missing roles with PUGs and balance compositions
    groups.forEach(group => {
      const hasTank = group.some(p => p.assignedRole === "Tank")
      const hasHealer = group.some(p => p.assignedRole === "Healer")
      const hasSupport = group.some(p => p.assignedRole === "Support")
      const dpsCount = group.filter(p => p.assignedRole === "DPS").length
      
      if (!hasTank) {
        group.push(getRandomPUG("Tank"))
      }
      
      if (!hasHealer) {
        group.push(getRandomPUG("Healer"))
      }
      
      let targetDpsCount = 3
      if (hasSupport) {
        targetDpsCount = 2
      }
      
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
            <DiceAnimation 
              showHardMode={showHardModeSlots}
              onHardModeComplete={handleHardModeComplete}
            />
          ) : (
            <GroupDisplay 
              groups={groups} 
              hardModeChallenge={currentHardModeChallenge}
            />
          )}
        </div>
      </div>
      
      <div className="controls-bar">
        <div className="controls-content">
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

            <div className="hardmode-section">
              <h4>Hard Mode:</h4>
              <label className="rotation-toggle">
                <input 
                  type="checkbox"
                  checked={hardModeEnabled}
                  onChange={(e) => setHardModeEnabled(e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-text">🎰 Silly Challenges</span>
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
      </div>
    </>
  )
}

export default App