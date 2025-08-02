module HTLC::htlc_aptos {
    use std::signer;
    use std::vector;
    use std::hash;
    use std::timestamp;
    use aptos_framework::coin;
    use aptos_framework::table;
    use aptos_framework::account;

    struct EscrowVault<phantom Currency> has key, store {
        balance: coin::Coin<Currency>,
    }

    struct Swap<phantom Currency> has store, key {
        sender: address,
        receiver: address,
        amount: u64,
        hashlock: vector<u8>,
        timelock: u64,
        claimed: bool,
    }

    struct Store<phantom Currency> has store, key {
        swaps: table::Table<vector<u8>, Swap<Currency>>,
    }

    public fun init<Currency: store>(account: &signer) {
        move_to(account, Store<Currency> {
            swaps: table::new(),
        });
    }

    public fun lock<Currency: store> (
        account: &signer,
        id: vector<u8>,
        receiver: address,
        amount: u64,
        hashlock: vector<u8>,
        timelock: u64
    ) acquires Store {
        let sender = signer::address_of(account);
        let coins = coin::withdraw<Currency>(account, amount);

        if (!exists<Store<Currency>>(sender)) {
            init<Currency>(account);
        };

        let store = borrow_global_mut<Store<Currency>>(sender);
        table::add(&mut store.swaps, id, Swap {
            sender,
            receiver,
            amount,
            hashlock,
            timelock,
            claimed: false,
        });

        move_to(account, EscrowVault<Currency> {balance: coins,});
    }

    public fun claim<Currency: store> (
        account: &signer,
        sender: address,
        id: vector<u8>,
        secret: vector<u8>
    ) acquires Store, EscrowVault {
        let receiver = signer::address_of(account);
        let store = borrow_global_mut<Store<Currency>>(sender);
        let swap = table::borrow_mut(&mut store.swaps, id);
        assert!(!swap.claimed, 100);
        assert!(timestamp::now_seconds() <= swap.timelock, 101);
        assert!(hash::sha2_256(secret) == swap.hashlock, 102);
        assert!(swap.receiver == receiver, 105);

        swap.claimed = true;

        // Withdraw from escrow
        let vault = borrow_global_mut<EscrowVault<Currency>>(sender);
        let coins = coin::extract(&mut vault.balance, swap.amount);
        coin::deposit<Currency>(receiver, coins);
    }

    pub fun claimSingle<Currency> (
        account: &signer,
        hashlock: vector<u8>,
        secret: vector<u8>,
        timelock: u64,
        amount: u64
    ){
        let reciever = signer::address_of(account);
        assert!(timestamp::now_seconds() <= timelock, 101);
        assert!(hash::sha2_256(&secret) == hashlock, 102);
        let coins = coin::withdraw<Currency>(&signer::borrow_address(account), amount);
        coin::deposit<Currency>(receiver, coins);
    }

    public fun refund<Currency: store> (
        account: &signer,
        id: vector<u8>
    ) acquires Store, EscrowVault {
        let sender = signer::address_of(account);
        let store = borrow_global_mut<Store<Currency>>(sender);
        let swap = table::borrow_mut(&mut store.swaps, id);
        assert!(!swap.claimed, 103);
        assert!(timestamp::now_seconds() > swap.timelock, 104);

        // Refund from escrow
        let vault = borrow_global_mut<EscrowVault<Currency>>(sender);
        let coins = coin::extract(&mut vault.balance, swap.amount);
        coin::deposit<Currency>(sender, coins);
    }
}
