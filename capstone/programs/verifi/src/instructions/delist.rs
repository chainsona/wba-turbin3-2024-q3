use anchor_lang::prelude::*;

use crate::state::{Listing, Marketplace};

#[derive(Accounts)]
pub struct Delist<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(mut)]
    pub seller: SystemAccount<'info>,
    #[account(
        seeds = [b"marketplace", marketplace.name.as_bytes()],
        bump = marketplace.bump,
    )]
    pub marketplace: Account<'info, Marketplace>,
    #[account(
        mut,
        close = seller,
        seeds = [b"listing", marketplace.key().as_ref(), listing.uri.as_bytes()],
        bump = listing.bump,
    )]
    pub listing: Account<'info, Listing>,
    pub system_program: Program<'info, System>,
}

pub fn delist(_ctx: Context<Delist>) -> Result<()> {
    // The listing account is automatically closed and its lamports are transferred to the seller
    // due to the `close = seller` constraint in the `Delist` struct.
    // No additional code is needed here to close the listing account.

    Ok(())
}
