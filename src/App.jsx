import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronDown, ChevronUp, Settings, RotateCcw } from 'lucide-react'
import './App.css'

// Component: Particle Canvas Background
const ParticleBackground = () => {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const particlesRef = useRef([])
  const bgParticlesRef = useRef([])
  const mouseRef = useRef({ x: -1000, y: -1000, isActive: false })
  const frameIdRef = useRef(0)
  const sizeRef = useRef({ w: 0, h: 0 })

  const PARTICLE_DENSITY = 0.00015
  const BG_PARTICLE_DENSITY = 0.00005
  const MOUSE_RADIUS = 180
  const RETURN_SPEED = 0.08
  const DAMPING = 0.90
  const REPULSION_STRENGTH = 1.2

  const randomRange = (min, max) => Math.random() * (max - min) + min

  const initParticles = useCallback((width, height) => {
    sizeRef.current = { w: width, h: height }
    const particleCount = Math.floor(width * height * PARTICLE_DENSITY)
    const newParticles = []
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      newParticles.push({
        x, y, originX: x, originY: y, vx: 0, vy: 0,
        size: randomRange(1, 2.5),
        color: Math.random() > 0.9 ? '#8e6fff' : '#ffffff',
        angle: Math.random() * Math.PI * 2,
      })
    }
    particlesRef.current = newParticles

    const bgCount = Math.floor(width * height * BG_PARTICLE_DENSITY)
    const newBg = []
    for (let i = 0; i < bgCount; i++) {
      newBg.push({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
        size: randomRange(0.5, 1.5), alpha: randomRange(0.1, 0.4),
        phase: Math.random() * Math.PI * 2,
      })
    }
    bgParticlesRef.current = newBg
  }, [])

  const animate = useCallback((time) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { w, h } = sizeRef.current
    if (w === 0 || h === 0) { frameIdRef.current = requestAnimationFrame(animate); return }

    ctx.clearRect(0, 0, w, h)

    // Pulsating radial glow
    const cx = w / 2, cy = h / 2
    const pulseOpacity = Math.sin(time * 0.0008) * 0.035 + 0.085
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7)
    gradient.addColorStop(0, `rgba(142, 111, 255, ${pulseOpacity})`)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)

    // Background particles (twinkling stars)
    const bgP = bgParticlesRef.current
    ctx.fillStyle = '#ffffff'
    for (let i = 0; i < bgP.length; i++) {
      const p = bgP[i]
      p.x += p.vx; p.y += p.vy
      if (p.x < 0) p.x = w
      if (p.x > w) p.x = 0
      if (p.y < 0) p.y = h
      if (p.y > h) p.y = 0
      const twinkle = Math.sin(time * 0.002 + p.phase) * 0.5 + 0.5
      ctx.globalAlpha = p.alpha * (0.3 + 0.7 * twinkle)
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1.0

    // Main particles - forces
    const particles = particlesRef.current
    const mouse = mouseRef.current
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const dx = mouse.x - p.x, dy = mouse.y - p.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (mouse.isActive && distance < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS * REPULSION_STRENGTH
        p.vx -= (dx / distance) * force * 5
        p.vy -= (dy / distance) * force * 5
      }
      p.vx += (p.originX - p.x) * RETURN_SPEED
      p.vy += (p.originY - p.y) * RETURN_SPEED
    }

    // Integration & drawing
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      p.vx *= DAMPING; p.vy *= DAMPING
      p.x += p.vx; p.y += p.vy
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      const velocity = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
      const opacity = Math.min(0.3 + velocity * 0.1, 1)
      ctx.fillStyle = p.color === '#ffffff'
        ? `rgba(255, 255, 255, ${opacity})`
        : p.color
      ctx.fill()
    }

    frameIdRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1
        canvasRef.current.width = width * dpr
        canvasRef.current.height = height * dpr
        canvasRef.current.style.width = `${width}px`
        canvasRef.current.style.height = `${height}px`
        const ctx = canvasRef.current.getContext('2d')
        if (ctx) ctx.scale(dpr, dpr)
        initParticles(width, height)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [initParticles])

  useEffect(() => {
    frameIdRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameIdRef.current)
  }, [animate])

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, isActive: true }
  }

  const handleMouseLeave = () => {
    mouseRef.current.isActive = false
  }

  return (
    <div
      ref={containerRef}
      className="particle-canvas-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} className="particle-canvas" />
    </div>
  )
}

