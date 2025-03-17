import './App.css';
import VendingMachine from './components/VendingMachine';
import PurchasesList from './components/PurchasesList';
import WalletConnect from './components/WalletConnect';
import useVendingMachine from './hooks/useVendingMachine';
import NoWeb3Provider from './components/NoWeb3Provider';
import NoContract from './components/NoContract';
import useContract from './hooks/useContract';

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

  const { account } = useContract();

  if (typeof window.ethereum === 'undefined' && !isLoading) {
    return <NoWeb3Provider />
  }

  return (
    <>
      <WalletConnect />
      {(!account && !isLoading) ?
        <NoContract /> :
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
      }
    </>
  );
}

export default App;