import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { createInventoryItem, updateInventoryItem } from '../../redux/slices/inventorySlice'

const validationSchema = yup.object({
  itemCode: yup.string().required('Item code is required'),
  name: yup.string().required('Item name is required'),
  category: yup.string().required('Category is required'),
  currentStock: yup.number().min(0, 'Stock cannot be negative').required('Current stock is required'),
  minimumStock: yup.number().min(0, 'Minimum stock cannot be negative').required('Minimum stock is required'),
  unitPrice: yup.number().min(0, 'Unit price cannot be negative').required('Unit price is required'),
  supplier: yup.string().required('Supplier is required'),
  expiryDate: yup.date().nullable(),
  unitOfMeasure: yup.string().required('Unit of measure is required')
})

const categories = [
  { value: 'medication', label: 'Medication' },
  { value: 'medical_supplies', label: 'Medical Supplies' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'surgical', label: 'Surgical' },
  { value: 'office_supplies', label: 'Office Supplies' },
  { value: 'other', label: 'Other' }
]

const unitsOfMeasure = [
  'pieces',
  'boxes',
  'bottles',
  'vials',
  'tablets',
  'capsules',
  'ml',
  'mg',
  'g',
  'kg',
  'liters',
  'units',
  'packs'
]

const InventoryForm = ({ item, onSuccess, onCancel }) => {
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      itemCode: item?.itemCode || '',
      name: item?.name || '',
      category: item?.category || '',
      currentStock: item?.currentStock || 0,
      minimumStock: item?.minimumStock || 0,
      unitPrice: item?.unitPrice || 0,
      supplier: item?.supplier || '',
      expiryDate: item?.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
      unitOfMeasure: item?.unitOfMeasure || ''
    }
  })

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      const formattedValues = {
        ...values,
        expiryDate: values.expiryDate ? new Date(values.expiryDate).toISOString() : null
      }

      if (item) {
        await dispatch(updateInventoryItem({ id: item.id, itemData: formattedValues })).unwrap()
      } else {
        await dispatch(createInventoryItem(formattedValues)).unwrap()
      }
      onSuccess()
    } catch (error) {
      console.error('Error saving inventory item:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="itemCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Item Code"
                error={!!errors.itemCode}
                helperText={errors.itemCode?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Item Name"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  {...field}
                  labelId="category-label"
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.category.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="unitOfMeasure"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.unitOfMeasure}>
                <InputLabel id="unitOfMeasure-label">Unit of Measure</InputLabel>
                <Select
                  {...field}
                  labelId="unitOfMeasure-label"
                  label="Unit of Measure"
                >
                  {unitsOfMeasure.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
                {errors.unitOfMeasure && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.unitOfMeasure.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="currentStock"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Current Stock"
                type="number"
                error={!!errors.currentStock}
                helperText={errors.currentStock?.message}
                InputProps={{ inputProps: { min: 0 } }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="minimumStock"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Minimum Stock"
                type="number"
                error={!!errors.minimumStock}
                helperText={errors.minimumStock?.message}
                InputProps={{ inputProps: { min: 0 } }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="unitPrice"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Unit Price ($)"
                type="number"
                error={!!errors.unitPrice}
                helperText={errors.unitPrice?.message}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="supplier"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Supplier"
                error={!!errors.supplier}
                helperText={errors.supplier?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="expiryDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Expiry Date"
                type="date"
                error={!!errors.expiryDate}
                helperText={errors.expiryDate?.message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
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
        >
          {isSubmitting ? 'Saving...' : item ? 'Update Item' : 'Create Item'}
        </Button>
      </Box>
    </Box>
  )
}

export default InventoryForm