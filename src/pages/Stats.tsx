
import React from 'react';
import Navbar from '@/components/Navbar';
import { useItems } from '@/context/ItemContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { isItemExpired, isItemExpiring, calculateDaysUntilExpiry } from '@/utils/itemUtils';
import { Apple, Pill, AlertTriangle, Clock } from 'lucide-react';

const Stats: React.FC = () => {
  const { items } = useItems();
  
  // Calculate stats
  const totalItems = items.length;
  const foodItems = items.filter(item => item.category === 'food').length;
  const householdItems = items.filter(item => item.category === 'household').length;
  const expiredItems = items.filter(isItemExpired).length;
  const expiringItems = items.filter(isItemExpiring).length;
  
  // Category data for pie chart
  const categoryData = [
    { name: 'Food', value: foodItems, color: '#8BC34A' },
    { name: 'Household', value: householdItems, color: '#42A5F5' },
  ];
  
  // Status data for pie chart
  const statusData = [
    { name: 'Good', value: totalItems - expiringItems - expiredItems, color: '#4CAF50' },
    { name: 'Expiring Soon', value: expiringItems, color: '#FFA726' },
    { name: 'Expired', value: expiredItems, color: '#EF5350' },
  ];
  
  // Calculate expiry distribution for bar chart
  const expiryDistribution = () => {
    const distribution: Record<string, number> = {
      'Expired': 0,
      '0-1 days': 0,
      '2-4 days': 0,
      '5-7 days': 0,
      '8-14 days': 0,
      '15-30 days': 0,
      '30+ days': 0
    };
    
    items.forEach(item => {
      const days = calculateDaysUntilExpiry(item.expireDate);
      
      if (days < 0) distribution['Expired']++;
      else if (days <= 1) distribution['0-1 days']++;
      else if (days <= 4) distribution['2-4 days']++;
      else if (days <= 7) distribution['5-7 days']++;
      else if (days <= 14) distribution['8-14 days']++;
      else if (days <= 30) distribution['15-30 days']++;
      else distribution['30+ days']++;
    });
    
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  };
  
  const distributionData = expiryDistribution();
  
  // Bar chart colors based on expiry timeframes
  const getBarColor = (name: string) => {
    switch (name) {
      case 'Expired': return '#EF5350';
      case '0-1 days': return '#FF7043';
      case '2-4 days': return '#FFA726';
      case '5-7 days': return '#FFCA28';
      case '8-14 days': return '#9CCC65';
      case '15-30 days': return '#66BB6A';
      case '30+ days': return '#26A69A';
      default: return '#4CAF50';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Item Statistics</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-1">
                <AlertTriangle size={16} className="text-expire-red" /> Expired
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-expire-red">{expiredItems}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock size={16} className="text-expire-orange" /> Expiring Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-expire-orange">{expiringItems}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-lg">Items by Category</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Apple size={16} className="text-food" />
                  <span>Food: {foodItems}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Pill size={16} className="text-household" />
                  <span>Household: {householdItems}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Status Distribution */}
          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-lg">Item Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Expiry Distribution Chart */}
        <Card className="p-4 mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Expiry Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Stats;
