use anchor_lang::prelude::*;

use crate::error::ListingError;
use crate::state::{Listing, Marketplace};

#[derive(Accounts)]
#[instruction(price: u64, uri: String)]
pub struct List<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,
    #[account(
        seeds = [b"marketplace", marketplace.name.as_bytes()],
        bump = marketplace.bump,
    )]
    pub marketplace: Account<'info, Marketplace>,
    #[account(
        init,
        payer = seller,
        seeds = [b"listing", marketplace.key().as_ref(), uri.as_bytes()],
        bump,
        space = Listing::INIT_SPACE
    )]
    pub listing: Account<'info, Listing>,
    pub system_program: Program<'info, System>,
}

pub fn list(ctx: Context<List>, price: u64, uri: String) -> Result<()> {
    require!(
        !uri.is_empty() && uri.len() <= 32 && uri.starts_with("http"),
        ListingError::InvalidUri
    );

    ctx.accounts.listing.set_inner(Listing {
        seller: ctx.accounts.seller.key(),
        price,
        uri,
        bump: ctx.bumps.listing,
    });

    Ok(())
}
