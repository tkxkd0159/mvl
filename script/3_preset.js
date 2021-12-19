const path = require("path");
const { parseUnits } = require("ethers/lib/utils");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, '../.op.env') })
const s = require("./setting");

const main = async() => {

    // For test, do not use !!
    const approveLimit = parseUnits('1', 36);
    await s.mvlC.approve(process.env.AUCTION_ADDR, approveLimit);
    console.log(await s.mvlC.allowance(process.env.ADMIN_ADDR, process.env.AUCTION_ADDR));
    await s.oracleC.setCurrentPrice(s.uintBig("0.0128"));
    await s.factoryC.setCriteria(4);
    await s.mywait(5);
    let oraclePrice = await s.oracleC.getCurrentPrice();
    console.log(s.bigUint(oraclePrice))
    for (let i=0; i<10;i++){
        await s.auctionC.placeBid(s.uintBig("50"+`.${i}`))
    }
    console.log("Test bidding complete")
    process.exit(0);

}

main();