import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Verifi } from "../target/types/verifi";
import { expect } from "chai";

describe("verifi", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Verifi as Program<Verifi>;

  it("Marketplace has been initialized", async () => {
    // Add your test here.
    const tx = await program.methods.initialize("foobar", 100).rpc();
    console.log("Your transaction signature", tx);

    const marketplace = (await program.account.marketplace.all())[0];
    expect(marketplace.account.name).to.equal("foobar");
    expect(marketplace.account.fee).to.equal(100);
  });

  it("Seller has created a listing", async () => {
    const tx = await program.methods
      .createListing(new anchor.BN(1245297), "https://foobar.com")
      .accountsPartial({
        marketplace: (await program.account.marketplace.all())[0].publicKey,
      })
      .rpc();
    console.log("Your transaction signature", tx);

    const listing = (await program.account.listing.all())[0];
    expect(parseInt(listing.account.price.toString())).to.equal(1245297);
    expect(listing.account.uri).to.equal("https://foobar.com");
  });

  it("Buyer has bought a listing", async () => {
    const buyer = anchor.web3.Keypair.generate();
    console.log(`Buyer's public key: ${buyer.publicKey.toBase58()}`);
    const buyerProvider = new anchor.AnchorProvider(
      program.provider.connection,
      new anchor.Wallet(buyer),
      {}
    );
    const buyerProgram = new anchor.Program(program.idl, buyerProvider);
    await program.provider.connection.requestAirdrop(
      buyer.publicKey,
      5 * anchor.web3.LAMPORTS_PER_SOL
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const buyerBalance = await program.provider.connection.getBalance(
      buyer.publicKey
    );
    console.log(
      `Buyer's balance before purchase: ${
        buyerBalance / anchor.web3.LAMPORTS_PER_SOL
      } SOL`
    );

    const listing = (await program.account.listing.all())[0];
    const seller = listing.account.seller;

    // Get seller's balance before withdrawal
    const balanceBefore = await buyerProgram.provider.connection.getBalance(
      seller
    );
    console.log(
      `Seller's balance before withdrawal: ${
        balanceBefore / anchor.web3.LAMPORTS_PER_SOL
      } SOL`
    );

    const tx = await buyerProgram.methods
      .buyFromListing()
      .accountsPartial({
        marketplace: (await program.account.marketplace.all())[0].publicKey,
        listing: (await program.account.listing.all())[0].publicKey,
        seller,
        treasury: anchor.web3.PublicKey.findProgramAddressSync(
          [
            Buffer.from("treasury"),
            (await program.account.marketplace.all())[0].publicKey.toBuffer(),
          ],
          program.programId
        )[0],
      })
      .signers([buyer])
      .rpc();
    console.log("Your transaction signature", tx);

    // Get seller's balance after withdrawal
    const balanceAfter = await buyerProgram.provider.connection.getBalance(
      seller
    );

    // Check if the balance has increased
    expect(balanceAfter).to.be.greaterThan(balanceBefore);
    console.log(
      `Seller's balance increased by ${balanceAfter - balanceBefore} lamports`
    );
  });

  it("Seller has cancelled a listing", async () => {
    const tx = await program.methods
      .cancelListing()
      .accountsPartial({
        marketplace: (await program.account.marketplace.all())[0].publicKey,
        listing: (await program.account.listing.all())[0].publicKey,
        seller: (await program.account.listing.all())[0].account.seller,
      })
      .rpc();
    console.log("Your transaction signature", tx);

    const listing = (await program.account.listing.all())[0];
    expect(listing).to.be.undefined;
  });

  it("Marketplace admin has cashed out", async () => {
    const marketplace = (await program.account.marketplace.all())[0];
    const admin = marketplace.account.admin;
    const treasury = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("treasury"), marketplace.publicKey.toBuffer()],
      program.programId
    )[0];

    // Get admin's balance before cashout
    // const balanceBefore = await program.provider.connection.getBalance(admin);

    const tx = await program.methods
      .withdrawFromTreasury()
      .accountsPartial({
        marketplace: marketplace.publicKey,
        admin,
        treasury,
      })
      .rpc();
    console.log("Your transaction signature", tx);

    // Get admin's balance after cashout
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // const balanceAfter = await program.provider.connection.getBalance(admin);

    // Check if the balance has increased
    // expect(balanceAfter).to.be.greaterThan(balanceBefore);
    // console.log(
    //   `Admin's balance increased by ${balanceAfter - balanceBefore} lamports`
    // );
  });
});
