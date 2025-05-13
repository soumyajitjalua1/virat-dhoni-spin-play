// backend/config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

// backend/models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Deposit', 'Withdrawal', 'Game Win'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Success', 'Failed'],
    default: 'Pending'
  },
  details: {
    type: String
  },
  paymentId: {
    type: String
  },
  orderId: {
    type: String
  },
  withdrawalMethod: {
    type: String,
    enum: ['upi', 'bank', ''],
    default: ''
  },
  withdrawalDetails: {
    upiId: String,
    accountNumber: String,
    accountName: String,
    ifscCode: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);

// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  walletBalance: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);

// backend/routes/wallet.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
require('dotenv').config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route   POST api/wallet/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Create Razorpay order
    const options = {
      amount: amount, // amount in paise
      currency: "INR",
      receipt: "order_" + Date.now(),
      payment_capture: 1
    };
    
    const order = await razorpay.orders.create(options);
    
    // Create transaction record
    await Transaction.create({
      userId: req.user.id,
      type: 'Deposit',
      amount: amount / 100, // Convert paise to rupees for our records
      status: 'Pending',
      orderId: order.id
    });
    
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/wallet/verify-payment
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");
      
    const isAuthentic = expectedSignature === razorpay_signature;
    
    if (isAuthentic) {
      // Get transaction details
      const transaction = await Transaction.findOne({ orderId: razorpay_order_id });
      if (!transaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }
      
      // Update transaction
      transaction.status = 'Success';
      transaction.paymentId = razorpay_payment_id;
      transaction.details = `Payment ID: ${razorpay_payment_id}`;
      await transaction.save();
      
      // Update user wallet balance
      const user = await User.findById(req.user.id);
      user.walletBalance += transaction.amount;
      await user.save();
      
      res.json({ success: true });
    } else {
      // Update transaction as failed
      await Transaction.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: 'Failed', details: 'Signature verification failed' }
      );
      
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/wallet/withdraw
// @desc    Process withdrawal request
// @access  Private
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount, method, upiId, accountNumber, ifscCode, accountName } = req.body;
    
    // Check if user has sufficient balance
    const user = await User.findById(req.user.id);
    if (user.walletBalance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }
    
    // Create withdrawal details object
    const withdrawalDetails = {};
    if (method === 'upi') {
      withdrawalDetails.upiId = upiId;
    } else if (method === 'bank') {
      withdrawalDetails.accountNumber = accountNumber;
      withdrawalDetails.ifscCode = ifscCode;
      withdrawalDetails.accountName = accountName;
    }
    
    // Create transaction record
    const transaction = await Transaction.create({
      userId: req.user.id,
      type: 'Withdrawal',
      amount,
      status: 'Processing',
      withdrawalMethod: method,
      withdrawalDetails,
      details: method === 'upi' ? `UPI: ${upiId}` : `Bank: ${accountNumber.substring(0, 4)}XXXX`
    });
    
    // Update user wallet balance
    user.walletBalance -= amount;
    await user.save();
    
    // In a real application, you would initiate the actual withdrawal process here
    // This might involve connecting to a payment gateway or bank API
    // For this example, we'll just mark it as processing
    
    res.json({ 
      success: true,
      message: 'Withdrawal request received',
      transaction: {
        id: transaction._id,
        amount,
        status: 'Processing'
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/wallet/balance
// @desc    Get user wallet balance
// @access  Private
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('walletBalance');
    res.json({ balance: user.walletBalance });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/wallet/transactions
// @desc    Get user transactions
// @access  Private
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;