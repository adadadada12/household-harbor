
import React, { useState, useEffect } from 'react';
import { useItems } from '@/context/ItemContext';
import ItemCard from '@/components/ItemCard';
import ItemModal from '@/components/ItemModal';
import Navbar from '@/components/Navbar';
import CategoryFilterComponent from '@/components/CategoryFilter';
import EmptyState from '@/components/EmptyState';
import { Item } from '@/types';

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
  
  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setShowAddModal(true);
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <CategoryFilterComponent 
          selectedCategory={categoryFilter} 
          onChange={setCategoryFilter} 
        />
        
        {items.length === 0 ? (
          <EmptyState onAddItem={() => setShowAddModal(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>
        )}
      </main>
      
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
