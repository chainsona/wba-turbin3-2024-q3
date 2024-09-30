use anchor_lang::prelude::*;

#[account]
pub struct Listing {
    pub seller: Pubkey,
    pub price: u64,
    pub uri: String, // Set the limit to 256 bytes
    pub bump: u8,
}

impl Space for Listing {
    const INIT_SPACE: usize = 8 + 32 + 8 + 4 + 256 + 1;
}
