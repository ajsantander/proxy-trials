const { expect } = require('chai');

const itBehavesLikeAForwardingProxy = ({ context }) => {
  describe('when reading and writing values via the proxy', () => {
    describe('when the value is not set', () => {
      it('reads the correct value', async () => {
        const readValue = await context.contract.getValue();
        expect(readValue).to.equal(0);
      });
    });

    describe('when the value is set', () => {
      before('set value in proxy', async () => {
        await context.contract.setValue(42);
      });

      it('reads the correct value', async () => {
        const readValue = await context.contract.getValue();
        expect(readValue).to.equal(42);
      });
    });
  });
};

module.exports = {
  itBehavesLikeAForwardingProxy,
};
