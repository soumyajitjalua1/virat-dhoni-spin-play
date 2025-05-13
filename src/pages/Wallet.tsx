import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wallet as WalletIcon, CreditCard, ArrowDownToLine } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';
import FooterNavigation from '@/components/FooterNavigation';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  status: string;
  details?: string;
}

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountName, setAccountName] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("upi");
  const { toast } = useToast();
  
  // Load wallet balance and transactions from localStorage on component mount
  useEffect(() => {
    // Load wallet balance
    const storedBalance = localStorage.getItem('walletBalance');
    if (storedBalance) {
      setBalance(parseInt(storedBalance));
    }
    
    // Load transaction history
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      // Initialize with sample data if no transactions exist
      const initialTransactions = [
        { id: 1, type: "Deposit", amount: 500, date: "2024-04-28 14:30", status: "Success" },
        { id: 2, type: "Withdrawal", amount: 200, date: "2024-04-27 10:15", status: "Success" },
        { id: 3, type: "Game Win", amount: 700, date: "2024-04-26 18:45", status: "Success" }
      ];
      setTransactions(initialTransactions);
      localStorage.setItem('transactions', JSON.stringify(initialTransactions));
    }
    
    // Reset daily spin opportunity when the day changes
    const today = new Date().toISOString().split('T')[0];
    const lastSpinDate = localStorage.getItem('lastSpinDate');
    
    if (lastSpinDate !== today) {
      localStorage.removeItem('hasSpunToday');
      localStorage.setItem('lastSpinDate', today);
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const handleAddMoney = async () => {
    const addedAmount = Number(amount);
    if (!addedAmount || addedAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create order on the backend
      const response = await axios.post('/api/wallet/create-order', {
        amount: addedAmount * 100, // Razorpay expects amount in paise
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YOUR_TEST_KEY', // Replace with your key
        amount: addedAmount * 100,
        currency: "INR",
        name: "Game Wallet",
        description: "Add money to wallet",
        order_id: response.data.id,
        handler: function (response: any) {
          // Verify payment with backend
          verifyPayment(response, addedAmount);
        },
        prefill: {
          name: localStorage.getItem('userName') || "",
          email: localStorage.getItem('userEmail') || "",
          contact: localStorage.getItem('userPhone') || ""
        },
        theme: {
          color: "#3399cc"
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Payment Failed",
        description: "Unable to initialize payment. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const verifyPayment = async (paymentResponse: any, addedAmount: number) => {
    try {
      // Verify payment with backend
      const response = await axios.post('/api/wallet/verify-payment', {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature
      });

      if (response.data.success) {
        // Payment successful, update wallet balance
        const newBalance = balance + addedAmount;
        setBalance(newBalance);
        localStorage.setItem('walletBalance', newBalance.toString());
        
        // Add transaction record
        addTransaction("Deposit", addedAmount, "Success", `Payment ID: ${paymentResponse.razorpay_payment_id}`);
        
        toast({
          title: "Payment Successful",
          description: `₹${addedAmount} has been added to your wallet`,
        });
      } else {
        toast({
          title: "Payment Verification Failed",
          description: "Your payment could not be verified",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast({
        title: "Payment Verification Failed",
        description: "Please contact support if your money was debited",
        variant: "destructive"
      });
    }
    
    setAmount("");
  };

  const handleWithdraw = async () => {
    const withdrawAmountNum = Number(withdrawAmount);
    if (!withdrawAmountNum || withdrawAmountNum <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (withdrawAmountNum > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance to withdraw this amount",
        variant: "destructive"
      });
      return;
    }

    // Validate withdraw method details
    if (withdrawMethod === "upi" && !upiId) {
      toast({
        title: "Missing UPI ID",
        description: "Please enter your UPI ID",
        variant: "destructive"
      });
      return;
    }

    if (withdrawMethod === "bank" && (!bankAccount || !ifscCode || !accountName)) {
      toast({
        title: "Missing bank details",
        description: "Please enter all bank account details",
        variant: "destructive"
      });
      return;
    }

    try {
      // Make API call to process withdrawal
      const withdrawalDetails = withdrawMethod === "upi" 
        ? { upiId } 
        : { accountNumber: bankAccount, ifscCode, accountName };

      const response = await axios.post('/api/wallet/withdraw', {
        amount: withdrawAmountNum,
        method: withdrawMethod,
        ...withdrawalDetails
      });

      if (response.data.success) {
        // Update balance
        const newBalance = balance - withdrawAmountNum;
        setBalance(newBalance);
        localStorage.setItem('walletBalance', newBalance.toString());
        
        // Add transaction record
        const details = withdrawMethod === "upi" 
          ? `UPI: ${upiId}` 
          : `Bank: ${bankAccount.substring(0, 4)}XXXX`;
        
        addTransaction("Withdrawal", withdrawAmountNum, "Processing", details);
        
        toast({
          title: "Withdrawal Requested",
          description: `₹${withdrawAmountNum} withdrawal has been initiated. It may take 24-48 hours to process.`,
        });
        
        // Close dialog and reset fields
        setIsWithdrawDialogOpen(false);
        setWithdrawAmount("");
        setUpiId("");
        setBankAccount("");
        setIfscCode("");
        setAccountName("");
      }
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      toast({
        title: "Withdrawal Failed",
        description: "Unable to process your withdrawal. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  const addTransaction = (type: string, amount: number, status: string = "Success", details?: string) => {
    const now = new Date();
    const dateString = now.toISOString().slice(0, 10) + ' ' + 
                      now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');
                      
    const newTransaction: Transaction = {
      id: Date.now(),
      type,
      amount,
      date: dateString,
      status,
      details
    };
    
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-game-primary text-white p-4">
        <div className="flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">Wallet</h1>
        </div>
      </div>
      
      <div className="p-4">
        <Card className="mb-4">
          <CardHeader className="bg-gray-50 pb-2">
            <CardTitle className="flex items-center">
              <WalletIcon className="w-5 h-5 mr-2" />
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-game-primary">₹{balance}</div>
              <div className="flex gap-2 justify-center mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-game-primary hover:bg-game-primary/90 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Add Money
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Money to Wallet</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">Enter Amount</label>
                        <Input 
                          type="number" 
                          placeholder="Enter amount" 
                          value={amount} 
                          onChange={(e) => setAmount(e.target.value)} 
                        />
                      </div>
                      <div className="flex gap-2 justify-between">
                        <Button 
                          onClick={() => setAmount("100")}
                          variant="outline" 
                          className="flex-1"
                        >
                          ₹100
                        </Button>
                        <Button 
                          onClick={() => setAmount("500")} 
                          variant="outline" 
                          className="flex-1"
                        >
                          ₹500
                        </Button>
                        <Button 
                          onClick={() => setAmount("1000")} 
                          variant="outline" 
                          className="flex-1"
                        >
                          ₹1000
                        </Button>
                      </div>
                      <Button className="w-full bg-game-primary hover:bg-game-primary/90" onClick={handleAddMoney}>
                        Pay with Razorpay
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <ArrowDownToLine className="w-4 h-4 mr-2" />
                      Withdraw
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Withdraw Money</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">Enter Amount</label>
                        <Input 
                          type="number" 
                          placeholder="Enter amount" 
                          value={withdrawAmount} 
                          onChange={(e) => setWithdrawAmount(e.target.value)} 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Withdrawal Method</label>
                        <div className="flex gap-2">
                          <Button 
                            type="button"
                            variant={withdrawMethod === "upi" ? "default" : "outline"}
                            className={withdrawMethod === "upi" ? "bg-game-primary flex-1" : "flex-1"}
                            onClick={() => setWithdrawMethod("upi")}
                          >
                            UPI
                          </Button>
                          <Button 
                            type="button"
                            variant={withdrawMethod === "bank" ? "default" : "outline"}
                            className={withdrawMethod === "bank" ? "bg-game-primary flex-1" : "flex-1"}
                            onClick={() => setWithdrawMethod("bank")}
                          >
                            Bank Transfer
                          </Button>
                        </div>
                      </div>
                      
                      {withdrawMethod === "upi" ? (
                        <div>
                          <label className="block text-sm font-medium mb-1">UPI ID</label>
                          <Input 
                            type="text" 
                            placeholder="yourname@upi" 
                            value={upiId} 
                            onChange={(e) => setUpiId(e.target.value)} 
                          />
                        </div>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-1">Account Holder Name</label>
                            <Input 
                              type="text" 
                              placeholder="Enter name" 
                              value={accountName} 
                              onChange={(e) => setAccountName(e.target.value)} 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Account Number</label>
                            <Input 
                              type="text" 
                              placeholder="Enter account number" 
                              value={bankAccount} 
                              onChange={(e) => setBankAccount(e.target.value)} 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">IFSC Code</label>
                            <Input 
                              type="text" 
                              placeholder="Enter IFSC code" 
                              value={ifscCode} 
                              onChange={(e) => setIfscCode(e.target.value)} 
                            />
                          </div>
                        </>
                      )}
                      
                      <Button className="w-full bg-game-primary hover:bg-game-primary/90" onClick={handleWithdraw}>
                        Request Withdrawal
                      </Button>
                      <div className="text-xs text-gray-500 text-center">
                        Withdrawals are processed within 24-48 hours
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Daily Free Spin</h2>
            <div className="text-sm">
              {localStorage.getItem('hasSpunToday') === 'true' ? (
                <span className="text-red-500">Used for today</span>
              ) : (
                <span className="text-green-500">Available</span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-2">Get one free spin each day! Deposit required.</p>
          <Link to="/wheel-spin">
            <Button className="w-full bg-game-primary hover:bg-game-primary/90">
              Go to Spin & Win
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.length > 0 ? transactions.map((tx) => (
                    <div key={tx.id} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{tx.type}</div>
                          <div className="text-sm text-gray-500">{tx.date}</div>
                          {tx.details && <div className="text-xs text-gray-400">{tx.details}</div>}
                        </div>
                        <div>
                          <div className={`font-bold ${tx.type === 'Withdrawal' ? 'text-red-500' : 'text-green-500'}`}>
                            {tx.type === 'Withdrawal' ? '-' : '+'}₹{tx.amount}
                          </div>
                          <div className={`text-xs ${tx.status === 'Processing' ? 'text-yellow-500' : 'text-green-500'}`}>
                            {tx.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-4 text-gray-500">No transactions yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="deposits" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Deposit History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions
                    .filter(tx => tx.type === 'Deposit' || tx.type === 'Game Win')
                    .map((tx) => (
                      <div key={tx.id} className="border-b pb-3 last:border-b-0">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">{tx.type}</div>
                            <div className="text-sm text-gray-500">{tx.date}</div>
                            {tx.details && <div className="text-xs text-gray-400">{tx.details}</div>}
                          </div>
                          <div>
                            <div className="font-bold text-green-500">
                              +₹{tx.amount}
                            </div>
                            <div className="text-xs text-green-500">
                              {tx.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {transactions.filter(tx => tx.type === 'Deposit' || tx.type === 'Game Win').length === 0 && (
                      <div className="text-center py-4 text-gray-500">No deposits yet</div>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="withdrawals" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Withdrawal History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions
                    .filter(tx => tx.type === 'Withdrawal')
                    .map((tx) => (
                      <div key={tx.id} className="border-b pb-3 last:border-b-0">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">{tx.type}</div>
                            <div className="text-sm text-gray-500">{tx.date}</div>
                            {tx.details && <div className="text-xs text-gray-400">{tx.details}</div>}
                          </div>
                          <div>
                            <div className="font-bold text-red-500">
                              -₹{tx.amount}
                            </div>
                            <div className={`text-xs ${tx.status === 'Processing' ? 'text-yellow-500' : 'text-green-500'}`}>
                              {tx.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {transactions.filter(tx => tx.type === 'Withdrawal').length === 0 && (
                      <div className="text-center py-4 text-gray-500">No withdrawals yet</div>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <FooterNavigation />
    </div>
  );
};

export default Wallet;