const {
  itBehavesLikeAForwardingProxy,
} = require('./behaviors/ForwardingProxy.behavior');
const {
  itBehavesLikeAnUpgradeableProxy,
} = require('./behaviors/UpgradeableProxy.behavior');
const { deployProxy } = require('./helpers/Proxy.helper');

const context = {};

describe('SimpleProxy', function () {
  before('deploy implementation and proxy', async () => {
    await deployProxy({ context, proxyType: 'SimpleProxy' });
  });

  itBehavesLikeAForwardingProxy({ context });
  itBehavesLikeAnUpgradeableProxy({ context });
});
