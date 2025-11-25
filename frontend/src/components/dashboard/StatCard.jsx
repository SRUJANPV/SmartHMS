import React from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'

const StatCard = ({ title, value, icon, color, change }) => {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, bgcolor: color, color: '#fff', borderRadius: 1 }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h6">{value}</Typography>
          </Box>
        </Box>
        {change && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {change}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default StatCard
