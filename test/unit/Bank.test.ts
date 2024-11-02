import { expect, assert } from "chai";
import hre from "hardhat";
import { Bank } from "../../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Test Bank Contract", function () {
    let deployedContract: Bank;
    let owner: SignerWithAddress, addr1: SignerWithAddress, addr2: SignerWithAddress;

    describe('Initialization', function () {
        this.beforeEach(async function () {
            [owner, addr1, addr2] = await hre.ethers.getSigners();
            let Bank = await hre.ethers.deployContract("Bank");
            deployedContract = Bank;
        })

        it('should deploy the contract and get the owner', async function () {
            let theOwner = await deployedContract.owner()
            assert(owner.address === theOwner)

        });
    })

    describe('Deposit', function () {
        this.beforeEach(async function () {
            [owner, addr1, addr2] = await hre.ethers.getSigners();
            let Bank = await hre.ethers.deployContract("Bank");
            deployedContract = Bank;
        })

        it('should NOT deposit Ethers on the Bank contract if NOT the Owner', async function () {
            let weiQuantity = hre.ethers.parseEther('0.1'); // WEI and NOT ETHER should be given to the contract
            console.log(typeof weiQuantity)
            console.log(weiQuantity)

            await expect(
                deployedContract
                    .connect(addr1)
                    .deposit({ value: weiQuantity }))
                .to.be.revertedWithCustomError(deployedContract, "OwnableUnauthorizedAccount").withArgs(addr1.address)
        });

        it('should NOT deposit Ethers if not enough funds are provided', async function () {
            let weiQuantity = hre.ethers.parseEther('0.09'); // WEI and NOT ETHER should be given to the contract

            await expect(
                deployedContract
                    .deposit({ value: weiQuantity }))
                .to.be.revertedWith('Not enough funds provided')

        });

        it('should deposit Ethers if Owner and if enough funds are provided', async function () {
            let weiQuantity = hre.ethers.parseEther('0.19');
            await expect(
                deployedContract
                    .connect(owner)
                    .deposit({ value: weiQuantity }))
                .to.emit(deployedContract, 'Deposit')
                .withArgs(owner.address, weiQuantity)

            let balance = await hre.ethers.provider.getBalance(deployedContract.target);
            assert(balance === weiQuantity);
        });
    })

    describe('Withdraw', function () {
        this.beforeEach(async function () {
            [owner, addr1, addr2] = await hre.ethers.getSigners();
            let Bank = await hre.ethers.deployContract("Bank");
            deployedContract = Bank;
            let weiQuantity = hre.ethers.parseEther('0.19');
            let transaction = await deployedContract.deposit({ value: weiQuantity })
            await transaction.wait(); // === transaction.wait(1), 1 c'est le nombre de block que j'attends, on l'utilise dans le cas d'un test de script de deploiement et verification de contract 
        })

        it('should not Withdraw if NOT the Owner', async function () {
            let weiQuantity = hre.ethers.parseEther('0.19');

            await expect(
                deployedContract
                    .connect(addr1)
                    .withdraw(weiQuantity))
                .to.be.revertedWithCustomError(deployedContract, "OwnableUnauthorizedAccount").withArgs(addr1.address)
        });

        it('should NOT withdraw if the Owner try to withdraw too many Ethers', async function () {
            let weiQuantity = hre.ethers.parseEther('1.66');

            await expect(deployedContract.withdraw(weiQuantity))
                .to.be.revertedWith("You cannot withdraw this amount")
        });

        it('should withdraw if the owner try withdraw and the amount is correct', async function () {
            let weiQuantity = hre.ethers.parseEther('0.05');
            let expectedBalanceAfterWithdraw = hre.ethers.parseEther('0.14');

            await expect(deployedContract.withdraw(weiQuantity))
                .to.emit(deployedContract, 'Withdraw').withArgs(owner.address, weiQuantity)

            let balanceContract = await hre.ethers.provider.getBalance(deployedContract.target);
            assert(balanceContract === expectedBalanceAfterWithdraw) // 0.19 - 0.05 = 0.14
        });
    })
})
