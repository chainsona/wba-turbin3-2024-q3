use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Custom error message")]
    CustomError,
}

#[error_code]
pub enum MarketplaceError {
    #[msg("The given name is too long")]
    NameTooLong,
}
