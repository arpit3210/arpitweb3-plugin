const Web3 = require('web3');

// (Optional) Define custom methods here

class Arpitweb3Plugin {
  constructor(provider) {
    this.web3 = new Web3(provider);
  }

  // Implement supported methods (replace with actual functionality)
  eth_call(tx) {
    return this.web3.eth.call(tx);
  }

  eth_estimateGas(tx) {
    return this.web3.eth.estimateGas(tx);
  }

  eth_sendTransaction(tx) {
    return this.web3.eth.sendTransaction(tx);
  }

  // Add custom methods here (if defined)
}

module.exports = Arpitweb3Plugin;