// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Cagnotte is Ownable {
    uint256 public goal;

    mapping(address => uint256) public given;

    event Deposit(address indexed depositor, uint256 amount);
    event Withdrawal(address indexed withdrawer, uint256 amount);

    constructor(uint256 _goal) Ownable(msg.sender) {
        require(_goal > 0, "Goal must be greater than 0");
        goal = _goal;
    }

    function deposit() external payable {
        require(msg.value > 0, "Deposit must be greater than 0");
        given[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance >= goal, "Goal not reached");

        (bool sent, ) = msg.sender.call{value: balance}("");
        require(sent, "Failed to send Ether");

        emit Withdrawal(msg.sender, balance);
    }
}
