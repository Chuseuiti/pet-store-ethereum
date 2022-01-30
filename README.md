
1. Pet shop tutorial truffle 
    Metamask connection, account fetching, testing and contract interaction
    https://trufflesuite.com/tutorial/
2. NFT minting process with Open Zepelling contract
    Contract depoyment and minting through truffle develop.
    Relevante NFT contract: ERC721PresetMinterPauserAutoId
    https://forum.openzeppelin.com/t/create-an-nft-and-deploy-to-a-public-testnet-using-truffle/2961

    Minted NFT on contract migration by updating contract constructor ERC721PresetMinterPauserAutoId. 
    To verify NFT ownership on `truffle develop`:

Get NFT account

truffle(develop)> nft.symbol()

'NFT'

truffle(develop)> nft.tokenURI(0)

'https://my-json-server.typicode.com/abcoathup/samplenft/tokens/0'

truffle(develop)> nft.ownerOf(0)

'0x19D6AEc851d8853a04C9F9738201652eAe91A734'

Get current account 

truffle(develop)> let accounts = await web3.eth.getAccounts()

undefined

truffle(develop)> accounts[0]

'0x19D6AEc851d8853a04C9F9738201652eAe91A734'

3. IN PROGRESS: Update NFT storage to be located on IPFs
   Currently following IPFS mint tutorial 
   https://docs.ipfs.io/how-to/mint-nfts-with-ipfs/#minty
   Thoughts: Astrocats single page with ability to create and mint NFTs. This page contains projects roadmap.
   Initial NFT drop to some wallets during contract deployment 
   Separate page for HunterGame
   Tip: By deleting the path of IPF the address can be reduced, reducing the cost of storing the data in Ethereum.

4. TODO: Access control mechanisms for contracts.

5. TODO: Sell a minted NFT on OpenSea.

6. TODO: Validate ownership on app.js, if NFT owned allow adoption on pet shop. Create test for NFT ownership validation.

7. TODO: Upgradable contracts: https://docs.openzeppelin.com/contracts/3.x/upgradeable