// Component: Welcome Modal
const WelcomeModal = ({ onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideWelcomeModal', 'true')
    }
    onClose()
  }

  return (
    <div className="welcome-overlay">
      <ParticleBackground />
      <div className="welcome-content">
        <div className="welcome-modal" onClick={(e) => e.stopPropagation()}>
          <p className="welcome-thursday">Thursday</p>
          <p className="welcome-text">Welcomes You To</p>
          <img
            src="https://blz-contentstack-images.akamaized.net/v3/assets/blt3452e3b114fab0cd/blt8d3cecf84f200ed6/68a4ed936a17f5492299906f/midnight-logo-1.png"
            alt="World of Warcraft: Midnight"
            className="welcome-banner"
          />
          <div className="welcome-footer">
            <label className="welcome-checkbox-label">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
              <span>Don't show this again</span>
            </label>
            <button className="welcome-enter-btn" onClick={handleClose}>
              Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Generate a random poll for a group using actual player names
const generatePollForGroup = (group) => {
  const playerNames = group.filter(p => !p.isPug).map(p => p.name)
  const allNames = group.map(p => p.name)

  const pollTemplates = [
    {
      question: "Total wipes?",
      options: ["0", "1-2", "3+", "We're not finishing"],
      emoji: "💥"
    },
    {
      question: "Total deaths?",
      options: ["Under 5", "5-10", "10-15", "15+"],
      emoji: "💀"
    },
    {
      question: "Most interrupts?",
      options: allNames,
      emoji: "🛑"
    },
    {
      question: "Most deaths?",
      options: allNames,
      emoji: "⚰️"
    },
    {
      question: "Completion time?",
      options: ["Under 25 min", "25-30 min", "30-35 min", "35+ min"],
      emoji: "⏱️"
    },
    {
      question: "Time the key?",
      options: ["+3", "+2", "+1", "Depleted"],
      emoji: "🔑"
    },
    {
      question: "First to die?",
      options: allNames,
      emoji: "☠️"
    },
    {
      question: "Top DPS?",
      options: allNames,
      emoji: "⚔️"
    },
    {
      question: "Who pulls an extra pack?",
      options: [...playerNames, "Nobody", "The PUG"],
      emoji: "🏃"
    },
    {
      question: "Bloodlust on the right pull?",
      options: ["Perfect every time", "At least one misfire", "Total chaos"],
      emoji: "🩸"
    },
  ]

  return pollTemplates[Math.floor(Math.random() * pollTemplates.length)]
}

// Component: Poll Display (single poll per group)
const GroupPoll = ({ poll }) => {
  const [selected, setSelected] = useState(null)

  if (!poll) return null

  return (
    <div className="poll-card">
      <div className="poll-question">
        <span className="poll-emoji">{poll.emoji}</span>
        <span>{poll.question}</span>
      </div>
      <div className="poll-options">
        {poll.options.map((option) => (
          <button
            key={option}
            className={`poll-option ${selected === option ? 'poll-option-selected' : ''}`}
            onClick={() => setSelected(option)}
          >
            {option}
          </button>
        ))}
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
      img: "https://wow.zamimg.com/images/wow/icons/large/classicon_evoker_augmentation.jpg"
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
      img: "https://wow.zamimg.com/images/wow/icons/large/classicon_evoker_augmentation.jpg"
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

// Component: Group display with animated reveal
const GroupDisplay = ({ groups, polls, revealedCount }) => {
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
        img: "https://wow.zamimg.com/images/wow/icons/large/classicon_evoker_augmentation.jpg"
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

  // Flatten groups to figure out which player index we're at globally
  let globalIndex = 0

  return (
    <>
      {groups.map((group, groupIndex) => (
        <div className='group-output' key={groupIndex}>
          <h3>Group {groupIndex + 1} ({group.filter(p => !p.isPug).length} players)</h3>
          {polls && polls[groupIndex] && <GroupPoll poll={polls[groupIndex]} />}
          {group.map((player, playerIndex) => {
            const thisIndex = globalIndex++
            const isRevealed = thisIndex < revealedCount
            return (
              <div
                className={`player-output-container ${player.isPug ? 'pug-player' : ''} ${isRevealed ? 'player-revealed' : 'player-hidden'}`}
                key={playerIndex}
                style={{
                  backgroundImage: player.assignedRole ?
                    `linear-gradient(rgba(26, 26, 26, 0.8), rgba(26, 26, 26, 0.8)), url(${getRoleIcon(player.assignedRole)})` :
                    'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  animationDelay: `${thisIndex * 0.15}s`
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
            )
          })}
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
  ])

  // Locked players - not eligible for group creation
  const benchedPlayers = [
    { name: "David", reason: "Not Even 90" }
  ]
  const [newPlayerName, setNewPlayerName] = useState("")
  const [groups, setGroups] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [groupMode, setGroupMode] = useState("even")
  const [isLoading, setIsLoading] = useState(false)
  const [rotationMode, setRotationMode] = useState(false)
  const [expandedGearBoxes, setExpandedGearBoxes] = useState({})
  const [pollsEnabled, setPollsEnabled] = useState(false)
  const [activePolls, setActivePolls] = useState([])
  const [revealedCount, setRevealedCount] = useState(0)
  const [showWelcome, setShowWelcome] = useState(() => {
    return localStorage.getItem('hideWelcomeModal') !== 'true'
  })

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

  const createGroups = () => {
    const invalidPlayers = players.filter(player => !player.roles || player.roles.length === 0)
    if (invalidPlayers.length > 0) {
      alert(`Please select at least one role for: ${invalidPlayers.map(p => p.name).join(', ')}`)
      return
    }

    setIsLoading(true)
    setRevealedCount(0)

    setTimeout(() => {
      const playerPool = [...players]
      const finalGroups = generateOptimalGroups(playerPool)
      setGroups(finalGroups)

      // Generate 1 poll per group if enabled
      if (pollsEnabled) {
        const polls = finalGroups.map(group => generatePollForGroup(group))
        setActivePolls(polls)
      } else {
        setActivePolls([])
      }

      setIsLoading(false)

      // Animated reveal - reveal one player at a time
      const totalPlayers = finalGroups.reduce((sum, g) => sum + g.length, 0)
      let revealed = 0
      const revealInterval = setInterval(() => {
        revealed++
        setRevealedCount(revealed)
        if (revealed >= totalPlayers) {
          clearInterval(revealInterval)
        }
      }, 200)
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
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      <div className="app-bg-particles">
        <ParticleBackground />
      </div>
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

          {benchedPlayers.length > 0 && (
            <div className="benched-section">
              <h3 className="benched-header">Not Even 90</h3>
              {benchedPlayers.map((player, index) => (
                <div key={index} className="benched-player">
                  <span className="benched-lock">🔒</span>
                  <span className="benched-name">{player.name}</span>
                  <span className="benched-reason">{player.reason}</span>
                </div>
              ))}
            </div>
          )}

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
            <GroupDisplay
              groups={groups}
              polls={activePolls}
              revealedCount={revealedCount}
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
              <h4>Predictions:</h4>
              <label className="rotation-toggle">
                <input
                  type="checkbox"
                  checked={pollsEnabled}
                  onChange={(e) => setPollsEnabled(e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-text">Over/Under Polls</span>
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