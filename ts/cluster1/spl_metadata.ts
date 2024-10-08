import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
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
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
  try {
    // Start here
    let accounts: CreateMetadataAccountV3InstructionAccounts = {
      mint,
      mintAuthority: signer,
    };

    let data: DataV2Args = {
      name: "Soona Coin",
      symbol: "SOONA",
      uri: "",
      sellerFeeBasisPoints: 0,
      collection: null,
      creators: null,
      uses: null,
    };

    let args: CreateMetadataAccountV3InstructionArgs = {
      data,
      isMutable: true,
      collectionDetails: null,
    };

    let tx = createMetadataAccountV3(umi, {
      ...accounts,
      ...args,
    });

    let result = await tx.sendAndConfirm(umi);
    console.log(
      `https://solana.fm/tx/${base58.encode(
        result.signature
      )}?cluster=devnet-alpha`
    );
    // https://solana.fm/tx/3kU4xHPJXk2BYRbhFQr6qZokkFsubrgt2kpSZvQ1ttgFbT58eVkXoRBASvQCFr2sYcAm9C36KE5E2hRumE2cj2Km?cluster=mainnet-alpha
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
