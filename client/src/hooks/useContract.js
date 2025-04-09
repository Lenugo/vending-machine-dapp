import { useWeb3 } from '../context/web3context';
import Web3 from 'web3';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';

const useContract = () => {
  const { 
    account, 
    setAccount, 
    contract, 
    setContract, 
    web3, 
    setWeb3 
  } = useWeb3();

  const handleConnect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      
      try {
        const contractInstance = new web3Instance.eth.Contract(
          CONTRACT_ABI,
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);

        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);        
        window.ethereum.on('accountsChanged', (newAccounts) => {
          setAccount(newAccounts[0] || '');
        });
      } catch {
        throw new Error('User denied account access');
      }
    }
  };

  const getAllProducts = async () => {
    if (!contract) return [];
    
    try {
      const products = await contract.methods.getAllProducts().call();
      return products.map(product => ({
        code: product.code,
        price: web3.utils.fromWei(product.price, 'gwei'),
        name: product.name,
        image: product.imageCID
      }));
    } catch (error) {
      console.error('Failed to fetch products:', error)
      return [];
    }
  };

  const getBalance = async () => {
    if (!contract || !account) return '0';

    try {
      const balance = await contract.methods.getBalance().call({ from: account });
      return web3.utils.fromWei(balance, 'gwei');
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      return '0';
    }
  };

  const purchaseProduct = async (code) => {
    if (!contract || !account) return false;
    
    try {
      await contract.methods.purchaseProduct(code).send({
        from: account,
        gas: 300000
      });
      
      return true;
    } catch (error) {
      console.error('Product purchase failed:', error);
      return false;
    }
  };

  const addFunds = async (funds) => {
    if (!contract || !account) return;

    try {
      const fundsInGwei = web3.utils.toWei(funds.toString(), 'gwei');
      
      await contract.methods.addFunds().send({
        from: account,
        value: fundsInGwei
      });
    } catch (error) {
      console.error('Balance addition failed:', error);
      return;
    }
  };

  const getPurchases = async () => {
    if (!contract || !account) return [];

    try {
      const purchases = await contract.methods.getAllPurchases(account).call({ from: account });
      return purchases.map(purchase => ({
        id: purchase.id,
        name: purchase.name,
        image: purchase.image,
        price: web3.utils.fromWei(purchase.price, 'gwei'),
        date: purchase.purchaseDate,
        consumed: purchase.consumed
      }));
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
      return [];
    }
  };

  const consumeProduct = async (index) => {
    if (!contract || !account) return;

    try {
      await contract.methods.consumePurchase(index).send({ from: account });
    } catch (error) {
      console.error('Product consumption failed:', error);
      return;
    }
  }

  return {
    contract,
    web3,
    account,
    getAllProducts,
    getBalance,
    purchaseProduct,
    getPurchases,
    consumeProduct,
    addFunds,
    handleConnect
  };
};

export default useContract;