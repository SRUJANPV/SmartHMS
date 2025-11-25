import React from 'react'
import { ListItem, ListItemIcon, ListItemText, Collapse, List } from '@mui/material'
import {
  Dashboard,
  People,
  CalendarToday,
  Receipt,
  Inventory,
  Analytics,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const SidebarItems = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)

  const [open, setOpen] = React.useState(true)

  const handleClick = () => {
    setOpen(!open)
  }

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      roles: ['Admin', 'Doctor', 'Nurse', 'Staff', 'Patient']
    },
    {
      text: 'Patients',
      icon: <People />,
      path: '/patients',
      roles: ['Admin', 'Doctor', 'Staff']
    },
    {
      text: 'Appointments',
      icon: <CalendarToday />,
      path: '/appointments',
      roles: ['Admin', 'Doctor', 'Nurse', 'Staff', 'Patient']
    },
    {
      text: 'Billing',
      icon: <Receipt />,
      path: '/billing',
      roles: ['Admin', 'Staff']
    },
    {
      text: 'Inventory',
      icon: <Inventory />,
      path: '/inventory',
      roles: ['Admin', 'Staff']
    },
    {
      text: 'Analytics',
      icon: <Analytics />,
      path: '/analytics',
      roles: ['Admin', 'Doctor']
    }
  ]

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(user?.role?.name)
  )

  return (
    <List>
      {filteredMenuItems.map((item) => (
        <ListItem
          button
          key={item.text}
          onClick={() => navigate(item.path)}
          selected={location.pathname === item.path}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'white',
              '& .MuiListItemIcon-root': {
                color: 'white'
              }
            },
            '&.Mui-selected:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
        >
          <ListItemIcon
            sx={{
              color: location.pathname === item.path ? 'white' : 'inherit'
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  )
}

export default SidebarItems