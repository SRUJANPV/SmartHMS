import React, { useEffect, useState } from 'react'
import {
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'

import { createBill, updateBill } from '../../redux/slices/billingSlice'

const BillForm = ({ bill, onSuccess, onCancel }) => {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const { patients = [] } = useSelector((state) => state.patients || {})

  const [items, setItems] = useState([])
  const [selectedPatient, setSelectedPatient] = useState('')

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm({
    defaultValues: bill ? {
      ...bill,
      billDate: bill.billDate ? dayjs(bill.billDate) : dayjs(),
      dueDate: bill.dueDate ? dayjs(bill.dueDate) : dayjs().add(30, 'day')
    } : {
      patientId: '',
      billDate: dayjs(),
      dueDate: dayjs().add(30, 'day'),
      notes: '',
      taxRate: 10,
      discountRate: 0
    }
  })

  const taxRate = watch('taxRate') || 0
  const discountRate = watch('discountRate') || 0

  useEffect(() => {
    if (bill) {
      setItems(bill.items || [])
      setSelectedPatient(bill.patientId)
    }
  }, [bill])

  const calculateTotals = () => {
    const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const taxAmount = (subTotal * taxRate) / 100
    const discountAmount = (subTotal * discountRate) / 100
    const totalAmount = subTotal + taxAmount - discountAmount

    return { subTotal, taxAmount, discountAmount, totalAmount }
  }

  const { subTotal, taxAmount, discountAmount, totalAmount } = calculateTotals()

  const addItem = () => {
    setItems([...items, {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      itemType: 'other'
    }])
  }

  const updateItem = (id, field, value) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
        }
        
        return updatedItem
      }
      return item
    })
    
    setItems(updatedItems)
  }

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const onSubmit = async (formData) => {
    try {
      const billData = {
        ...formData,
        patientId: selectedPatient,
        items: items.filter(item => item.description && item.unitPrice > 0),
        subTotal,
        taxAmount,
        discountAmount,
        totalAmount,
        billDate: formData.billDate.toISOString(),
        dueDate: formData.dueDate.toISOString()
      }

      if (bill) {
        await dispatch(updateBill({ id: bill.id, data: billData })).unwrap()
      } else {
        await dispatch(createBill(billData)).unwrap()
      }
      
      onSuccess()
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to save bill', { variant: 'error' })
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* Patient Selection */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!selectedPatient}>
            <InputLabel>Select Patient</InputLabel>
            <Select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              label="Select Patient"
            >
              {patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName} ({patient.patientId})
                </MenuItem>
              ))}
            </Select>
            {!selectedPatient && (
              <Typography variant="caption" color="error">
                Please select a patient
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Bill Date */}
        <Grid item xs={12} md={3}>
          <Controller
            name="billDate"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  {...field}
                  label="Bill Date"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.billDate,
                      helperText: errors.billDate?.message
                    }
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>

        {/* Due Date */}
        <Grid item xs={12} md={3}>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  {...field}
                  label="Due Date"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dueDate,
                      helperText: errors.dueDate?.message
                    }
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>

        {/* Bill Items */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Bill Items
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addItem}
                  variant="outlined"
                >
                  Add Item
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell width={100}>Quantity</TableCell>
                      <TableCell width={120}>Unit Price</TableCell>
                      <TableCell width={120}>Total</TableCell>
                      <TableCell width={80}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Item description"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            InputProps={{
                              startAdornment: '$'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="bold">
                            ${(item.quantity * item.unitPrice).toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => removeItem(item.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                          <Typography color="textSecondary">
                            No items added. Click "Add Item" to start.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Tax and Discount */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tax & Discount
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Controller
                    name="taxRate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tax Rate (%)"
                        type="number"
                        fullWidth
                        InputProps={{
                          endAdornment: '%'
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="discountRate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Discount Rate (%)"
                        type="number"
                        fullWidth
                        InputProps={{
                          endAdornment: '%'
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Totals */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Bill Summary
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${subTotal.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax ({taxRate}%):</Typography>
                <Typography>${taxAmount.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Discount ({discountRate}%):</Typography>
                <Typography>-${discountAmount.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ${totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notes */}
        <Grid item xs={12}>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Notes"
                fullWidth
                multiline
                rows={3}
                placeholder="Additional notes or instructions..."
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button
          onClick={onCancel}
          startIcon={<CancelIcon />}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={isSubmitting || !selectedPatient || items.length === 0}
        >
          {isSubmitting ? 'Saving...' : (bill ? 'Update Bill' : 'Create Bill')}
        </Button>
      </Box>
    </Box>
  )
}

export default BillForm