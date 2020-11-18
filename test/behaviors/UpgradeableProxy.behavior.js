const { expect } = require('chai');

const itBehavesLikeAnUpgradeableProxy = ({ context }) => {
  describe('when upgrading the proxy', () => {
    before('update proxy wrapper interface', async () => {
      context.contract = await ethers.getContractAt(
        'ImplementationV2',
        context.proxy.address
      );
    });

    describe('before upgrading to V2', () => {
      it('reverts when interacting with an unknown function', async () => {
        expect(context.contract.getMessage()).to.be.revertedWith(
          "function selector was not recognized and there's no fallback function"
        );
      });
    });

    describe('after upgrading to V2', () => {
      before('upgrade to V2', async () => {
        const Implementation = await ethers.getContractFactory(
          'ImplementationV2'
        );
        context.implementation = await Implementation.deploy();
        await context.implementation.deployed();

        await context.proxy.setImplementation(context.implementation.address);

        context.contract = await ethers.getContractAt(
          'ImplementationV2',
          context.proxy.address
        );
      });

      it('reads the correct message', async () => {
        const readMessage = await context.contract.getMessage();
        expect(readMessage).to.equal('');
      });

      describe('when the message is set', () => {
        before('set message in proxy', async () => {
          await context.contract.setMessage('forty two');
        });

        it('reads the correct message', async () => {
          const readMessage = await context.contract.getMessage();
          expect(readMessage).to.equal('forty two');
        });
      });
    });
  });
};

module.exports = {
  itBehavesLikeAnUpgradeableProxy,
};
