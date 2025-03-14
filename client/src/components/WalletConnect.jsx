import { useState } from 'react';

const WalletConnect = () => {
  const [account, setAccount] = useState('');
  // console.log(account)

  const handleConnect = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('No web3 provider detected.')
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      window.ethereum.on('accountsChanged', function (accounts) {
        setAccount(accounts[0]);
      });

    } catch (err) {
      console.error('User denied account access', err);
    }
  };

  return (
    <div className="wallet-connect">
      <div className="wallet-connect__container">
        <h1>Smart Vending Machine</h1>
        <button onClick={handleConnect} className="wallet-connect__button">
          {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
        </button>
      </div>
    </div>
  );
};

export default WalletConnect;