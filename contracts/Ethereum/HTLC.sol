// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address from, address to, uint256 val) external returns (bool);
    function transfer(address to, uint256 val) external returns (bool);
}

contract HTLC_EVM {
    struct Swap {
        address sender;
        address receiver;
        address token;
        uint256 amount;
        bytes32 hashlock;
        uint256 timelock;
        bool claimed;
        bool refunded;
    }

    mapping(bytes32 => Swap) public swaps;

    event Locked(bytes32 id, address sender, address receiver, uint256 amount);
    event Claimed(bytes32 id, bytes32 secret);
    event Refunded(bytes32 id);

    function lock(
        bytes32 id,
        address receiver,
        address token,
        uint256 amount,
        bytes32 hashlock,
        uint256 timelock
    ) external {
        require(swaps[id].sender == address(0), "Already exists");
        require(timelock > block.timestamp, "Timelock too early");

        IERC20(token).transferFrom(msg.sender, address(this), amount);
        swaps[id] = Swap(msg.sender, receiver, token, amount, hashlock, timelock, false, false);
        emit Locked(id, msg.sender, receiver, amount);
    }

    function claim(bytes32 id, bytes32 secret) external {
        Swap storage s = swaps[id];
        require(!s.claimed && !s.refunded, "Already handled");
        require(keccak256(abi.encodePacked(secret)) == s.hashlock, "Invalid secret");
        require(block.timestamp <= s.timelock, "Timelocked");

        s.claimed = true;
        IERC20(s.token).transfer(s.receiver, s.amount);
        emit Claimed(id, secret);
    }

    function refund(bytes32 id) external {
        Swap storage s = swaps[id];
        require(!s.claimed && !s.refunded, "Already handled");
        require(block.timestamp > s.timelock, "Still locked");
        require(msg.sender == s.sender, "Only sender");

        s.refunded = true;
        IERC20(s.token).transfer(s.sender, s.amount);
        emit Refunded(id);
    }
}
