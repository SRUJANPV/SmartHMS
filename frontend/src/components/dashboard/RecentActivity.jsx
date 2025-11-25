import React from 'react'
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material'

const RecentActivity = ({ items = [] }) => {
  const sample = items.length ? items : [
    { id: 1, title: 'Patient check-in: John Doe', time: '2m ago' },
    { id: 2, title: 'Added new inventory item: Syringe', time: '15m ago' },
    { id: 3, title: 'Billed: Jane Smith', time: '1h ago' }
  ]
  return (
    <List>
      {sample.map((activity) => (
        <ListItem key={activity.id}>
          <ListItemText
            primary={activity.title}
            secondary={<Typography variant="caption">{activity.time}</Typography>}
          />
        </ListItem>
      ))}
    </List>
  )
}

export default RecentActivity
