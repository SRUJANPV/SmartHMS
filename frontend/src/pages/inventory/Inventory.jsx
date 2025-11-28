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
  TextField,
  MenuItem,
  Alert
} from '@mui/material'
import {
  Add as AddIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'

import InventoryForm from './InventoryForm'
import StockUpdateForm from './StockUpdateForm'
import { getInventory, getInventoryStats, getLowStockItems } from '../../redux/slices/inventorySlice'

const Inventory = () => {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  
  const { inventory = [], stats = {}, lowStockItems = [], isLoading = false } = useSelector((state) => state.inventory || {})
  
  const [openForm, setOpenForm] = useState(false)
  const [openStockForm, setOpenStockForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')

  useEffect(() => {
    dispatch(getInventory())
    dispatch(getInventoryStats())
    dispatch(getLowStockItems())
  }, [dispatch])

  const categoryChips = {
    medication: { color: 'primary', label: 'Medication' },
    medical_supplies: { color: 'secondary', label: 'Medical Supplies' },
    equipment: { color: 'info', label: 'Equipment' },
    laboratory: { color: 'warning', label: 'Laboratory' },
    surgical: { color: 'error', label: 'Surgical' },
    office_supplies: { color: 'success', label: 'Office Supplies' },
    other: { color: 'default', label: 'Other' }
  }

  const filteredItems = inventory.filter(item => {
    const categoryMatch = categoryFilter === 'all' || item.category === categoryFilter
    const stockMatch = stockFilter === 'all' || 
      (stockFilter === 'low' && item.currentStock <= item.minimumStock) ||
      (stockFilter === 'out' && item.currentStock === 0)
    
    return categoryMatch && stockMatch
  })

  const columns = [
    {
      field: 'itemCode',
      headerName: 'Item Code',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'name',
      headerName: 'Item Name',
      width: 200
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={categoryChips[params.value]?.label}
          color={categoryChips[params.value]?.color}
          size="small"
        />
      )
    },
    {
      field: 'currentStock',
      headerName: 'Stock',
      width: 120,
      renderCell: (params) => {
        const isLowStock = params.value <= params.row.minimumStock
        const isOutOfStock = params.value === 0
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="body2" 
              fontWeight="bold"
              color={isOutOfStock ? 'error' : isLowStock ? 'warning' : 'success'}
            >
              {params.value} {params.row.unitOfMeasure}
            </Typography>
            {isLowStock && <WarningIcon color="warning" fontSize="small" />}
          </Box>
        )
      }
    },
    {
      field: 'minimumStock',
      headerName: 'Min Stock',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value} {params.row.unitOfMeasure}
        </Typography>
      )
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          ${params.value}
        </Typography>
      )
    },
    {
      field: 'supplier',
      headerName: 'Supplier',
      width: 150
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleDateString() : 'N/A'}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleUpdateStock(params.row)}
            color="primary"
          >
            <InventoryIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleEditItem(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteItem(params.row)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ]

  const handleCreateItem = () => {
    setSelectedItem(null)
    setOpenForm(true)
  }

  const handleEditItem = (item) => {
    setSelectedItem(item)
    setOpenForm(true)
  }

  const handleUpdateStock = (item) => {
    setSelectedItem(item)
    setOpenStockForm(true)
  }

  const handleDeleteItem = (item) => {
    // Implement delete confirmation
    console.log('Delete item:', item)
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Inventory Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateItem}
        >
          Add Item
        </Button>
      </Box>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Alert 
          severity="warning" 
          icon={<WarningIcon />}
          sx={{ mb: 3 }}
        >
          <Typography variant="body1" fontWeight="bold">
            Low Stock Alert: {lowStockItems.length} items are below minimum stock level
          </Typography>
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Items
              </Typography>
              <Typography variant="h4" component="div">
                {stats?.totalItems || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Low Stock Items
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                {stats?.lowStockCount || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Out of Stock
              </Typography>
              <Typography variant="h4" component="div" color="error.main">
                {stats?.outOfStockCount || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Value
              </Typography>
              <Typography variant="h4" component="div">
                ${stats?.totalValue || '0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="all">All Categories</MenuItem>
              {Object.entries(categoryChips).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Stock Status"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="all">All Items</MenuItem>
              <MenuItem value="low">Low Stock</MenuItem>
              <MenuItem value="out">Out of Stock</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Search Items"
              placeholder="Search by name or code..."
              fullWidth
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Inventory Data Grid */}
      <Paper sx={{ width: '100%' }}>
        <DataGrid
          rows={filteredItems}
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

      {/* Inventory Form Dialog */}
      <Dialog
        open={openForm}
        onClose={() => {
          setOpenForm(false)
          setSelectedItem(null)
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
        </DialogTitle>
        <DialogContent>
          <InventoryForm
            item={selectedItem}
            onSuccess={() => {
              setOpenForm(false)
              setSelectedItem(null)
              enqueueSnackbar(
                `Item ${selectedItem ? 'updated' : 'created'} successfully`,
                { variant: 'success' }
              )
            }}
            onCancel={() => {
              setOpenForm(false)
              setSelectedItem(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Stock Update Dialog */}
      <Dialog
        open={openStockForm}
        onClose={() => {
          setOpenStockForm(false)
          setSelectedItem(null)
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Update Stock - {selectedItem?.name}
        </DialogTitle>
        <DialogContent>
          <StockUpdateForm
            item={selectedItem}
            onSuccess={() => {
              setOpenStockForm(false)
              setSelectedItem(null)
              enqueueSnackbar('Stock updated successfully', { variant: 'success' })
            }}
            onCancel={() => {
              setOpenStockForm(false)
              setSelectedItem(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default Inventory