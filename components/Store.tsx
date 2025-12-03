import React, { useState } from 'react';
import { Search, ShoppingCart, Info, Plus, Check } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import { UserEvent, Product } from '../types';

interface StoreProps {
  trackEvent: (type: UserEvent['type'], details: string) => void;
}

const Store: React.FC<StoreProps> = ({ trackEvent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [addedItems, setAddedItems] = useState<number[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      trackEvent('SEARCH', `User searched for query: "${searchTerm}"`);
    }
  };

  const handleProductClick = (product: Product) => {
    trackEvent('CLICK', `Clicked product: ${product.name} (${product.category})`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Prevent triggering card click
    setCartCount(prev => prev + 1);
    trackEvent('ADD_TO_CART', `Added to cart: ${product.name} - $${product.price}`);
    
    // Visual feedback
    setAddedItems(prev => [...prev, product.id]);
    setTimeout(() => {
        setAddedItems(prev => prev.filter(id => id !== product.id));
    }, 1500);
  };

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight">ShopSmart</span>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 relative text-gray-800">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full pl-4 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-2 text-gray-500 hover:text-blue-600">
              <Search size={20} />
            </button>
          </form>

          <div className="relative">
            <ShoppingCart className="cursor-pointer hover:text-blue-200" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-6">
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-sm text-blue-800 flex items-start gap-2">
          <Info size={16} className="mt-1 flex-shrink-0" />
          <p>
            <strong>Simulation Mode:</strong> Interact with this store like a real user. 
            Search for items, click cards, or add to cart. Every action is being recorded 
            for the AI Analyst in the Dashboard.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group border border-gray-100"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {product.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-blue-900">${product.price.toFixed(2)}</span>
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className={`p-2 rounded-full transition-all duration-300 ${
                        addedItems.includes(product.id)
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-100 hover:bg-blue-600 hover:text-white'
                    }`}
                    aria-label="Add to cart"
                  >
                    {addedItems.includes(product.id) ? <Check size={18} /> : <Plus size={18} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p>No products found matching "{searchTerm}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Store;