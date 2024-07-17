// formatAddress.ts

export const formatAddress = (address: string): string => {
    // Validate address format if necessary, assuming TON addresses are hexadecimal strings
  
    // Example formatting for TON addresses
    const maxLength = 64; // Maximum length of a TON address
    const ellipsisThreshold = 9; // Display full address if shorter than or equal to this threshold
  
    if (address.length <= ellipsisThreshold) {
      return address; // Display full address if shorter than or equal to threshold
    } else {
      return `${address.slice(0, 5)}...${address.slice(-4)}`; // Shorten address with ellipses
    }
  };
  