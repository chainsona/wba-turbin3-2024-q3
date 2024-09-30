pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("3JeB3GW3NoD3CcCi7MjKL7GTpqCgXcHDyEc247jAMiGs");

#[program]
pub mod verifi {

    use super::*;

    pub fn initialize(ctx: Context<Initialize>, name: String, fee: u16) -> Result<()> {
        init::init(ctx, name, fee)
    }

    pub fn create_listing(ctx: Context<List>, price: u64, uri: String) -> Result<()> {
        list::list(ctx, price, uri)
    }

    pub fn cancel_listing(ctx: Context<Delist>) -> Result<()> {
        delist::delist(ctx)
    }

    pub fn buy_from_listing(ctx: Context<Buy>) -> Result<()> {
        buy::buy(ctx)
    }

    pub fn withdraw_from_treasury(ctx: Context<Withdraw>) -> Result<()> {
        withdraw::withdraw(ctx)
    }
}
