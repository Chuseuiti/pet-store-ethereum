App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });;
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('ERC721PresetMinterPauserAutoId.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var NFTArtifact = data;
      App.contracts.ERC721PresetMinterPauserAutoId = TruffleContract(NFTArtifact);

      // Set the provider for our contract
      App.contracts.ERC721PresetMinterPauserAutoId.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.fetchAllNfts();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },




  // NFT creation on IPFS
  createNFTFromAssetData: function(content, options) {
        ipfs = ipfsClient(config.ipfsApiUrl)
        // add the asset to IPFS
        const filePath = options.path || 'asset.bin'
        const basename =  path.basename(filePath)

        // When you add an object to IPFS with a directory prefix in its path,
        // IPFS will create a directory structure for you. This is nice, because
        // it gives us URIs with descriptive filenames in them e.g.
        // 'ipfs://QmaNZ2FCgvBPqnxtkbToVVbK2Nes6xk5K4Ns6BsmkPucAM/cat-pic.png' instead of
        // 'ipfs://QmaNZ2FCgvBPqnxtkbToVVbK2Nes6xk5K4Ns6BsmkPucAM'
        const ipfsPath = '/nft/' + basename
        const { cid: assetCid } = await ipfs.add({ path: ipfsPath, content }, ipfsAddOptions)

        // make the NFT metadata JSON
        const assetURI = ensureIpfsUriPrefix(assetCid) + '/' + basename
        const metadata = await makeNFTMetadata(assetURI, options)

        // add the metadata to IPFS
        const { cid: metadataCid } = await ipfs.add({ path: '/nft/metadata.json', content: JSON.stringify(metadata)}, ipfsAddOptions)
        const metadataURI = ensureIpfsUriPrefix(metadataCid) + '/metadata.json'

        // get the address of the token owner from options, or use the default signing address if no owner is given
        let ownerAddress = options.owner
        if (!ownerAddress) {
            ownerAddress = await accounts[0]
        }

        // mint a new token referencing the metadata URI
        const tokenId = await mintToken(ownerAddress, metadataURI)

        // format and return the results
        return {
            tokenId,
            ownerAddress,
            metadata,
            assetURI,
            metadataURI,
            assetGatewayURL: makeGatewayURL(assetURI),
            metadataGatewayURL: makeGatewayURL(metadataURI),
        }
  },

  makeNFTMetadata: function (assetURI, options) {
        const {name, description} = options;
        assetURI = ensureIpfsUriPrefix(assetURI)
        return {
            name,
            description,
            image: assetURI
        }
  },

  ensureIpfsUriPrefix: function (cidOrURI) {
    let uri = cidOrURI.toString()
    if (!uri.startsWith('ipfs://')) {
        uri = 'ipfs://' + cidOrURI
    }
    // Avoid the Nyan Cat bug (https://github.com/ipfs/go-ipfs/pull/7930)
    if (uri.startsWith('ipfs://ipfs/')) {
      uri = uri.replace('ipfs://ipfs/', 'ipfs://')
    }
    return uri
  },
  mintToken: function(ownerAddress, metadataURI) {
      var nftInstance;

      // the smart contract adds an ipfs:// prefix to all URIs, so make sure it doesn't get added twice
      metadataURI = stripIpfsUriPrefix(metadataURI)

      nftInstance = await App.contracts.ERC721PresetMinterPauserAutoId.deployed()

      const tx = await nftInstance.mintToken(ownerAddress, metadataURI)

      // The OpenZeppelin base ERC721 contract emits a Transfer event when a token is issued.
      // tx.wait() will wait until a block containing our transaction has been mined and confirmed.
      // The transaction receipt contains events emitted while processing the transaction.
      const receipt = await tx.wait()
      for (const event of receipt.events) {
          if (event.event !== 'Transfer') {
              console.log('ignoring unknown event type ', event.event)
              continue
          }
          return event.args.tokenId.toString()
      }

      throw new Error('unable to get token id')

  },
















  // Multicall fetch all NFT minted
  fetchAllNfts: function() {
    $.getJSON('Multicall.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var MulticallArtifact = data;
      App.contracts.Multicall = TruffleContract(MulticallArtifact);

      // Set the provider for our contract
      App.contracts.Multicall.setProvider(App.web3Provider);

      var nftInstance;

      App.contracts.ERC721PresetMinterPauserAutoId.deployed().then(function(instance) {
        nftInstance = instance;

        return nftInstance.getLatestTokenId.call();
      }).then(function(tokenID) {

        multicallArgs = []

        // Prepare list to retrive all owners up to the latest tokenId
        // All owners retrieved as multicall array with their NFTs
        for (i = 0; i <= tokenID; i++) {
          multicallArgs[i] = {
            target: App.contracts.ERC721PresetMinterPauserAutoId,
            callData: nftContract.methods["ownerOf"](i).encodeABI()
          }
        }
     
        // Retrive all owners, expecting multicall function in contract to be able to apply it
        var ownersOf = await multicallContract.methods["aggregate"](multicallArgs).call();
    
      }).catch(function(err) {
        console.log(err.message);
      });


    });

  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    contract = new web3.eth.Contract(abi, address);
    
    // Don't forget to use await and .call()
    owner = contract.methods.ownerOf(tokenId).call().then(){
      if (owner == accounts[0]){ 
        console.log("NFT owner, access allowed")
        web3.eth.getAccounts(function(error, accounts) {
          if (error) {
            console.log(error);
          }

          var account = accounts[0];

          App.contracts.Adoption.deployed().then(function(instance) {
            adoptionInstance = instance;

            // Execute adopt as a transaction by sending account
            return adoptionInstance.adopt(petId, {from: account});
          }).then(function(result) {
            return App.markAdopted();
          }).catch(function(err) {
            console.log(err.message);
          });
        });
      }
    }
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
