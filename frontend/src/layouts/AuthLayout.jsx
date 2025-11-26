import React from 'react'
import {
  Box,
  Container,
  Paper,
  Typography,
  useTheme
} from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  padding: theme.spacing(2)
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 400,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: theme.shadows[8],
  borderRadius: theme.shape.borderRadius * 2
}))

const AuthLayout = ({ children }) => {
  const theme = useTheme()

  return (
    <StyledContainer maxWidth="sm">
      <StyledPaper elevation={3}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              mb: 1
            }}
          >
            SmartHMS
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hospital Management System
          </Typography>
        </Box>
        {children}
      </StyledPaper>
    </StyledContainer>
  )
}

export default AuthLayout