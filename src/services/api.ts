import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Customer {
  id: number;
  name: string;
  address: string;
  mobile: string;
  loanNo: string;
  loanAmount: number;
  payments?: Payment[];
}

export interface Payment {
  id: number;
  customerId: number;
  amount: number;
  date: string;
}

export interface CustomerSummary {
  customer: string;
  loanAmount: number;
  totalPaid: number;
  remaining: number;
  monthlyTotals: Record<string, number>;
}

export interface CreateCustomerData {
  name: string;
  address: string;
  mobile: string;
  loanNo: string;
  loanAmount: number;
}

export interface CreatePaymentData {
  customerId: number;
  amount: number;
}

// Customer APIs
export const customerAPI = {
  getAll: async (): Promise<Customer[]> => {
    const response = await api.get('/customers');
    return response.data;
  },

  create: async (data: CreateCustomerData): Promise<Customer> => {
    const response = await api.post('/customers', data);
    return response.data;
  },

  getSummary: async (id: number): Promise<CustomerSummary> => {
    const response = await api.get(`/customers/${id}/summary`);
    return response.data;
  },

  getPayments: async (id: number): Promise<Payment[]> => {
    const response = await api.get(`/customers/${id}/payments`);
    return response.data;
  },
};

// Payment APIs
export const paymentAPI = {
  create: async (data: CreatePaymentData): Promise<Payment> => {
    const response = await api.post('/payments', data);
    return response.data;
  },
};

export default api;