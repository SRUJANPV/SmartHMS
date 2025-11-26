import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { updateStock } from '../../redux/slices/inventorySlice'

const validationSchema = yup.object({
  operation: yup.string().required('Operation is required'),
  quantity: yup.number()
    .min(1, 'Quantity must be at least 1')
    .required('Quantity is required'),
  reason: yup.string().required('Reason is required')
})

const StockUpdateForm = ({ item, onSuccess, onCancel }) => {
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      operation: 'add',
      quantity: 1,
      reason: ''
    }
  })

  const operation = watch('operation')
  const quantity = watch('quantity')

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      const quantityChange = values.operation === 'add' ? values.quantity : -values.quantity
      await dispatch(updateStock({
        id: item.id,
        quantityChange,
        reason: values.reason
      })).unwrap()
      onSuccess()
    } catch (error) {
      console.error('Error updating stock:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!item) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">No item selected</Typography>
      </Box>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Current Stock: {item.currentStock} {item.unitOfMeasure}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Item Code: {item.itemCode}
        </Typography>
      </Box>

      <Controller
        name="operation"
        control={control}
        render={({ field }) => (
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">Operation</FormLabel>
            <RadioGroup {...field} row>
              <FormControlLabel value="add" control={<Radio />} label="Add Stock" />
              <FormControlLabel value="subtract" control={<Radio />} label="Remove Stock" />
            </RadioGroup>
          </FormControl>
        )}
      />

      <Controller
        name="quantity"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Quantity"
            type="number"
            error={!!errors.quantity}
            helperText={errors.quantity?.message}
            InputProps={{ inputProps: { min: 1 } }}
            sx={{ mb: 3 }}
          />
        )}
      />

      <Controller
        name="reason"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Reason for stock update"
            multiline
            rows={3}
            error={!!errors.reason}
            helperText={errors.reason?.message}
            placeholder="e.g., New delivery, Used in procedure, Expired items, etc."
            sx={{ mb: 3 }}
          />
        )}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          New Stock Level: {
            operation === 'add'
              ? item.currentStock + (quantity || 0)
              : Math.max(0, item.currentStock - (quantity || 0))
          } {item.unitOfMeasure}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          onClick={onCancel}
          disabled={isSubmitting}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="contained"
          color={operation === 'add' ? 'success' : 'warning'}
        >
          {isSubmitting ? 'Updating...' : `${operation === 'add' ? 'Add' : 'Remove'} Stock`}
        </Button>
      </Box>
    </Box>
  )
}

export default StockUpdateForm