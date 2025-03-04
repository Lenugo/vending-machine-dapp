import { useState } from 'react';

function VendingMachine({
  products,
  wallet,
  selectedProduct,
  onSelectProduct,
  onClearSelection,
  onPurchase,
  onAddMoney,
  onAddCustomAmount,
  purchasesCount,
  onViewPurchases
}) {
  const [customAmount, setCustomAmount] = useState('');

  const handleClear = () => {
    onClearSelection();
  };

  const handlePurchase = () => {
    onPurchase();
  };

  const handleAddCustomAmount = () => {
    onAddCustomAmount(parseFloat(customAmount));
    setCustomAmount('');
  };

  const rows = ['A', 'B', 'C', 'D'];
  const cols = [1, 2, 3, 4, 5];

  return (
    <div className="vending-machine">
      <h1>Smart Vending Machine</h1>

      <div className="main-content">
        <div className="products-section">
          <h2 className='products-section--title'>SNACKS & DRINKS</h2>

          <div className="products-grid">
            {rows.map(row => (
              <div key={row} className="product-row">
                {cols.map(col => {
                  const productId = `${row}${col}`;
                  const product = products.find(p => p.id === productId);

                  return (
                    <div
                      key={productId}
                      className={`product-item ${selectedProduct === productId ? 'selected' : ''}`}
                      onClick={() => {
                        onSelectProduct(productId);
                      }}
                    >
                      <div className="product-code">{productId}</div>
                      <div className="product-image">
                        <img src={product.image} alt={product.name} loading='eager' />
                      </div>
                      <div className="product-price">${product.price.toFixed(2)}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="control-section">
          <div className="keypad-section">
            <div className="display">
              <div className="display-text">
                {selectedProduct
                  ? `Selected: ${selectedProduct}`
                  : 'Select your favorite product'}
              </div>
            </div>

            <div className="keypad">
              <button
                className="keypad-button clear-button"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>

            <button
              className="purchase-button"
              onClick={handlePurchase}
              disabled={!selectedProduct || wallet.currentAmount < (products.find(p => p.id === selectedProduct)?.price || 0)}
            >
              Purchase
            </button>
          </div>

          <div className="payment-section">
            <h3>Payment System</h3>
            <div className="display">
              <div className="display-amount">${wallet.currentAmount.toFixed(2)}</div>
            </div>

            <div className="amount-input">
              <input
                type="number"
                placeholder="Amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
              <button
                className="add-button"
                onClick={handleAddCustomAmount}
              >
                Add
              </button>
            </div>

            <div className="quick-amounts">
              <button onClick={() => onAddMoney(1)}>$1</button>
              <button onClick={() => onAddMoney(5)}>$5</button>
              <button onClick={() => onAddMoney(10)}>$10</button>
            </div>
          </div>
        </div>
      </div>

      <button
        className="view-purchases-button"
        onClick={onViewPurchases}
      >
        View My Purchases ({purchasesCount})
      </button>
    </div>
  );
}

export default VendingMachine;