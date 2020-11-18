const { expect } = require('chai');
const {
  itBehavesLikeAForwardingProxy,
} = require('./behaviors/ForwardingProxy.behavior');

const context = {};

describe('MinimalProxy', function () {
  const getProxyCode = (implementationAddress) =>
    `0x363d3d373d3d3d363d73${implementationAddress
      .slice(2)
      .toLowerCase()}5af43d82803e903d91602b57fd5bf3`;

  before('deploy implementation and proxy', async () => {
    const Implementation = await ethers.getContractFactory('ImplementationV1');
    context.implementation = await Implementation.deploy();
    await context.implementation.deployed();

    const Proxy = await ethers.getContractFactory('MinimalProxy');
    context.proxy = await Proxy.deploy(context.implementation.address);
    await context.proxy.deployed();

    context.contract = await ethers.getContractAt(
      'ImplementationV1',
      context.proxy.address
    );
  });

  it('deploys a proxy with the correct code', async function () {
    const code = await ethers.provider.getCode(context.proxy.address);
    expect(code).to.equal(getProxyCode(context.implementation.address));
  });

  itBehavesLikeAForwardingProxy({ context });
  // itBehavesLikeAnUpgradeableProxy({ context }); // MinimalProxy is not upgradeable
});
