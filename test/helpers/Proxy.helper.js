const deployProxy = async ({
  context,
  proxyType,
  implementationType = 'ImplementationV1',
}) => {
  context.proxyType = proxyType;
  context.implementationType = implementationType;

  const Implementation = await ethers.getContractFactory(
    context.implementationType
  );
  context.implementation = await Implementation.deploy();
  await context.implementation.deployed();

  const Proxy = await ethers.getContractFactory(proxyType);
  context.proxy = await Proxy.deploy(context.implementation.address);
  await context.proxy.deployed();

  context.contract = await ethers.getContractAt(
    context.implementationType,
    context.proxy.address
  );
};

const upgradeProxy = async ({ context, implementationType }) => {
  context.implementationType = implementationType;

  const Implementation = await ethers.getContractFactory(
    context.implementationType
  );
  context.implementation = await Implementation.deploy();
  await context.implementation.deployed();

  await context.proxy.setImplementation(context.implementation.address);

  context.contract = await ethers.getContractAt(
    context.implementationType,
    context.proxy.address
  );
};

module.exports = {
  deployProxy,
  upgradeProxy,
};
