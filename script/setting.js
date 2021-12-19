const path = require("path");
const fs = require("fs");
const { ethers } = require("ethers");
const { formatUnits, parseUnits } = require("ethers/lib/utils");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, '../.op.env') })

const provider = new ethers.providers.JsonRpcProvider(process.env.BSC_URL);
const signer = new ethers.Wallet(process.env.ADMIN_KEY, provider);
const baseAbiPath = path.join(__dirname, "..", "abi", "contracts");

const factoryABI = JSON.parse(fs.readFileSync(path.join(baseAbiPath, "auction", "AuctionFactory.sol/AuctionFactory.json")).toString()).abi;
const auctionABI = JSON.parse(fs.readFileSync(path.join(baseAbiPath, "auction", "Auction.sol/Auction.json")).toString()).abi;
const nftABI = JSON.parse(fs.readFileSync(path.join(baseAbiPath, "dependencies", "MvlNFT.sol/MvlNFT.json")).toString()).abi;
const mvlABI = JSON.parse(fs.readFileSync(path.join(baseAbiPath, "dependencies", "test/ERC20Test.sol/ERC20Test.json")).toString()).abi;
const oracleABI = JSON.parse(fs.readFileSync(path.join(baseAbiPath, "oracle", "MvlPriceOracle.sol/MvlPriceOracle.json")).toString()).abi;

const factoryC = new ethers.Contract(process.env.FACTORY_ADDR, factoryABI, signer);
const auctionC = new ethers.Contract(process.env.AUCTION_ADDR, auctionABI, signer);
const nftC = new ethers.Contract(process.env.NFT_ADDR, nftABI, signer);
const mvlC = new ethers.Contract(process.env.MVL_ADDR, mvlABI, signer);
const oracleC = new ethers.Contract(process.env.ORACLE_ADDR, oracleABI, signer);


const uintBig = (strNum) => {
    let bn = parseUnits(strNum, 18);
    return bn
}

const bigUint = (bn) => {return formatUnits(bn, 18)};

function decidePayback(amount, criteria) {
    let c = parseFloat(criteria);
    let a = parseFloat(amount);
    let res = 0
    if (a > c) {
        res = a - c
        return [res, 1];
    } else {
        return [res, 0];
    }
}

async function auctionCheck(id) {
    const addr = await factoryC.getAuctionAddress(id);
    const tmpC = new ethers.Contract(addr, auctionABI, signer);
    const info = await tmpC.getAuctionInformation()
    return info
}

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const q = (question) => {
    return new Promise(resolve => {
        rl.question(question, (answer) => {
        resolve(answer);
    });
});
};

const mywait = (delay) => {return new Promise(resolve =>setTimeout(resolve, 1000*delay))};

module.exports = {
    factoryC,
    auctionC,
    nftC,
    mvlC,
    oracleC,
    bigUint,
    uintBig,
    decidePayback,
    auctionCheck,
    rl,
    q,
    mywait
}