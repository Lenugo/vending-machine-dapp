function NoWeb3Provider() {
  return (
    <div className="no-web3-container">
      <div className="no-web3-content">
        <h2>MetaMask Required</h2>
        <p>Please install MetaMask to use this application.</p>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="install-button"
        >
          Install MetaMask
        </a>
      </div>
    </div>
  );
}

export default NoWeb3Provider;