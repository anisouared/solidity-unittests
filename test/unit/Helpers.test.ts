import { mine, mineUpTo, time, setBalance } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { assert, expect } from "chai";

describe('Tests Helpers', function () {
    it('should test the mine function', async function () {
        let latestBlock = await ethers.provider.getBlock('latest');
        console.log("Initial timestamp: ", latestBlock?.timestamp);
        console.log("Initial block number: ", latestBlock?.number);

        await mine(1000, { interval: 15 });
        latestBlock = await ethers.provider.getBlock('latest');
        console.log("new timestamp:", latestBlock?.timestamp);
        console.log("New block  number:", latestBlock?.number);

        await mineUpTo(12345);
        latestBlock = await ethers.provider.getBlock('latest');
        console.log("New timestamp:", latestBlock?.timestamp);
        console.log("New block  number:", latestBlock?.number);

        await time.increase(3600);
        latestBlock = await ethers.provider.getBlock('latest');
        console.log("New timestamp", latestBlock?.timestamp);

        const [owner, addr1] = await ethers.getSigners();
        let balance = await ethers.provider.getBalance(owner.address);
        console.log(balance);
        await setBalance(owner.address, 77);
        balance = await ethers.provider.getBalance(owner.address);
        console.log(balance);

        //let tenEthers = ethers.parseEther('10');

        await setBalance(owner.address, 10n * (10n ** 18n));
        balance = await ethers.provider.getBalance(owner.address);
        let balanceInEth = await ethers.formatEther(balance);
        console.log(balance);
        console.log(balanceInEth);
    })

})