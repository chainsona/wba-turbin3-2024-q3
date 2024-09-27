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
        initialize::handler(ctx, name, fee)
    }
}
