const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, '../.op.env') })

const s = require("./setting");



const main = async () => {
    const MODE = await s.q("Type your mode what you want >> (main, check, test)\n");
    console.log(`You select ${MODE} mode`);

    if (MODE === "main") {
        await s.factoryC.setCriteria(4);
        await s.mywait(5);

        let info = await s.auctionC.getAuctionInformation();
        let fp = s.bigUint(info.floorPrice);
        let criteria = s.bigUint(info.criteria);
        let aid = info.auctionId;
        console.log(`Floor price : $${fp}, Criteria : ${criteria} MVL`);
        console.log(aid);

        let bidTarget = await s.auctionC.getWinBids();
        const rareBidderList = [];
        const rareBidderRem = [];
        const rareBidderRarity = [];
        const commonBidderList = [];
        const commonBidderRarity = [];
        for (let bidder of bidTarget) {
            let amount = s.bigUint(bidder.amount)
            let [rem, rarity] = s.decidePayback(amount, criteria)
            if (rem > 0) {
                rareBidderList.push(bidder.owner);
                rareBidderRem.push(s.uintBig(rem.toString()));
                rareBidderRarity.push(rarity);
            } else {
                commonBidderList.push(bidder.owner);
                commonBidderRarity.push(rarity);
            }
        }

        console.log("Distribution start")
        await s.nftC.safeMintBatch(commonBidderList, commonBidderRarity);
        await s.nftC.safeMintBatch(rareBidderList, rareBidderRarity)
        await s.factoryC.transferAuctionAssetBatch(aid, rareBidderList, rareBidderRem);

        console.log("Distribution complete")
        process.exit(0);


    } else if (MODE === "check") {
        console.log("Distribution checking start");

        let bidTarget = await s.auctionC.getWinBids();
        let disp;
        for (let bidder of bidTarget) {
            disp = await s.nftC.balanceOf(bidder.owner);
            console.log(`${bidder.owner} : ${disp}`);
        }
        console.log("Distribution checking is done");
        process.exit(0);
    }
};

main();