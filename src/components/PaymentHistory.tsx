import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Payment } from "@/services/api";
import { Calendar, TrendingUp, Receipt } from "lucide-react";

interface PaymentHistoryProps {
  payments: Payment[];
  monthlyTotals: Record<string, number>;
}

export const PaymentHistory = ({ payments, monthlyTotals }: PaymentHistoryProps) => {
  const sortedPayments = [...payments].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Monthly Summary */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Monthly Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.keys(monthlyTotals).length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No payments recorded yet</p>
          ) : (
            Object.entries(monthlyTotals)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([month, total]) => (
                <div key={month} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{formatMonth(month)}</p>
                  </div>
                  <Badge variant="secondary" className="bg-gradient-success text-secondary-foreground">
                    ₹{total.toLocaleString()}
                  </Badge>
                </div>
              ))
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="bg-gradient-card shadow-card lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Recent Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedPayments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No payments recorded yet</p>
              <p className="text-sm text-muted-foreground">Add the first payment to get started</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sortedPayments.map((payment, index) => (
                <div 
                  key={payment.id} 
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50 hover:shadow-card transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gradient-success">
                      <Receipt className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Payment #{payment.id}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(payment.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-success">₹{payment.amount.toLocaleString()}</p>
                    <Badge variant="outline" className="text-xs">
                      Payment
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};