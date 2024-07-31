import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  DataV2Args,
  updateMetadataAccountV2,
  UpdateMetadataAccountV2InstructionAccounts,
  UpdateMetadataAccountV2InstructionArgs,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import base58 from "bs58";

// Define our Mint address
const mint = publicKey("xGH6b6B8gBqrPse7LiFtiVeQWWVx5NSVQ6berXpXzpT");

// Create a UMI connection
const umi = createUmi("https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
  try {
    // Start here
    let data: DataV2Args = {
      name: "Soona Coin",
      symbol: "SOONA",
      uri: "https://chainsona.dev/api/metadata/soona-coin",
      sellerFeeBasisPoints: 0,
      collection: null,
      creators: null,
      uses: null,
    };

    let args: UpdateMetadataAccountV2InstructionArgs = {
      data,
    };

    let accounts: UpdateMetadataAccountV2InstructionAccounts = {
      metadata: publicKey("8yuAqhzcip7ntkZWxh3ntBZm6yQs8ss8pGSaUJBbmHhj"),
    };

    let tx = updateMetadataAccountV2(umi, {
      ...accounts,
      ...args,
    });

    let result = await tx.sendAndConfirm(umi);
    console.log(
      `https://solana.fm/tx/${base58.encode(
        result.signature
      )}?cluster=devnet-alpha`
    );
    // https://solana.fm/tx/5RYpE43QHTGQFmxWDWrxP1ofMYjjihSuM2XfrKTzHcA8zGhSaT449CBhgGS8WiAbgK3LcG1hippwXyAu6Cunep1U?cluster=devnet-alpha
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
