use anchor_lang::prelude::*;

#[error_code]
pub enum MarketplaceError {
    #[msg("The given name is too long")]
    NameTooLong,
    #[msg("Unauthorized")]
    Unauthorized,
}

#[error_code]
pub enum ListingError {
    #[msg("The given URI is not valid")]
    InvalidUri,
}
