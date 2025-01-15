```markdown
# Blockchain-Based Disaster Relief Fund

## Overview

This project is a **Blockchain-Based Disaster Relief Fund** platform that ensures transparency, security, and efficiency in the collection and distribution of disaster relief funds. The platform uses blockchain technology (Ethereum smart contracts) to track donations and fund distribution, while a web interface allows donors to contribute and recipients to access funds swiftly. Stripe API is used for secure payment processing.

## Features

- **Transparent Donation Tracking**: Track donations on the blockchain in real-time.
- **Automated Fund Distribution**: Smart contracts automate the distribution of funds to recipients.
- **Fraud Prevention**: Immutable and secure donation records on the blockchain.
- **Real-time Fund Access**: Instant fund transfer to recipients without bureaucratic delays.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express
- **Blockchain**: Ethereum, Solidity for smart contracts
- **Payment Gateway**: Stripe API
- **Database**: MongoDB
- **Web3**: For blockchain interaction
- **Smart Contracts**: Solidity

## Project Structure

```
/disaster-relief-fund
|-- /frontend            # React.js frontend
|-- /backend             # Node.js backend with Express
|-- /smart-contract      # Solidity smart contract
|-- .env                 # Environment variables for the project
|-- /contractABI.json    # ABI of the deployed smart contract
|-- /README.md           # This file
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/blockchain-disaster-relief-fund.git
cd blockchain-disaster-relief-fund
```

### 2. Set up the Backend

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file in the `/backend` folder with the following content:

```bash
MONGO_URI=mongodb://localhost:27017/disasterRelief
INFURA_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
SENDER_ADDRESS=YOUR_ETHEREUM_WALLET_ADDRESS
PRIVATE_KEY=YOUR_PRIVATE_KEY
```

- Replace `YOUR_INFURA_PROJECT_ID`, `YOUR_STRIPE_SECRET_KEY`, `YOUR_DEPLOYED_CONTRACT_ADDRESS`, `YOUR_ETHEREUM_WALLET_ADDRESS`, and `YOUR_PRIVATE_KEY` with your actual credentials.

3. Start the backend server:

```bash
npm start
```

The backend will run on `http://localhost:3000`.

### 3. Set up the Frontend

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Modify the `App.js` file to include your public Stripe key (`YOUR_PUBLIC_STRIPE_KEY`):

```javascript
<StripeCheckout
  stripeKey="YOUR_PUBLIC_STRIPE_KEY"
  token={handleDonation}
  amount={amount * 100} // in cents
  currency="USD"
  name="Disaster Relief Fund"
/>
```

3. Start the React app:

```bash
npm start
```

The frontend will be running on `http://localhost:3001`.

### 4. Deploy the Smart Contract

1. Compile and deploy the smart contract using [Truffle](https://www.trufflesuite.com/) or [Hardhat](https://hardhat.org/).

2. After deployment, copy the contract address and paste it into your `.env` file under the `CONTRACT_ADDRESS` variable.

### 5. Run the Application

1. Ensure the backend and frontend are running on their respective ports.
2. Navigate to the frontend in your browser at `http://localhost:3001`.
3. Users can donate using Stripe, and the system will track the donations on the Ethereum blockchain.

## Smart Contract Overview

The smart contract handles:

- **Donations**: Donors can send Ether to the contract, which will be recorded on the blockchain.
- **Fund Distribution**: The contract owner can distribute funds to recipients based on their needs.
- **Transaction Logs**: All donations and fund distributions are recorded on the blockchain, ensuring transparency.

Smart Contract Source (Solidity):

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DisasterReliefFund {
    address public owner;
    mapping(address => uint256) public donations;
    mapping(address => uint256) public reliefFunds;

    event DonationReceived(address indexed donor, uint256 amount);
    event FundDistributed(address indexed recipient, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than 0");
        donations[msg.sender] += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    function distributeFunds(address recipient, uint256 amount) external {
        require(msg.sender == owner, "Only owner can distribute funds");
        require(amount <= address(this).balance, "Insufficient funds in contract");

        payable(recipient).transfer(amount);
        reliefFunds[recipient] += amount;
        emit FundDistributed(recipient, amount);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getDonorContribution(address donor) external view returns (uint256) {
        return donations[donor];
    }

    function getRecipientFunds(address recipient) external view returns (uint256) {
        return reliefFunds[recipient];
    }
}
```

## Testing

- You can test the application by running a local Ethereum node using [Ganache](https://www.trufflesuite.com/ganache) or deploy it to an Ethereum testnet like [Rinkeby](https://www.rinkeby.io/).
- Make sure to adjust the `.env` file with your test network credentials and contract address.

## Contributing

Feel free to fork this repository, make improvements, and create pull requests. Contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

For any inquiries or questions, feel free to open an issue or contact me.
```

This `README.md` file outlines the project setup, installation steps, environment configuration, and basic instructions on using and contributing to the project. You can replace the placeholder text (like API keys and contract addresses) with actual values specific to your deployment.
