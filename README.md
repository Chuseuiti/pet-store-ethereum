
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

3. TODO: Update NFT storage to be located on IPFs
4. TODO: Validate ownership on app.js, if NFT owned allow adoption on pet shop. Create test for NFT ownership validation.

