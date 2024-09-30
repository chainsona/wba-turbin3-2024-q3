use anchor_lang::prelude::*;

use crate::state::{Listing, Marketplace};

#[derive(Accounts)]
pub struct Buy<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub seller: AccountInfo<'info>,
    #[account(
        seeds = [b"marketplace", marketplace.name.as_bytes()],
        bump = marketplace.bump,
    )]
    pub marketplace: Account<'info, Marketplace>,
    #[account(
        mut,
        seeds = [b"treasury", marketplace.key().as_ref()],
        bump = marketplace.treasury_bump,
    )]
    pub treasury: SystemAccount<'info>,
    #[account(
        seeds = [b"listing", marketplace.key().as_ref(), listing.uri.as_bytes()],
        bump = listing.bump,
    )]
    pub listing: Account<'info, Listing>,
    pub system_program: Program<'info, System>,
}

pub fn buy(ctx: Context<Buy>) -> Result<()> {
    let listing = &ctx.accounts.listing;
    let marketplace = &ctx.accounts.marketplace;
    let buyer = &ctx.accounts.buyer;
    let seller = &ctx.accounts.seller;
    let price = listing.price;
    let fee_amount = (price as u128 * marketplace.fee as u128 / 10000) as u64;
    let seller_amount = price
        .checked_sub(fee_amount)
        .ok_or(ProgramError::ArithmeticOverflow)?;

    // Transfer the fee amount to the marketplace treasury PDA
    // let cpi_program = ctx.accounts.system_program.to_account_info();

    // let cpi_accounts = anchor_lang::system_program::Transfer {
    //     from: ctx.accounts.buyer.to_account_info(),
    //     to: ctx.accounts.treasury.to_account_info(),
    // };

    // let marketplace_key = ctx.accounts.marketplace.key();
    // let seeds = &[
    //     b"treasury",
    //     marketplace_key.as_ref(),
    //     &[ctx.accounts.marketplace.treasury_bump],
    // ];

    // let signer_seeds = &[&seeds[..]];
    // let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

    // anchor_lang::system_program::transfer(cpi_ctx, fee_amount)?;

    // Transfer the seller share of the sale
    anchor_lang::system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: buyer.to_account_info(),
                to: seller.to_account_info(),
            },
        ),
        seller_amount,
    )?;

    Ok(())
}
