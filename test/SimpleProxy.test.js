const {
  itBehavesLikeAForwardingProxy,
} = require('./behaviors/ForwardingProxy.behavior');
const {
  itBehavesLikeAnUpgradeableProxy,
} = require('./behaviors/UpgradeableProxy.behavior');

const context = {};

describe('SimpleProxy', function () {
  before('deploy implementation and proxy', async () => {
    const Implementation = await ethers.getContractFactory('ImplementationV1');
    context.implementation = await Implementation.deploy();
    await context.implementation.deployed();

    const Proxy = await ethers.getContractFactory('SimpleProxy');
    context.proxy = await Proxy.deploy(context.implementation.address);
    await context.proxy.deployed();

    context.contract = await ethers.getContractAt(
      'ImplementationV1',
      context.proxy.address
    );
  });

  itBehavesLikeAForwardingProxy({ context });
  itBehavesLikeAnUpgradeableProxy({ context });
});
