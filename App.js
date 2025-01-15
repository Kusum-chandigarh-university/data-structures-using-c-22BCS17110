import React, { useState } from 'react';
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

const App = () => {
    const [amount, setAmount] = useState(0);
    const [donorAddress, setDonorAddress] = useState('');

    const handleDonation = async (token) => {
        try {
            const response = await axios.post('http://localhost:3000/donate', {
                amount,
                token: token.id,
            });
            alert('Donation successful: ' + response.data.message);
        } catch (error) {
            alert('Donation failed: ' + error.response.data.message);
        }
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    return (
        <div className="App">
            <h1>Blockchain-based Disaster Relief Fund</h1>
            <input 
                type="number" 
                value={amount} 
                onChange={handleAmountChange} 
                placeholder="Enter donation amount" 
            />
            <StripeCheckout
                stripeKey="YOUR_PUBLIC_STRIPE_KEY"
                token={handleDonation}
                amount={amount * 100} // in cents
                currency="USD"
                name="Disaster Relief Fund"
            />
        </div>
    );
};

export default App;
