import React, { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  TextField,
  MenuItem
} from '@mui/material'
import {
  Add as AddIcon,
  Receipt as InvoiceIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'

import BillForm from './BillForm'
import { getBills, getBillingStats } from '../../redux/slices/billingSlice'

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`billing-tabpanel-${index}`}
    aria-labelledby={`billing-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
)

const Billing = () => {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  
  const { bills, stats, isLoading } = useSelector((state) => state.billing)
  
  const [tabValue, setTabValue] = useState(0)
  const [openForm, setOpenForm] = useState(false)
  const [selectedBill, setSelectedBill] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    dispatch(getBills())
    dispatch(getBillingStats())
  }, [dispatch])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const statusChips = {
    draft: { color: 'default', label: 'Draft' },
    generated: { color: 'primary', label: 'Generated' },
    sent: { color: 'info', label: 'Sent' },
    paid: { color: 'success', label: 'Paid' },
    overdue: { color: 'warning', label: 'Overdue' },
    cancelled: { color: 'error', label: 'Cancelled' }
  }

  const filteredBills = bills.filter(bill => 
    statusFilter === 'all' || bill.status === statusFilter
  )

  const columns = [
    {
      field: 'billNumber',
      headerName: 'Bill Number',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'patient',
      headerName: 'Patient',
      width: 200,
      valueGetter: (params) => 
        `${params.row.patient?.firstName} ${params.row.patient?.lastName}`
    },
    {
      field: 'billDate',
      headerName: 'Date',
      width: 120,
      valueGetter: (params) => dayjs(params.value).format('MMM D, YYYY')
    },
    {
      field: 'totalAmount',
      headerName: 'Amount',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          ${params.value}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={statusChips[params.value]?.label}
          color={statusChips[params.value]?.color}
          size="small"
        />
      )
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      width: 120,
      valueGetter: (params) => 
        params.value ? dayjs(params.value).format('MMM D, YYYY') : '-'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleViewBill(params.row)}
          >
            <ViewIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleEditBill(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDownloadInvoice(params.row.id)}
          >
            <DownloadIcon />
          </IconButton>
        </Box>
      )
    }
  ]

  const handleCreateBill = () => {
    setSelectedBill(null)
    setOpenForm(true)
  }

  const handleEditBill = (bill) => {
    setSelectedBill(bill)
    setOpenForm(true)
  }

  const handleViewBill = (bill) => {
    // Navigate to bill details page
    console.log('View bill:', bill)
  }

  const handleDownloadInvoice = async (billId) => {
    try {
      // Implementation for downloading invoice PDF
      enqueueSnackbar('Invoice download started', { variant: 'info' })
    } catch (error) {
      enqueueSnackbar('Failed to download invoice', { variant: 'error' })
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Billing & Invoices
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateBill}
        >
          Create Bill
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" component="div">
                ${stats?.totalRevenue || '0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Bills
              </Typography>
              <Typography variant="h4" component="div">
                {stats?.pendingBills || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Paid This Month
              </Typography>
              <Typography variant="h4" component="div">
                ${stats?.monthlyRevenue || '0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Overdue
              </Typography>
              <Typography variant="h4" component="div">
                {stats?.overdueBills || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs and Filters */}
      <Paper sx={{ mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All Bills" />
            <Tab label="Pending" />
            <Tab label="Paid" />
            <Tab label="Overdue" />
          </Tabs>
        </Box>

        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            select
            label="Status Filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="generated">Generated</MenuItem>
            <MenuItem value="sent">Sent</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>

          <TextField
            label="Search Bills"
            size="small"
            sx={{ minWidth: 200 }}
            placeholder="Search by patient or bill number..."
          />
        </Box>
      </Paper>

      {/* Bills Data Grid */}
      <Paper sx={{ width: '100%' }}>
        <DataGrid
          rows={filteredBills}
          columns={columns}
          loading={isLoading}
          autoHeight
          pagination
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          sx={{
            border: 0,
            '& .MuiDataGrid-cell:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        />
      </Paper>

      {/* Bill Form Dialog */}
      <Dialog
        open={openForm}
        onClose={() => {
          setOpenForm(false)
          setSelectedBill(null)
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {selectedBill ? 'Edit Bill' : 'Create New Bill'}
        </DialogTitle>
        <DialogContent>
          <BillForm
            bill={selectedBill}
            onSuccess={() => {
              setOpenForm(false)
              setSelectedBill(null)
              enqueueSnackbar(
                `Bill ${selectedBill ? 'updated' : 'created'} successfully`,
                { variant: 'success' }
              )
            }}
            onCancel={() => {
              setOpenForm(false)
              setSelectedBill(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default Billing