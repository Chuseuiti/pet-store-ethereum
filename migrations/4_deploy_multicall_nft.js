// migrations/2_deploy.js
// SPDX-License-Identifier: MIT
const Multicall = artifacts.require("Multicall");

module.exports = function(deployer) {
  deployer.deploy(Multicall);

};


