
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addedAt: string;
}

interface CustomerManagerProps {
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id' | 'addedAt'>) => void;
  onDeleteCustomer: (customerId: string) => void;
  selectedCustomers: string[];
  onSelectCustomers: (customerIds: string[]) => void;
}

const CustomerManager: React.FC<CustomerManagerProps> = ({
  customers,
  onAddCustomer,
  onDeleteCustomer,
  selectedCustomers,
  onSelectCustomers
}) => {
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
  const { toast } = useToast();

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive"
      });
      return;
    }

    onAddCustomer(newCustomer);
    setNewCustomer({ name: '', email: '', phone: '' });
    toast({
      title: "Customer Added",
      description: "Customer has been added successfully"
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectCustomers(customers.map(c => c.id));
    } else {
      onSelectCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      onSelectCustomers([...selectedCustomers, customerId]);
    } else {
      onSelectCustomers(selectedCustomers.filter(id => id !== customerId));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add New Customer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCustomer} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Customer Name"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              required
            />
            <Input
              placeholder="Phone (Optional)"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            />
            <Button type="submit">Add Customer</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Customer List ({customers.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedCustomers.length === customers.length && customers.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm">Select All</span>
            </div>
          </div>
          <CardDescription>
            {selectedCustomers.length > 0 && (
              <Badge variant="secondary">
                {selectedCustomers.length} customers selected
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No customers added yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {customers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked as boolean)}
                    />
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                      {customer.phone && (
                        <p className="text-xs text-gray-500">{customer.phone}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteCustomer(customer.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManager;
