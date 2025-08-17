import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Customer, Payment, CustomerSummary, customerAPI } from "@/services/api";
import { AddPaymentForm } from "./AddPaymentForm";
import { PaymentHistory } from "./PaymentHistory";
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Calendar, CreditCard } from "lucide-react";

interface CustomerDetailsProps {
  customer: Customer;
  onBack: () => void;
  onUpdate: () => void;
}

export const CustomerDetails = ({ customer, onBack, onUpdate }: CustomerDetailsProps) => {
  const [summary, setSummary] = useState<CustomerSummary | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [summaryData, paymentsData] = await Promise.all([
        customerAPI.getSummary(customer.id),
        customerAPI.getPayments(customer.id),
      ]);
      setSummary(summaryData);
      setPayments(paymentsData);
    } catch (error) {
      console.error("Error loading customer data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [customer.id]);

  const handlePaymentAdded = () => {
    loadData();
    onUpdate();
    setShowAddPayment(false);
  };

  if (isLoading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading customer details...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = (summary.totalPaid / summary.loanAmount) * 100;
  const isFullyPaid = summary.remaining <= 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{customer.name}</h1>
          <p className="text-muted-foreground">Loan #{customer.loanNo}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Loan Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">₹{summary.loanAmount.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <span className="text-2xl font-bold text-success">₹{summary.totalPaid.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className={`h-5 w-5 ${isFullyPaid ? 'text-success' : 'text-loss'}`} />
              <span className={`text-2xl font-bold ${isFullyPaid ? 'text-success' : 'text-loss'}`}>
                ₹{summary.remaining.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{progressPercentage.toFixed(1)}%</span>
                <Badge variant={isFullyPaid ? "default" : "secondary"} className={isFullyPaid ? "bg-success" : ""}>
                  {isFullyPaid ? "Complete" : "Active"}
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${isFullyPaid ? 'bg-success' : 'bg-gradient-primary'}`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Info */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium text-muted-foreground">Phone</h3>
            <p className="text-lg">{customer.mobile}</p>
          </div>
          <div>
            <h3 className="font-medium text-muted-foreground">Address</h3>
            <p className="text-lg">{customer.address || "Not provided"}</p>
          </div>
          <div>
            <h3 className="font-medium text-muted-foreground">Loan Number</h3>
            <p className="text-lg font-mono">{customer.loanNo}</p>
          </div>
        </CardContent>
      </Card>

      {/* Add Payment Form */}
      {showAddPayment && (
        <AddPaymentForm
          customerId={customer.id}
          customerName={customer.name}
          onPaymentAdded={handlePaymentAdded}
          onClose={() => setShowAddPayment(false)}
        />
      )}

      {/* Action Button */}
      {!showAddPayment && !isFullyPaid && (
        <div className="flex justify-center">
          <Button
            variant="premium"
            size="lg"
            onClick={() => setShowAddPayment(true)}
            className="shadow-elevated"
          >
            <Plus className="h-5 w-5" />
            Add Payment
          </Button>
        </div>
      )}

      {/* Payment History */}
      <PaymentHistory 
        payments={payments} 
        monthlyTotals={summary.monthlyTotals}
      />
    </div>
  );
};