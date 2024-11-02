// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Bank is Ownable {
    event Deposit(address indexed _from, uint256 _value);
    event Withdraw(address indexed _from, uint256 _value);

    constructor() Ownable(msg.sender) {}

    function deposit() external payable onlyOwner {
        require(msg.value >= 0.1 ether, "Not enough funds provided");
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 _amount) external onlyOwner {
        require(
            _amount <= address(this).balance,
            "You cannot withdraw this amount"
        );
        (bool received, ) = msg.sender.call{value: _amount}("");
        require(received, "The withdraw did not work");
        emit Withdraw(msg.sender, _amount);
    }
}
