import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { customerAPI, CreateCustomerData } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";

interface AddCustomerFormProps {
  onCustomerAdded: () => void;
  onClose?: () => void;
}

export const AddCustomerForm = ({ onCustomerAdded, onClose }: AddCustomerFormProps) => {
  const [formData, setFormData] = useState<CreateCustomerData>({
    name: "",
    address: "",
    mobile: "",
    loanNo: "",
    loanAmount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile || !formData.loanNo || formData.loanAmount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields with valid data.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await customerAPI.create(formData);
      toast({
        title: "Customer Added Successfully",
        description: `${formData.name} has been added to the system.`,
      });
      
      // Reset form
      setFormData({
        name: "",
        address: "",
        mobile: "",
        loanNo: "",
        loanAmount: 0,
      });
      
      onCustomerAdded();
      onClose?.();
    } catch (error) {
      console.error("Error adding customer:", error);
      toast({
        title: "Error",
        description: "Failed to add customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof CreateCustomerData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-card shadow-premium animate-slide-up">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Add New Customer
        </CardTitle>
        <CardDescription>
          Enter customer details to create a new loan account
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter customer name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
                placeholder="Enter mobile number"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loanNo">Loan Number *</Label>
              <Input
                id="loanNo"
                type="text"
                value={formData.loanNo}
                onChange={(e) => handleChange("loanNo", e.target.value)}
                placeholder="Enter loan number"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Loan Amount (₹) *</Label>
              <Input
                id="loanAmount"
                type="number"
                min="1"
                value={formData.loanAmount || ""}
                onChange={(e) => handleChange("loanAmount", parseInt(e.target.value) || 0)}
                placeholder="Enter loan amount"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter customer address"
              className="min-h-[80px]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="premium"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding Customer...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Customer
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};