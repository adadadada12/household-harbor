
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal, Bell, Plus, Home, BarChart2, Settings } from 'lucide-react';
import SortingPopup from './SortingPopup';
import FilterPopup from './FilterPopup';
import NotificationPopup from './NotificationPopup';
import { useItems } from '@/context/ItemContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { 
    sortOption, 
    setSortOption, 
    filterOption, 
    setFilterOption,
    expiringItems,
    getExpiringItemsCount
  } = useItems();
  
  const [showSortPopup, setShowSortPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  
  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close sort popup
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortPopup(false);
      }
      
      // Close filter popup
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterPopup(false);
      }
      
      // Close notification popup
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close popups when navigating
  useEffect(() => {
    setShowSortPopup(false);
    setShowFilterPopup(false);
    setShowNotificationPopup(false);
  }, [location]);
  
  const togglePopup = (
    popupState: boolean,
    setPopupState: React.Dispatch<React.SetStateAction<boolean>>,
    otherSetPopupStates: Array<React.Dispatch<React.SetStateAction<boolean>>>
  ) => {
    // Close other popups
    otherSetPopupStates.forEach(setState => setState(false));
    
    // Toggle this popup
    setPopupState(!popupState);
  };
  
  const expiringCount = getExpiringItemsCount();
  const isHome = location.pathname === '/';
  
  return (
    <>
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold flex items-center">
              <span className="text-primary">Household Harbor</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-1 md:gap-3">
            {isHome && (
              <>
                <div className="relative" ref={filterRef}>
                  <Button 
                    variant={filterOption !== 'all' ? "default" : "outline"} 
                    size="icon"
                    onClick={() => togglePopup(
                      showFilterPopup, 
                      setShowFilterPopup, 
                      [setShowSortPopup, setShowNotificationPopup]
                    )}
                    className="rounded-full"
                  >
                    <Filter size={20} />
                  </Button>
                  
                  {showFilterPopup && (
                    <div className="absolute right-0 top-12 z-50">
                      <FilterPopup 
                        selectedOption={filterOption} 
                        onSelect={setFilterOption} 
                      />
                    </div>
                  )}
                </div>
                
                <div className="relative" ref={sortRef}>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => togglePopup(
                      showSortPopup, 
                      setShowSortPopup, 
                      [setShowFilterPopup, setShowNotificationPopup]
                    )}
                    className="rounded-full"
                  >
                    <SlidersHorizontal size={20} />
                  </Button>
                  
                  {showSortPopup && (
                    <div className="absolute right-0 top-12 z-50">
                      <SortingPopup 
                        selectedOption={sortOption} 
                        onSelect={setSortOption} 
                      />
                    </div>
                  )}
                </div>
                
                <div className="relative" ref={notificationRef}>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => togglePopup(
                      showNotificationPopup, 
                      setShowNotificationPopup, 
                      [setShowFilterPopup, setShowSortPopup]
                    )}
                    className="rounded-full"
                  >
                    <Bell size={20} />
                    {expiringCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {expiringCount > 9 ? '9+' : expiringCount}
                      </span>
                    )}
                  </Button>
                  
                  {showNotificationPopup && (
                    <div className="absolute right-0 top-12 z-50">
                      <NotificationPopup items={expiringItems} />
                    </div>
                  )}
                </div>
                
                <Button 
                  size="icon"
                  className="rounded-full"
                  onClick={() => {
                    // This will be handled by the Dashboard component
                    document.dispatchEvent(new Event('openAddItemModal'));
                  }}
                >
                  <Plus size={20} />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <nav className="bg-gray-50 py-2 fixed bottom-0 left-0 right-0 border-t z-10">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="flex gap-4">
            <Link to="/">
              <Button 
                variant={location.pathname === '/' ? "secondary" : "ghost"}
                className="flex flex-col items-center gap-1 h-auto py-2"
              >
                <Home size={20} />
                <span className="text-xs">Home</span>
              </Button>
            </Link>
            
            <Link to="/stats">
              <Button 
                variant={location.pathname === '/stats' ? "secondary" : "ghost"}
                className="flex flex-col items-center gap-1 h-auto py-2"
              >
                <BarChart2 size={20} />
                <span className="text-xs">Stats</span>
              </Button>
            </Link>
            
            <Link to="/settings">
              <Button 
                variant={location.pathname === '/settings' ? "secondary" : "ghost"}
                className="flex flex-col items-center gap-1 h-auto py-2"
              >
                <Settings size={20} />
                <span className="text-xs">Settings</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
