import React from 'react'
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material'
import { TrendingUp, TrendingDown } from '@mui/icons-material'

const StatCard = ({ title, value, icon, color, change }) => {
  const isPositive = change?.startsWith('+')
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {change && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {isPositive ? (
                  <TrendingUp sx={{ color: 'success.main', mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ color: 'error.main', mr: 0.5 }} />
                )}
                <Typography
                  variant="body2"
                  sx={{ color: isPositive ? 'success.main' : 'error.main' }}
                >
                  {change} from last month
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              backgroundColor: color,
              height: 56,
              width: 56
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatCard