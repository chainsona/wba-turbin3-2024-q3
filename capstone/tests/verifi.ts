import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Verifi } from "../target/types/verifi";

describe("verifi", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Verifi as Program<Verifi>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize("foobar", 100).rpc();
    console.log("Your transaction signature", tx);
  });
});
