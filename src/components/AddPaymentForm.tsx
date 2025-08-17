import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { paymentAPI, CreatePaymentData } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, DollarSign, X } from "lucide-react";

interface AddPaymentFormProps {
  customerId: number;
  customerName: string;
  onPaymentAdded: () => void;
  onClose: () => void;
}

export const AddPaymentForm = ({ customerId, customerName, onPaymentAdded, onClose }: AddPaymentFormProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const paymentData: CreatePaymentData = {
        customerId,
        amount,
      };
      
      await paymentAPI.create(paymentData);
      
      toast({
        title: "Payment Added Successfully",
        description: `₹${amount.toLocaleString()} payment has been recorded for ${customerName}.`,
      });
      
      setAmount(0);
      onPaymentAdded();
    } catch (error) {
      console.error("Error adding payment:", error);
      toast({
        title: "Error",
        description: "Failed to add payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-card shadow-elevated animate-slide-up">
      <CardHeader className="text-center relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-2 top-2"
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle className="text-xl font-bold text-card-foreground">
          Add Payment
        </CardTitle>
        <CardDescription>
          Record a new payment for {customerName}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount (₹)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                min="1"
                step="1"
                value={amount || ""}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                placeholder="Enter payment amount"
                className="pl-10"
                required
                autoFocus
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the amount in Indian Rupees (₹)
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              className="flex-1"
              disabled={isLoading || amount <= 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4" />
                  Add Payment
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};