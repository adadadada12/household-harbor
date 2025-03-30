
import React, { useState, useEffect } from 'react';
import { useItems } from '@/context/ItemContext';
import ItemCard from '@/components/ItemCard';
import ItemModal from '@/components/ItemModal';
import Navbar from '@/components/Navbar';
import CategoryFilterComponent from '@/components/CategoryFilter';
import EmptyState from '@/components/EmptyState';
import { Item } from '@/types';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const { 
    addItem, 
    updateItem, 
    deleteItem, 
    categoryFilter, 
    setCategoryFilter,
    getFilteredAndSortedItems
  } = useItems();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
  
  // Listen for add item event from navbar
  useEffect(() => {
    const handleOpenAddModal = () => {
      setSelectedItem(undefined);
      setShowAddModal(true);
    };
    
    document.addEventListener('openAddItemModal', handleOpenAddModal);
    
    return () => {
      document.removeEventListener('openAddItemModal', handleOpenAddModal);
    };
  }, []);
  
  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setShowAddModal(true);
  };
  
  const handleDeleteItem = (id: string) => {
    deleteItem(id);
  };
  
  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedItem(undefined);
  };
  
  const handleSaveItem = (itemData: Omit<Item, 'id' | 'createdAt'>) => {
    if (selectedItem) {
      updateItem(selectedItem.id, itemData);
    } else {
      addItem(itemData);
    }
  };
  
  const items = getFilteredAndSortedItems();
  
  return (
    <div className="min-h-screen bg-gray-50 pb-28 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <CategoryFilterComponent 
          selectedCategory={categoryFilter} 
          onChange={setCategoryFilter} 
        />
        
        {items.length === 0 ? (
          <EmptyState onAddItem={() => setShowAddModal(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {items.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onEdit={() => handleEditItem(item)}
                onDelete={() => handleDeleteItem(item.id)}
              />
            ))}
          </div>
        )}
      </main>
      
      {/* Floating Action Button for adding items */}
      <Button
        onClick={() => setShowAddModal(true)}
        size="icon"
        className="h-14 w-14 rounded-full fixed bottom-20 right-5 shadow-lg z-10"
      >
        <Plus size={24} />
      </Button>
      
      <ItemModal 
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        onDelete={selectedItem ? deleteItem : undefined}
        item={selectedItem}
      />
    </div>
  );
};

export default Dashboard;
