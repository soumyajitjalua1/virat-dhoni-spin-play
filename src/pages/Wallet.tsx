import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wallet as WalletIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  status: string;
}

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
  }, []);
  
  const handleAddMoney = () => {
    const addedAmount = Number(amount);
    if (!addedAmount || addedAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    
    // This would connect to payment gateway in a real application
    toast({
      title: "Amount Added",
      description: `₹${addedAmount} has been added to your wallet`,
    });
    
    const newBalance = balance + addedAmount;
    setBalance(newBalance);
    localStorage.setItem('walletBalance', newBalance.toString());
    
    // Add transaction record
    addTransaction("Deposit", addedAmount);
    
    setAmount("");
  };
  
  const addTransaction = (type: string, amount: number) => {
    const now = new Date();
    const dateString = now.toISOString().slice(0, 10) + ' ' + 
                      now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');
                      
    const newTransaction: Transaction = {
      id: Date.now(),
      type,
      amount,
      date: dateString,
      status: 'Success'
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4 bg-game-primary hover:bg-game-primary/90">Add Money</Button>
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
                      Add Money
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
                        </div>
                        <div className={`font-bold ${tx.type === 'Withdrawal' ? 'text-red-500' : 'text-green-500'}`}>
                          {tx.type === 'Withdrawal' ? '-' : '+'}₹{tx.amount}
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
                          </div>
                          <div className="font-bold text-green-500">
                            +₹{tx.amount}
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
                          </div>
                          <div className="font-bold text-red-500">
                            -₹{tx.amount}
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
    </div>
  );
};

export default Wallet;