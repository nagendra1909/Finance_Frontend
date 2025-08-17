import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { customerAPI, Customer } from "@/services/api";
import { CustomerCard } from "./CustomerCard";
import { CustomerDetails } from "./CustomerDetails";
import { AddCustomerForm } from "./AddCustomerForm";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Plus, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  Filter,
  RefreshCw
} from "lucide-react";

export const Dashboard = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const { toast } = useToast();

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await customerAPI.getAll();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error("Error loading customers:", error);
      toast({
        title: "Error",
        description: "Failed to load customers. Please check if the backend server is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    let filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.loanNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobile.includes(searchTerm)
    );

    if (filter !== 'all') {
      filtered = filtered.filter(customer => {
        const totalPaid = customer.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
        const remaining = customer.loanAmount - totalPaid;
        
        if (filter === 'completed') return remaining <= 0;
        if (filter === 'active') return remaining > 0;
        return true;
      });
    }

    setFilteredCustomers(filtered);
  }, [searchTerm, customers, filter]);

  const handleCustomerAdded = () => {
    loadCustomers();
    setShowAddForm(false);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleBackToDashboard = () => {
    setSelectedCustomer(null);
    loadCustomers(); // Refresh data when coming back
  };

  // Calculate statistics
  const totalCustomers = customers.length;
  const totalLoanAmount = customers.reduce((sum, c) => sum + c.loanAmount, 0);
  const totalPaid = customers.reduce((sum, c) => 
    sum + (c.payments?.reduce((pSum, p) => pSum + p.amount, 0) || 0), 0
  );
  const totalRemaining = totalLoanAmount - totalPaid;
  const completedLoans = customers.filter(c => {
    const paid = c.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    return (c.loanAmount - paid) <= 0;
  }).length;

  if (selectedCustomer) {
    return (
      <CustomerDetails
        customer={selectedCustomer}
        onBack={handleBackToDashboard}
        onUpdate={loadCustomers}
      />
    );
  }

  if (showAddForm) {
    return (
      <div className="container mx-auto px-4 py-6">
        <AddCustomerForm
          onCustomerAdded={handleCustomerAdded}
          onClose={() => setShowAddForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Loan Management System</h1>
              <p className="text-primary-foreground/80">
                Manage customer loans and track payments efficiently
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={loadCustomers}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button 
                variant="premium"
                onClick={() => setShowAddForm(true)}
                className="shadow-elevated bg-white text-primary hover:bg-white/90"
              >
                <Plus className="h-4 w-4" />
                Add Customer
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gradient-primary">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-bold">{totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gradient-success">
                  <DollarSign className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Loan Amount</p>
                  <p className="text-2xl font-bold">₹{totalLoanAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-success">
                  <TrendingUp className="h-6 w-6 text-success-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Collected</p>
                  <p className="text-2xl font-bold text-success">₹{totalPaid.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-warning">
                  <Target className="h-6 w-6 text-warning-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed Loans</p>
                  <p className="text-2xl font-bold">{completedLoans}/{totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-gradient-card shadow-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, loan number, or mobile..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filter === 'active' ? 'default' : 'outline'}
                  onClick={() => setFilter('active')}
                  size="sm"
                >
                  Active
                </Button>
                <Button
                  variant={filter === 'completed' ? 'default' : 'outline'}
                  onClick={() => setFilter('completed')}
                  size="sm"
                >
                  Completed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading customers...</p>
            </div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm || filter !== 'all' ? 'No customers found' : 'No customers yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first customer'
                }
              </p>
              {!searchTerm && filter === 'all' && (
                <Button variant="premium" onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4" />
                  Add First Customer
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer, index) => (
              <div 
                key={customer.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CustomerCard
                  customer={customer}
                  onViewDetails={handleViewCustomer}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};