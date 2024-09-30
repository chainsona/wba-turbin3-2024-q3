use anchor_lang::prelude::*;
use anchor_lang::system_program::Transfer;

use crate::state::Marketplace;
#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        seeds = [b"marketplace", marketplace.name.as_bytes()],
        bump = marketplace.bump,
    )]
    pub marketplace: Account<'info, Marketplace>,
    #[account(
        seeds = [b"treasury", marketplace.key().as_ref()],
        bump = marketplace.treasury_bump,
    )]
    pub treasury: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
    let cpi_program = ctx.accounts.system_program.to_account_info();

    let cpi_accounts = Transfer {
        from: ctx.accounts.treasury.to_account_info(),
        to: ctx.accounts.admin.to_account_info(),
    };

    let marketplace_key = ctx.accounts.marketplace.key();
    let seeds = &[
        b"treasury",
        marketplace_key.as_ref(),
        &[ctx.accounts.marketplace.treasury_bump],
    ];

    let signer_seeds = &[&seeds[..]];

    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

    // Get the balance of the treasury account
    let treasury_balance = ctx.accounts.treasury.lamports();

    // Ensure the treasury has funds to withdraw
    if treasury_balance == 0 {
        // return Err(ProgramError::InsufficientFunds.into());
        return Ok(());
    }

    // Use the full treasury balance as the transfer amount
    let amount = treasury_balance;

    // Update the transfer amount in the CpiContext
    anchor_lang::system_program::transfer(cpi_ctx, amount)?;

    Ok(())
}
