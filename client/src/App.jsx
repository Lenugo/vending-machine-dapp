import { useState } from 'react';
import './App.css';
import VendingMachine from './components/VendingMachine';
import PurchasesList from './components/PurchasesList';

function App() {
  const products = [
    { id: 'A1', price: 1.50, name: 'Lays', image: '/images/lays.png' },
    { id: 'A2', price: 1.75, name: 'Coca Cola', image: '/images/coca-cola.png' },
    { id: 'A3', price: 1.50, name: 'Pringles', image: '/images/pringles.png' },
    { id: 'A4', price: 1.75, name: 'Water', image: '/images/water.png' },
    { id: 'A5', price: 1.50, name: 'Energy Drink', image: '/images/red-bull.png' },
    { id: 'B1', price: 2.00, name: 'Sandwich', image: '/images/sandwich.png' },
    { id: 'B2', price: 1.75, name: 'Oreo', image: '/images/oreo.png' },
    { id: 'B3', price: 1.50, name: 'Sprite', image: '/images/sprite.png' },
    { id: 'B4', price: 1.75, name: 'Granola Bar', image: '/images/granola-bar.png' },
    { id: 'B5', price: 1.75, name: 'Doritos', image: '/images/doritos.png' },
    { id: 'C1', price: 1.50, name: 'Snicker Bar', image: '/images/snickers.png' },
    { id: 'C2', price: 1.50, name: 'M&Ms', image: '/images/m&ms.png' },
    { id: 'C3', price: 1.25, name: 'Bubble Tap Gum', image: '/images/bubble-tap.png' },
    { id: 'C4', price: 1.75, name: 'Fruit Nut Bar', image: '/images/fruit-nut.png' },
    { id: 'C5', price: 1.75, name: 'Beef Jerky', image: '/images/beef-jerky.png' },
    { id: 'D1', price: 1.25, name: 'KitKat Biscuit', image: '/images/kitkat.png' },
    { id: 'D2', price: 1.25, name: 'Pop Corn', image: '/images/popcorn.png' },
    { id: 'D3', price: 1.50, name: 'Twix Bar', image: '/images/twix.png' },
    { id: 'D4', price: 1.25, name: 'Donut', image: '/images/donut.png' },
    { id: 'D5', price: 1.25, name: 'Red Apple', image: '/images/apple.png' },
  ];

  const [wallet, setWallet] = useState({
    balance: 20.00,
    currentAmount: 0
  });

  const [purchases, setPurchases] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [showPurchases, setShowPurchases] = useState(false);

  const addMoney = (amount) => {
    setWallet({
      ...wallet,
      currentAmount: parseFloat((wallet.currentAmount + amount).toFixed(2))
    });
  };

  const addCustomAmount = (amount) => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      setWallet({
        ...wallet,
        currentAmount: parseFloat((wallet.currentAmount + parsedAmount).toFixed(2))
      });
    }
  };

  const selectProduct = (code) => {
    setSelectedProduct(code);
  };

  const clearSelection = () => {
    setSelectedProduct('');
  };

  const makePurchase = () => {
    if (!selectedProduct) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    if (wallet.currentAmount >= product.price) {
      const newPurchase = {
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        purchaseDate: new Date(),
        consumed: false
      };

      setPurchases([...purchases, newPurchase]);

      setWallet({
        ...wallet,
        balance: parseFloat((wallet.balance - product.price).toFixed(2)),
        currentAmount: parseFloat((wallet.currentAmount - product.price).toFixed(2))
      });

      setSelectedProduct('');
    }
  };

  const consumeItem = (purchaseId) => {
    setPurchases(purchases.map(purchase =>
      purchase.id === purchaseId
        ? { ...purchase, consumed: true }
        : purchase
    ));
  };

  return (
    <div className="app">
      {showPurchases ? (
        <PurchasesList
          purchases={purchases}
          onClose={() => setShowPurchases(false)}
          onConsume={consumeItem}
        />
      ) : (
        <VendingMachine
          products={products}
          wallet={wallet}
          selectedProduct={selectedProduct}
          onSelectProduct={selectProduct}
          onClearSelection={clearSelection}
          onPurchase={makePurchase}
          onAddMoney={addMoney}
          onAddCustomAmount={addCustomAmount}
          purchasesCount={purchases.filter(p => !p.consumed).length}
          onViewPurchases={() => setShowPurchases(true)}
        />
      )}
    </div>
  );
}

export default App;