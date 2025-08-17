import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Customer } from "@/services/api";
import { Eye, Phone, MapPin, CreditCard } from "lucide-react";

interface CustomerCardProps {
  customer: Customer;
  onViewDetails: (customer: Customer) => void;
}

export const CustomerCard = ({ customer, onViewDetails }: CustomerCardProps) => {
  const totalPaid = customer.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const remaining = customer.loanAmount - totalPaid;
  const progressPercentage = (totalPaid / customer.loanAmount) * 100;

  const getStatusColor = () => {
    if (remaining <= 0) return "bg-success";
    if (progressPercentage < 25) return "bg-loss";
    if (progressPercentage < 75) return "bg-warning";
    return "bg-pending";
  };

  const getStatusText = () => {
    if (remaining <= 0) return "Fully Paid";
    if (progressPercentage < 25) return "Just Started";
    if (progressPercentage < 75) return "In Progress";
    return "Almost Done";
  };

  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-card-foreground">
              {customer.name}
            </CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <CreditCard className="h-3 w-3" />
              <span>Loan #{customer.loanNo}</span>
            </div>
          </div>
          <Badge variant="secondary" className={`${getStatusColor()} text-white`}>
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Loan Amount</div>
            <div className="font-semibold text-lg">₹{customer.loanAmount.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Remaining</div>
            <div className={`font-semibold text-lg ${remaining <= 0 ? 'text-success' : 'text-loss'}`}>
              ₹{remaining.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${getStatusColor()}`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{customer.mobile}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{customer.address}</span>
          </div>
        </div>

        <Button 
          variant="finance"
          className="w-full"
          onClick={() => onViewDetails(customer)}
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};