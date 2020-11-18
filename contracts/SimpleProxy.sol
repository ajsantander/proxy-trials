// SPDX-License-Identifier: MIT
pragma solidity >= 0.6.0 < 0.8.0;

contract SimpleProxy {
    bytes32 private constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    constructor(address implementation) {
        setImplementation(implementation);
    }

    function setImplementation(address newImplementation) public {
        bytes32 slot = _IMPLEMENTATION_SLOT;

        assembly {
            sstore(slot, newImplementation)
        }
    }

    function getImplementation() public view returns (address implementation) {
        bytes32 slot = _IMPLEMENTATION_SLOT;

        assembly {
            implementation := sload(slot)
        }
    }

    fallback() external {
        address implementation = getImplementation();

        assembly {
            calldatacopy(0, 0, calldatasize())

            let result := delegatecall(gas(), implementation, 0, calldatasize(), 0, 0)

            returndatacopy(0, 0, returndatasize())

            switch result
                case 0 { revert(0, returndatasize()) }
                default { return(0, returndatasize()) }
        }
    }
}
