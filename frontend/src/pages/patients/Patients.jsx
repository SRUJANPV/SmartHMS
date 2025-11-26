import React, { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'

import PatientForm from './PatientForm'
import { getPatients, deletePatient } from '../../redux/slices/patientsSlice'

const Patients = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  
  const { patients, isLoading, pagination } = useSelector((state) => state.patients)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [openForm, setOpenForm] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState(null)

  useEffect(() => {
    dispatch(getPatients({ page: 1, limit: 10 }))
  }, [dispatch])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
    // Debounced search would be implemented here
  }

  const handleMenuOpen = (event, patient) => {
    setAnchorEl(event.currentTarget)
    setSelectedPatient(patient)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedPatient(null)
  }

  const handleView = () => {
    navigate(`/patients/${selectedPatient.id}`)
    handleMenuClose()
  }

  const handleEdit = () => {
    setOpenForm(true)
    handleMenuClose()
  }

  const handleDelete = () => {
    setPatientToDelete(selectedPatient)
    setDeleteDialog(true)
    handleMenuClose()
  }

  const confirmDelete = async () => {
    try {
      await dispatch(deletePatient(patientToDelete.id)).unwrap()
      enqueueSnackbar('Patient deleted successfully', { variant: 'success' })
      setDeleteDialog(false)
      setPatientToDelete(null)
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to delete patient', { variant: 'error' })
    }
  }

  const columns = [
    {
      field: 'patientId',
      headerName: 'Patient ID',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'fullName',
      headerName: 'Full Name',
      width: 200,
      valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 150
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'Male' ? 'primary' : 'secondary'}
          variant="outlined"
        />
      )
    },
    {
      field: 'bloodGroup',
      headerName: 'Blood Group',
      width: 120,
      renderCell: (params) => (
        params.value ? (
          <Chip
            label={params.value}
            size="small"
            color="error"
            variant="outlined"
          />
        ) : (
          <Typography variant="body2" color="textSecondary">
            Not set
          </Typography>
        )
      )
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, params.row)}
        >
          <MoreIcon />
        </IconButton>
      )
    }
  ]

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Patient Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Add Patient
        </Button>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search patients by name, ID, email, or phone..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="outlined">Filter</Button>
              <Button variant="outlined">Export</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Grid */}
      <Paper sx={{ width: '100%' }}>
        <DataGrid
          rows={patients}
          columns={columns}
          loading={isLoading}
          autoHeight
          pagination
          pageSize={pagination?.limit || 10}
          rowCount={pagination?.total || 0}
          rowsPerPageOptions={[10, 25, 50]}
          paginationMode="server"
          onPageChange={(page) => dispatch(getPatients({ page: page + 1, limit: pagination.limit }))}
          onPageSizeChange={(pageSize) => dispatch(getPatients({ page: 1, limit: pageSize }))}
          sx={{
            border: 0,
            '& .MuiDataGrid-cell:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        />
      </Paper>

      {/* Patient Form Dialog */}
      <Dialog
        open={openForm}
        onClose={() => {
          setOpenForm(false)
          setSelectedPatient(null)
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedPatient ? 'Edit Patient' : 'Add New Patient'}
        </DialogTitle>
        <DialogContent>
          <PatientForm
            patient={selectedPatient}
            onSuccess={() => {
              setOpenForm(false)
              setSelectedPatient(null)
              enqueueSnackbar(
                `Patient ${selectedPatient ? 'updated' : 'created'} successfully`,
                { variant: 'success' }
              )
            }}
            onCancel={() => {
              setOpenForm(false)
              setSelectedPatient(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete patient {patientToDelete?.firstName} {patientToDelete?.lastName}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Patients