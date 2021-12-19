
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, '../.op.env') })

const { makeTimestamp } = require("../dist/utils")
const s = require("./setting");

let tStart;
let tEnd;
let limit;
let floorPrice;

const main = async () => {

    tStart = await s.q("Set the auction start UTC time (yyyy:mm:dd:hh:mm)\n");
    tStart = makeTimestamp(tStart);
    if (tStart === -1) {
        console.log("Wrong start date");
        s.rl.close()
        return -1;
    }
    tEnd = await s.q("Set the auction end UTC time (yyyy:mm:dd:hh:mm)\n");
    tEnd = makeTimestamp(tEnd);
    if (tEnd === -1) {
        console.log("Wrong end date");
        s.rl.close();
        return -1;
    }
    limit = await s.q("Set the number of auction targets\n");
    if (limit <= 0) {
        console.log("Wrong limit");
        s.rl.close();
        return -1
    }
    floorPrice = await s.q("Set the floor price of this auction ($)\n");
    if (floorPrice <= 0) {
        console.log("Wrong floor price");
        s.rl.close();
        return -1;
    }
    s.rl.close();

    if (process.env.NODE_ENV === "production") {
        await s.factoryC.createAuction(tStart, tEnd, limit, s.uintBig(floorPrice));
    }
};

main();
