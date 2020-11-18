const {
  itBehavesLikeAForwardingProxy,
} = require('./behaviors/ForwardingProxy.behavior');
const {
  itBehavesLikeAnUpgradeableProxy,
} = require('./behaviors/UpgradeableProxy.behavior');
const { deployProxy } = require('./helpers/Proxy.helper');

const context = {};

describe('UpgradeableMinimalProxy', function () {
  before('deploy implementation and proxy', async () => {
    await deployProxy({ context, proxyType: 'UpgradeableMinimalProxy' });
  });

  itBehavesLikeAForwardingProxy({ context });
  itBehavesLikeAnUpgradeableProxy({ context });
});
