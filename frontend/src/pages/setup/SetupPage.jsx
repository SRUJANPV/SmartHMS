import React, { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material'
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Storage as StorageIcon,
  Dns as DnsIcon
} from '@mui/icons-material'

const SetupPage = () => {
  const [backendStatus, setBackendStatus] = useState('unknown') // unknown, running, stopped
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    checkBackendStatus()
    const interval = setInterval(checkBackendStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      if (response.ok) {
        setBackendStatus('running')
      } else {
        setBackendStatus('stopped')
      }
    } catch (error) {
      setBackendStatus('stopped')
    }
  }

  const handleStartBackend = async () => {
    setLoading(true)
    setMessage('Starting backend server...')
    try {
      // This would normally call an API endpoint to start the backend
      // For now, just show instructions
      setMessage('Backend start requested. Please run: cd backend && npm run dev')
    } catch (error) {
      setMessage('Error starting backend: ' + error.message)
    }
    setLoading(false)
  }

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'running':
        return 'success'
      case 'stopped':
        return 'error'
      default:
        return 'warning'
    }
  }

  const getStatusIcon = () => {
    switch (backendStatus) {
      case 'running':
        return <CheckIcon />
      case 'stopped':
        return <CloseIcon />
      default:
        return <CircularProgress size={24} />
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          SmartHMS Setup
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Complete System Health Check & Configuration
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Backend Status Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DnsIcon sx={{ mr: 1, fontSize: 32 }} />
                <Typography variant="h6">Backend Server</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Status:
                </Typography>
                <Chip
                  icon={getStatusIcon()}
                  label={backendStatus === 'running' ? 'Running' : 'Stopped'}
                  color={getStatusColor()}
                  variant="outlined"
                />
              </Box>

              <Box sx={{ mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                  http://localhost:5000
                </Typography>
              </Box>

              {backendStatus === 'stopped' && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Backend is not running. Start it to use the application.
                </Alert>
              )}

              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>To start backend:</strong>
              </Typography>
              <Box sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block' }}>
                  cd backend
                </Typography>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block' }}>
                  npm run dev
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayIcon />}
                onClick={handleStartBackend}
                disabled={loading || backendStatus === 'running'}
                fullWidth
              >
                {loading ? 'Starting...' : 'Start Backend'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Database Status Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StorageIcon sx={{ mr: 1, fontSize: 32 }} />
                <Typography variant="h6">Database</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Type:
                </Typography>
                <Chip label="TiDB Cloud" color="primary" variant="outlined" />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Configuration:
                </Typography>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block' }}>
                  Host: gateway01.ap-southeast-1.prod.aws.tidbcloud.com
                </Typography>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block' }}>
                  Database: test
                </Typography>
              </Box>

              <Alert severity="info">
                Make sure backend is running to sync with database.
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Instructions Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Start Instructions
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  1. Start Backend Server
                </Typography>
                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block' }}>
                    cd backend
                  </Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block' }}>
                    npm run dev
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  2. Default Test Credentials
                </Typography>
                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block' }}>
                    Email: admin@hospital.com
                  </Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block' }}>
                    Password: password123
                  </Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block' }}>
                    Role: Admin
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  3. Access the Application
                </Typography>
                <Typography variant="body2">
                  Once backend is running, click Login to access the application.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {message && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
    </Container>
  )
}

export default SetupPage
