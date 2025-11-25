const billRepository = require('../repositories/billRepository');
const { generateBillNumber } = require('../utils/helpers');
const PDFDocument = require('pdfkit');

class BillingService {
  async createBill(billData, createdBy) {
    try {
      // Generate bill number
      billData.billNumber = generateBillNumber();
      billData.createdBy = createdBy;

      // Calculate totals if items are provided
      if (billData.items && billData.items.length > 0) {
        this.calculateBillTotals(billData);
      }

      const bill = await billRepository.createWithItems(billData);
      return bill;
    } catch (error) {
      throw new Error(`Failed to create bill: ${error.message}`);
    }
  }

  async getAllBills(options = {}) {
    try {
      const bills = await billRepository.findAll(options);
      return bills;
    } catch (error) {
      throw new Error(`Failed to fetch bills: ${error.message}`);
    }
  }

  async getBillById(billId) {
    try {
      const bill = await billRepository.findByIdWithItems(billId);
      
      if (!bill) {
        throw new Error('Bill not found');
      }

      return bill;
    } catch (error) {
      throw new Error(`Failed to fetch bill: ${error.message}`);
    }
  }

  async updateBill(billId, updateData, updatedBy) {
    try {
      const bill = await billRepository.findById(billId);
      
      if (!bill) {
        throw new Error('Bill not found');
      }

      // Recalculate totals if items are being updated
      if (updateData.items) {
        this.calculateBillTotals(updateData);
      }

      const updatedBill = await billRepository.updateWithItems(billId, updateData);
      return updatedBill;
    } catch (error) {
      throw new Error(`Failed to update bill: ${error.message}`);
    }
  }

