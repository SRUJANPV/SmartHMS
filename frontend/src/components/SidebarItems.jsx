import React from 'react'
import { ListItemButton, ListItemIcon, ListItemText, List } from '@mui/material'
import {
  Dashboard,
  People,
  CalendarToday,
  Receipt,
  Inventory,
  Analytics
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const SidebarItems = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)

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
    <List sx={{ px: 1 }}>
      {filteredMenuItems.map((item) => (
        <ListItemButton
          key={item.text}
          onClick={() => navigate(item.path)}
          selected={location.pathname === item.path}
          sx={{
            mb: 0.5,
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'white',
              boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.3)',
              '& .MuiListItemIcon-root': {
                color: 'white'
              },
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            },
            '&:hover': {
              backgroundColor: 'action.hover',
              transform: 'translateX(4px)'
            },
            '&:not(.Mui-selected)': {
              '&:hover .MuiListItemIcon-root': {
                color: 'primary.main'
              }
            }
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: location.pathname === item.path ? 'white' : 'text.secondary',
              transition: 'color 0.2s ease'
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.text}
            primaryTypographyProps={{
              fontWeight: location.pathname === item.path ? 600 : 500,
              fontSize: '0.95rem'
            }}
          />
        </ListItemButton>
      ))}
    </List>
  )
}

export default SidebarItems