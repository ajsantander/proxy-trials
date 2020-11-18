
// SPDX-License-Identifier: MIT
pragma solidity >= 0.6.0 < 0.8.0;

contract Upgradeable {
    // bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1))
    bytes32 private constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    function setImplementation(address newImplementation) public {
        bytes32 slot = _IMPLEMENTATION_SLOT;

        // solhint-disable-next-line no-inline-assembly
        assembly {
            sstore(slot, newImplementation)
        }
    }

    function getImplementation() public view returns (address implementation) {
        bytes32 slot = _IMPLEMENTATION_SLOT;

        // solhint-disable-next-line no-inline-assembly
        assembly {
            implementation := sload(slot)
        }
    }
}