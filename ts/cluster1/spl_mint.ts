import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import wallet from "../wba-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 9;

// Mint address
const mint = new PublicKey("xGH6b6B8gBqrPse7LiFtiVeQWWVx5NSVQ6berXpXzpT");

(async () => {
  try {
    // Create an ATA
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );
    console.log(
      `Your ata is: ${ata.address.toBase58()} https://explorer.solana.com/tx/${
        ata.address
      }?cluster=devnet`
    );

    // Mint to ATA
    const amount = 10 ** token_decimals;
    const mintTx = await mintTo(
      connection,
      keypair,
      mint,
      ata.address,
      keypair,
      amount
    );
    console.log(
      `Your mint txid: https://explorer.solana.com/tx/${mintTx}?cluster=devnet`
    );
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
