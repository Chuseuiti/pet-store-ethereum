pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";
//import "../contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";

contract TestAdoption {
  // The address of the adoption contract to be tested
  Adoption adoption = Adoption(DeployedAddresses.Adoption());

  // The id of the pet that will be used for testing
  uint expectedPetId = 8;

  // Testing the adopt() function
  function testUserCanAdoptPet() public {
    uint returnedId = adoption.adopt(expectedPetId);

    Assert.equal(returnedId, expectedPetId, "Adoption of the expected pet should match what is returned.");
  }

  // The expected owner of adopted pet is this contract
  address expectedAdopter = address(this);

  // Testing retrieval of a single pet's owner
  function testGetAdopterAddressByPetId() public {
    address adopter = adoption.adopters(expectedPetId);

    Assert.equal(adopter, expectedAdopter, "Owner of the expected pet should be this contract");
  }

  // Testing retrieval of all pet owners
  function testGetAdopterAddressByPetIdInArray() public {
    // Store adopters in memory rather than contract's storage
    address[16] memory adopters = adoption.getAdopters();

    Assert.equal(adopters[expectedPetId], expectedAdopter, "Owner of the expected pet should be this contract");
  }

}

contract TestERC721 {
  // The address of the adoption contract to be tested
  ERC721PresetMinterPauserAutoId nft = ERC721PresetMinterPauserAutoId(DeployedAddresses.ERC721PresetMinterPauserAutoId());

  // Token symbol
  uint expecedSymbol = 'NFT';

  // Testing the symbol() function
  function testSymbol() public {
    returnedSymbol = nft.symbol();

    Assert.equal(returnedSymbol, expecedSymbol, "Symbol expected should match what is returned.");
  }

  // The expected owner of the initial NFT token contract
  address expectedOwner = address(this);

  // Testing retrieval of tokenId 0's owner
  function testGetAdopterAddressByTokenId() public {
    address owner = nft.ownerOf(0);

    Assert.equal(owner, expectedOwner, "Owner of the expected NFT should be this contract");
  }

}
