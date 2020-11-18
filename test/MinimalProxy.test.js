const { expect } = require('chai');
const { deployProxy } = require('./helpers/Proxy.helper');
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
    await deployProxy({ context, proxyType: 'MinimalProxy' });
  });

  it('deploys a proxy with the correct code', async function () {
    const code = await ethers.provider.getCode(context.proxy.address);
    expect(code).to.equal(getProxyCode(context.implementation.address));
  });

  itBehavesLikeAForwardingProxy({ context });
});
