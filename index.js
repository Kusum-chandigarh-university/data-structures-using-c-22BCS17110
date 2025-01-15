const express = require('express');
const mongoose = require('mongoose');
const Web3 = require('web3');
const Stripe = require('stripe');
require('dotenv').config();

// Initialize Express app
const app = express();
const port = 3000;

// Set up body parser for POST requests
app.use(express.json());

// Stripe configuration
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Web3 configuration for Ethereum
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = require('./contractABI.json');
const contract = new web3.eth.Contract(contractABI, contractAddress);
const senderAddress = process.env.SENDER_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;

// Mongoose connection for MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Donation schema
const Donation = mongoose.model('Donation', new mongoose.Schema({
    donor: String,
    amount: Number,
    transactionId: String,
}));

// Routes

// Route for handling Stripe donation payments
app.post('/donate', async (req, res) => {
    const { amount, token } = req.body;

    try {
        // Process the Stripe payment
        const charge = await stripe.charges.create({
            amount: amount * 100, // Stripe charges in cents
            currency: 'usd',
            source: token,
            description: 'Disaster Relief Fund Donation',
        });

        // Record the donation in MongoDB
        const donation = new Donation({
            donor: charge.source.name,
            amount: charge.amount / 100, // Convert from cents to dollars
            transactionId: charge.id,
        });
        await donation.save();

        // Donate to the blockchain smart contract
        const valueInWei = web3.utils.toWei(amount.toString(), 'ether');
        const tx = contract.methods.donate().send({
            from: senderAddress,
            value: valueInWei,
            gas: 2000000,
            gasPrice: '20000000000', // Adjust as necessary
        });

        tx.on('transactionHash', (hash) => {
            console.log('Transaction Hash:', hash);
        });

        tx.on('receipt', (receipt) => {
            res.status(200).json({
                message: 'Donation successful!',
                receipt,
            });
        });

        tx.on('error', (error) => {
            console.error(error);
            res.status(500).json({ message: 'Transaction failed' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Donation failed' });
    }
});

// Route for distributing funds (admin only)
app.post('/distribute', async (req, res) => {
    const { recipient, amount } = req.body;

    try {
        const valueInWei = web3.utils.toWei(amount.toString(), 'ether');
        const tx = contract.methods.distributeFunds(recipient, valueInWei).send({
            from: senderAddress,
            gas: 2000000,
            gasPrice: '20000000000',
        });

        tx.on('receipt', (receipt) => {
            res.status(200).json({ message: 'Funds distributed successfully', receipt });
        });

        tx.on('error', (error) => {
            console.error(error);
            res.status(500).json({ message: 'Fund distribution failed' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error distributing funds' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
