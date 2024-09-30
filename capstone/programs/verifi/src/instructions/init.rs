use anchor_lang::prelude::*;

use crate::error::MarketplaceError;
use crate::state::Marketplace;

#[derive(Accounts)]
#[instruction(name: String, fee: u16)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init,
        payer = admin,
        seeds = [b"marketplace", name.as_bytes()],
        bump,
        space = Marketplace::INIT_SPACE
    )]
    pub marketplace: Account<'info, Marketplace>,
    #[account(
        mut,
        seeds = [b"treasury", marketplace.key().as_ref()],
        bump,
    )]
    pub treasury: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

pub fn init(ctx: Context<Initialize>, name: String, fee: u16) -> Result<()> {
    require!(
        !name.is_empty() && name.len() <= 32,
        MarketplaceError::NameTooLong
    );

    ctx.accounts.marketplace.set_inner(Marketplace {
        admin: ctx.accounts.admin.key(),
        fee,
        bump: ctx.bumps.marketplace,
        treasury_bump: ctx.bumps.treasury,
        name,
    });

    Ok(())
}
