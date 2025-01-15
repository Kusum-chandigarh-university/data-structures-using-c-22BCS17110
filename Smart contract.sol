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

    // Function to donate to the disaster relief fund
    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than 0");
        donations[msg.sender] += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    // Admin function to distribute funds to a recipient
    function distributeFunds(address recipient, uint256 amount) external {
        require(msg.sender == owner, "Only owner can distribute funds");
        require(amount <= address(this).balance, "Insufficient funds in contract");

        payable(recipient).transfer(amount);
        reliefFunds[recipient] += amount;
        emit FundDistributed(recipient, amount);
    }

    // Function to get the total balance of the contract
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Function to view total donations by a donor
    function getDonorContribution(address donor) external view returns (uint256) {
        return donations[donor];
    }

    // Function to view relief funds of a recipient
    function getRecipientFunds(address recipient) external view returns (uint256) {
        return reliefFunds[recipient];
    }
}
