import fs from 'fs';
import path from 'path';
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, '../.op.env') });
import {ethers} from 'ethers';

import { auctionLogger } from './config/logger';

const provider = new ethers.providers.JsonRpcProvider(process.env.BSC_URL);
const signer = new ethers.Wallet(process.env.ADMIN_KEY as string, provider);
const baseAbiPath = path.join(__dirname, "..", "abi", "contracts");
const factoryABI = JSON.parse(fs.readFileSync(path.join(baseAbiPath, "auction", "AuctionFactory.sol/AuctionFactory.json")).toString()).abi;
const factoryC = new ethers.Contract(process.env.FACTORY_ADDR as string, factoryABI, signer);
const big18Uint = (bn: any) => {return ethers.utils.formatUnits(bn, 18)};
const bigUint = (bn: any) => {return ethers.utils.formatUnits(bn, 0)};

const filter = {
    address: process.env.FACTORY_ADDR,
    topics: [
        ethers.utils.id("AuctionCreated(address,uint256,uint256,uint256,uint256,uint256)")
    ]
};


factoryC.on(filter, (addr, id, s, e, mintAmount, fp) => {
    auctionLogger.info(`Auction address : ${addr}, Auction id : ${bigUint(id)}, Start time : ${bigUint(s)}, End time : ${bigUint(e)}, Mint amount : ${bigUint(mintAmount)}, Floor price(MVL) : ${big18Uint(fp)}`)
}
);