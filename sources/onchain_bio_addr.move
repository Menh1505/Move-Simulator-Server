module onchain_bio_addr::onchain_bio {
  use std::string::{String};
  use std::signer;

  

  struct Bio has key, store, drop {
      name: String,
      bio: String,
  }
  
  #[view]
  public fun signature() : address {
        @onchain_bio_addr
  }

  public entry fun register(account: &signer, name: String, bio: String) acquires Bio {
    // Check if a Bio already exists for the account
    if (exists<Bio>(signer::address_of(account))) {
      // Remove the existing Bio
      let _old_Bio = move_from<Bio>(signer::address_of(account));
    };
    // Create the new Bio
    let bio = Bio {
      name,
      bio,
    };
    // Store the new Bio under the account
    move_to<Bio>(account, bio);
  }
}

//transaction: 0xf271d9991c3abd35cfc050dbca7c704175d66bfb110fa92842eebdda5a996a3e
