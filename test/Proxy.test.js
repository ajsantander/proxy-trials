const { expect } = require('chai');

let _proxy, _implementation, _contract;
let _proxyType, _implementationType;

const deployProxy = async ({
  proxyType,
  implementationType = 'ImplementationV1',
}) => {
  _proxyType = proxyType;
  _implementationType = implementationType;

  const Implementation = await ethers.getContractFactory(_implementationType);
  _implementation = await Implementation.deploy();
  await _implementation.deployed();

  const Proxy = await ethers.getContractFactory(proxyType);
  _proxy = await Proxy.deploy(_implementation.address);
  await _proxy.deployed();

  _contract = await ethers.getContractAt(_implementationType, _proxy.address);
};

const setImplementation = async ({ implementationType }) => {
  _implementationType = implementationType;

  const Implementation = await ethers.getContractFactory(_implementationType);
  _implementation = await Implementation.deploy();
  await _implementation.deployed();

  await _proxy.setImplementation(_implementation.address);

  _contract = await ethers.getContractAt(_implementationType, _proxy.address);
};

const itBehavesLikeAForwardingProxy = () => {
  describe('when reading and writing values via the proxy', () => {
    describe('when the value is not set', () => {
      it('reads the correct value', async () => {
        const readValue = await _contract.getValue();
        expect(readValue).to.equal(0);
      });
    });

    describe('when the value is set', () => {
      before('set value in proxy', async () => {
        await _contract.setValue(42);
      });

      it('reads the correct value', async () => {
        const readValue = await _contract.getValue();
        expect(readValue).to.equal(42);
      });
    });
  });
};

const itBehavesLikeAnUpgradeableProxy = () => {
  describe('when upgrading the proxy', () => {
    before('update proxy wrapper interface', async () => {
      _contract = await ethers.getContractAt(
        'ImplementationV2',
        _proxy.address
      );
    });

    after('restore proxy wrapper interface', async () => {
      _contract = await ethers.getContractAt(
        _implementationType,
        _proxy.address
      );
    });

    describe('before upgrading to V2', () => {
      it('reverts when interacting with an unknown function', async () => {
        expect(_contract.getMessage()).to.be.revertedWith(
          "function selector was not recognized and there's no fallback function"
        );
      });
    });

    describe('after upgrading to V2', () => {
      before('upgrade to V2', async () => {
        await setImplementation({ implementationType: 'ImplementationV2' });
      });

      it('reads the correct message', async () => {
        const readMessage = await _contract.getMessage();
        expect(readMessage).to.equal('');
      });

      describe('when the message is set', () => {
        before('set message in proxy', async () => {
          await _contract.setMessage('forty two');
        });

        it('reads the correct message', async () => {
          const readMessage = await _contract.getMessage();
          expect(readMessage).to.equal('forty two');
        });
      });
    });
  });
};

describe('SimpleProxy', function () {
  before('deploy implementation and proxy', async () => {
    await deployProxy({ proxyType: 'SimpleProxy' });
  });

  itBehavesLikeAForwardingProxy();
  itBehavesLikeAnUpgradeableProxy();
});

describe('MinimalProxy', function () {
  const getProxyCode = (implementationAddress) =>
    `0x363d3d373d3d3d363d73${implementationAddress
      .slice(2)
      .toLowerCase()}5af43d82803e903d91602b57fd5bf3`;

  before('deploy implementation and proxy', async () => {
    await deployProxy({ proxyType: 'MinimalProxy' });
  });

  it('deploys a proxy with the correct code', async function () {
    const code = await ethers.provider.getCode(_proxy.address);
    expect(code).to.equal(getProxyCode(_implementation.address));
  });

  itBehavesLikeAForwardingProxy();
});