  async deleteBill(billId, deletedBy) {
    try {
      const bill = await billRepository.findById(billId);
      
      if (!bill) {
        throw new Error('Bill not found');
      }

      // Only allow deletion of draft bills
      if (bill.status !== 'draft') {
        throw new Error('Only draft bills can be deleted');
      }

      await billRepository.delete(billId);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete bill: ${error.message}`);
    }
  }

  async addBillItem(billId, itemData, updatedBy) {
    try {
      const bill = await billRepository.findById(billId);
      
      if (!bill) {
        throw new Error('Bill not found');
      }

      // Calculate item total
      itemData.total = itemData.quantity * itemData.unitPrice;
      itemData.billId = billId;

      const updatedBill = await billRepository.addItem(billId, itemData);
      return updatedBill;
    } catch (error) {
      throw new Error(`Failed to add bill item: ${error.message}`);
    }
  }

  async removeBillItem(billId, itemId, updatedBy) {
    try {
      const bill = await billRepository.findById(billId);
      
      if (!bill) {
        throw new Error('Bill not found');
      }

      const updatedBill = await billRepository.removeItem(billId, itemId);
      return updatedBill;
    } catch (error) {
      throw new Error(`Failed to remove bill item: ${error.message}`);
    }
  }

  async updateBillStatus(billId, status, paymentInfo = {}, updatedBy) {
    try {
      const bill = await billRepository.findById(billId);
      
      if (!bill) {
        throw new Error('Bill not found');
      }

      const updateData = { status };

      // If marking as paid, set payment details
      if (status === 'paid') {
        updateData.paymentMethod = paymentInfo.paymentMethod;
        updateData.paymentReference = paymentInfo.paymentReference;
        updateData.paymentDate = new Date();
      }

      const updatedBill = await billRepository.update(billId, updateData);
      return updatedBill;
    } catch (error) {
      throw new Error(`Failed to update bill status: ${error.message}`);
    }
  }

  calculateBillTotals(billData) {
    let subTotal = 0;

    // Calculate subtotal from items
    if (billData.items && billData.items.length > 0) {
      billData.items.forEach(item => {
        item.total = item.quantity * item.unitPrice;
        subTotal += item.total;
      });
    }

    billData.subTotal = subTotal;
    
    // Calculate tax and discount
    const taxAmount = (subTotal * (billData.taxRate || 0)) / 100;
    const discountAmount = (subTotal * (billData.discountRate || 0)) / 100;
    
    billData.taxAmount = taxAmount;
    billData.discountAmount = discountAmount;
    billData.totalAmount = subTotal + taxAmount - discountAmount;

    return billData;
  }

  async generateInvoicePdf(billId) {
    try {
      const bill = await billRepository.findByIdWithDetails(billId);
      
      if (!bill) {
        throw new Error('Bill not found');
      }

      // Create PDF document
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {});

      // Add invoice content
      this.addInvoiceContent(doc, bill);

      doc.end();

      // Wait for PDF generation to complete
      return new Promise((resolve) => {
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });
      });
    } catch (error) {
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }

  addInvoiceContent(doc, bill) {
    // Header
    doc.fontSize(20).text('SMARTCARE HOSPITAL', 50, 50);
    doc.fontSize(10).text('123 Healthcare Street', 50, 75);
    doc.text('Medical City, MC 12345', 50, 90);
    doc.text('Phone: (555) 123-4567', 50, 105);

    // Invoice title
    doc.fontSize(16).text('INVOICE', 400, 50);
    doc.fontSize(10);
    doc.text(`Invoice #: ${bill.billNumber}`, 400, 75);
    doc.text(`Date: ${new Date(bill.billDate).toLocaleDateString()}`, 400, 90);
    doc.text(`Status: ${bill.status.toUpperCase()}`, 400, 105);

    // Patient information
    doc.text('BILL TO:', 50, 150);
    doc.text(`${bill.patient.firstName} ${bill.patient.lastName}`, 50, 165);
    if (bill.patient.address) {
      doc.text(bill.patient.address, 50, 180);
    }
    if (bill.patient.phone) {
      doc.text(`Phone: ${bill.patient.phone}`, 50, 195);
    }

    // Invoice items table
    const tableTop = 250;
    doc.fontSize(12);
    doc.text('Description', 50, tableTop);
    doc.text('Qty', 300, tableTop);
    doc.text('Unit Price', 350, tableTop);
    doc.text('Total', 450, tableTop);

    // Table line
    doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).stroke();

    let yPosition = tableTop + 40;

    // Bill items
    bill.items.forEach(item => {
      doc.fontSize(10);
      doc.text(item.description, 50, yPosition, { width: 200 });
      doc.text(item.quantity.toString(), 300, yPosition);
      doc.text(`$${item.unitPrice.toFixed(2)}`, 350, yPosition);
      doc.text(`$${item.total.toFixed(2)}`, 450, yPosition);
      yPosition += 20;
    });

    // Totals
    yPosition += 20;
    doc.text(`Subtotal: $${bill.subTotal.toFixed(2)}`, 350, yPosition);
    yPosition += 20;
    doc.text(`Tax (${bill.taxRate}%): $${bill.taxAmount.toFixed(2)}`, 350, yPosition);
    yPosition += 20;
    doc.text(`Discount (${bill.discountRate}%): -$${bill.discountAmount.toFixed(2)}`, 350, yPosition);
    yPosition += 20;
    doc.fontSize(12).text(`Total: $${bill.totalAmount.toFixed(2)}`, 350, yPosition, { bold: true });

    // Footer
    yPosition += 50;
    doc.fontSize(8).text('Thank you for choosing SmartCare Hospital', 50, yPosition, { align: 'center' });
  }

  async getBillingStats(period = 'month') {
    try {
      const totalRevenue = await billRepository.getTotalRevenue(period);
      const pendingBills = await billRepository.countByStatus('generated');
      const paidBills = await billRepository.countByStatus('paid');
      const revenueByMonth = await billRepository.getRevenueByMonth();

      return {
        totalRevenue,
        pendingBills,
        paidBills,
        revenueByMonth
      };
    } catch (error) {
      throw new Error(`Failed to fetch billing stats: ${error.message}`);
    }
  }
}

module.exports = new BillingService();