import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { ethers } from "ethers";

dotenv.config();

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.BSCTEST_URL
  );
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY as any, provider);
  console.log(await provider.getBlockNumber());
  console.log(await provider.listAccounts());
  console.log(await signer.getAddress());

  const abiPath = path.join(
    __dirname,
    "..",
    "artifacts/contracts/Greeter.sol/Greeterts.json"
  );
  let myabi: any = fs.readFileSync(abiPath);
  myabi = JSON.parse(myabi).abi;
  if (process.env.TEST_ADDR !== undefined) {
    const testContract = new ethers.Contract(
      process.env.TEST_ADDR,
      myabi,
      signer
    );
    console.log(await testContract.greet());
    await testContract.setGreet("I am changed");
    console.log(await testContract.greet());
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
