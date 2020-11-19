const { expect } = require('chai');

describe('UpgradeableMinimalProxy', function () {
  const getProxyCode = () =>
    '0x363d3d373d3d3d363d7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc545af43d82803e903d91603857fd5bf3';

  before('deploy implementation and proxy', async () => {
    const Implementation = await ethers.getContractFactory(
      'UpgradeableImplementationV1'
    );
    implementation = await Implementation.deploy();
    await implementation.deployed();

    const Proxy = await ethers.getContractFactory('UpgradeableMinimalProxy');
    proxy = await Proxy.deploy(implementation.address);
    await proxy.deployed();

    contract = await ethers.getContractAt(
      'UpgradeableImplementationV1',
      proxy.address
    );
  });

  it('stored the implementation correctly', async () => {
    const readImplementation = await ethers.provider.getStorageAt(
      proxy.address,
      '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
    );

    expect(readImplementation).to.equal(
      `0x000000000000000000000000${implementation.address
        .slice(2)
        .toLowerCase()}`
    );
  });

  it('deploys a proxy with the correct code', async function () {
    const code = await ethers.provider.getCode(proxy.address);
    expect(code).to.equal(getProxyCode());
  });

  describe('when reading and writing values via the proxy', () => {
    describe('when the value is not set', () => {
      it('reads the correct value', async () => {
        const readValue = await contract.getValue();
        expect(readValue).to.equal(0);
      });
    });

    describe('when the value is set', () => {
      before('set value in proxy', async () => {
        await contract.setValue(42);
      });

      it('reads the correct value', async () => {
        const readValue = await contract.getValue();
        expect(readValue).to.equal(42);
      });
    });
  });

  describe('when upgrading the proxy', () => {
    before('update proxy wrapper interface', async () => {
      contract = await ethers.getContractAt(
        'ImplementationV2',
        proxy.address
      );
    });

    describe('before upgrading to V2', () => {
      it('reverts when interacting with an unknown function', async () => {
        expect(contract.getMessage()).to.be.revertedWith(
          "function selector was not recognized and there's no fallback function"
        );
      });
    });

    describe('after upgrading to V2', () => {
      before('upgrade to V2', async () => {
        const Implementation = await ethers.getContractFactory(
          'ImplementationV2'
        );
        implementation = await Implementation.deploy();
        await implementation.deployed();

        await proxy.setImplementation(implementation.address);

        contract = await ethers.getContractAt(
          'ImplementationV2',
          proxy.address
        );
      });

      it('reads the correct message', async () => {
        const readMessage = await contract.getMessage();
        expect(readMessage).to.equal('');
      });

      describe('when the message is set', () => {
        before('set message in proxy', async () => {
          await contract.setMessage('forty two');
        });

        it('reads the correct message', async () => {
          const readMessage = await contract.getMessage();
          expect(readMessage).to.equal('forty two');
        });
      });

      describe('when trying to upgrade again', () => {
        before('deploy an implementation', async () => {
          const Implementation = await ethers.getContractFactory(
            'ImplementationV2'
          );
          implementation = await Implementation.deploy();
          await implementation.deployed();
        });

        it('reverts when trying to set the new implementation', async () => {
          expect(proxy.setImplementation(implementation.address)).to.be.revertedWith(
            "function selector was not recognized and there's no fallback function"
          );
        });
      });
    });
  });
});
