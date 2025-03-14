import './App.css';
import VendingMachine from './components/VendingMachine';
import PurchasesList from './components/PurchasesList';
import WalletConnect from './components/WalletConnect';
import useVendingMachine from './hooks/useVendingMachine';

function App() {
  const {
    selectedProduct,
    showPurchases,
    balance,
    products,
    isLoading,
    error,
    addMoney,
    selectProduct,
    clearSelection,
    makePurchase,
    consumeItem,
    loadInit,
    setShowPurchases
  } = useVendingMachine();

  return (
    <>
      <WalletConnect />
      <div className="app">
        <VendingMachine
          products={products}
          balance={balance}
          selectedProduct={selectedProduct}
          onSelectProduct={selectProduct}
          onClearSelection={clearSelection}
          onPurchase={makePurchase}
          onAddMoney={addMoney}
          onViewPurchases={() => setShowPurchases(true)}
          isLoading={isLoading}
          error={error}
          onRetry={loadInit}
        />
        {showPurchases &&
          <PurchasesList
            onClose={() => setShowPurchases(false)}
            onConsume={consumeItem}
          />}
      </div>
    </>
  );
}

export default App;