const billingService = require('../services/billingService');
const { activityLog } = require('../utils/activityLog');
const logger = require('../utils/logger');

exports.createBill = async (req, res) => {
  try {
    const billData = req.body;
    const bill = await billingService.createBill(billData, req.user.id);
    
    await activityLog(
      req.user.id,
      'BILL_CREATE',
      `Created bill ${bill.billNumber} for patient ${billData.patientId}`,
      req
    );

    res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      data: bill
    });
  } catch (error) {
    logger.error('Create bill error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllBills = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, patientId, dateFrom, dateTo } = req.query;
    const result = await billingService.getAllBills({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      patientId,
      dateFrom,
      dateTo
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get bills error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await billingService.getBillById(id);

    res.status(200).json({
      success: true,
      data: bill
    });
  } catch (error) {
    logger.error('Get bill error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const bill = await billingService.updateBill(id, updateData, req.user.id);
    
    await activityLog(
      req.user.id,
      'BILL_UPDATE',
      `Updated bill ${bill.billNumber}`,
      req
    );

    res.status(200).json({
      success: true,
      message: 'Bill updated successfully',
      data: bill
    });
  } catch (error) {
    logger.error('Update bill error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    await billingService.deleteBill(id, req.user.id);
    
    await activityLog(
      req.user.id,
      'BILL_DELETE',
      `Deleted bill with ID: ${id}`,
      req
    );

    res.status(200).json({
      success: true,
      message: 'Bill deleted successfully'
    });
  } catch (error) {
    logger.error('Delete bill error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.addBillItem = async (req, res) => {
  try {
    const { id } = req.params;
    const itemData = req.body;

    const bill = await billingService.addBillItem(id, itemData, req.user.id);
    
    await activityLog(
      req.user.id,
      'BILL_ITEM_ADD',
      `Added item to bill ${id}`,
      req
    );

    res.status(200).json({
      success: true,
      message: 'Bill item added successfully',
      data: bill
    });
  } catch (error) {
    logger.error('Add bill item error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.removeBillItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const bill = await billingService.removeBillItem(id, itemId, req.user.id);
    
    await activityLog(
      req.user.id,
      'BILL_ITEM_REMOVE',
      `Removed item from bill ${id}`,
      req
    );

    res.status(200).json({
      success: true,
      message: 'Bill item removed successfully',
      data: bill
    });
  } catch (error) {
    logger.error('Remove bill item error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateBillStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentMethod, paymentReference } = req.body;

    const bill = await billingService.updateBillStatus(
      id, 
      status, 
      { paymentMethod, paymentReference },
      req.user.id
    );
    
    await activityLog(
      req.user.id,
      'BILL_STATUS_UPDATE',
      `Updated bill ${bill.billNumber} status to ${status}`,
      req
    );

    res.status(200).json({
      success: true,
      message: 'Bill status updated successfully',
      data: bill
    });
  } catch (error) {
    logger.error('Update bill status error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.generateInvoicePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const pdfBuffer = await billingService.generateInvoicePdf(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${id}.pdf`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    logger.error('Generate PDF error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getBillingStats = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const stats = await billingService.getBillingStats(period);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Get billing stats error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};