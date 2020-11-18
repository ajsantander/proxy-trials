const { expect } = require('chai');
const {
  itBehavesLikeAForwardingProxy,
} = require('./behaviors/ForwardingProxy.behavior');
const {
  itBehavesLikeAnUpgradeableProxy,
} = require('./behaviors/UpgradeableProxy.behavior');
const { deployProxy } = require('./helpers/Proxy.helper');

const context = {};

describe('UpgradeableMinimalProxy', function () {
  const getProxyCode = () =>
    '0x363d3d373d3d3d363d7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc545af43d82803e903d91603857fd5bf3';

  before('deploy implementation and proxy', async () => {
    await deployProxy({ context, proxyType: 'UpgradeableMinimalProxy' });
  });

  it('stored the implementation correctly', async () => {
    const readImplementation = await ethers.provider.getStorageAt(
      context.proxy.address,
      '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
    );

    expect(readImplementation).to.equal(
      `0x000000000000000000000000${context.implementation.address
        .slice(2)
        .toLowerCase()}`
    );
  });

  it('deploys a proxy with the correct code', async function () {
    const code = await ethers.provider.getCode(context.proxy.address);
    expect(code).to.equal(getProxyCode());
  });

  itBehavesLikeAForwardingProxy({ context });
  // itBehavesLikeAnUpgradeableProxy({ context });
});
