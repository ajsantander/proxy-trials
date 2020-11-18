// SPDX-License-Identifier: MIT
pragma solidity >= 0.6.0 < 0.8.0;

contract MinimalProxy {
    constructor(address implementation) {
        bytes20 implementationBytes = bytes20(implementation);

        // solhint-disable-next-line no-inline-assembly
        assembly{
            let code := mload(0x40)

            mstore(code, 0x363d3d373d3d3d363d7300000000000000000000000000000000000000000000)
            mstore(add(code, 0x0a), implementationBytes)
            mstore(add(code, 0x1e), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)

            return(code, 0x2d)
        }
    }
}
