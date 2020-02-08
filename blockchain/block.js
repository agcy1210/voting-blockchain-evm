const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {
    constructor(timestamp, lastHash, hash, data, publicKey, signature, candidatePubKey, referenceNo) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.publicKey = publicKey;
        this.signature = signature;
        this.candidatePubKey = candidatePubKey;
        this.referenceNo = referenceNo;
    }

    toString() {
        return `Block:-
            Timestamp      : ${this.timestamp}
            Lasthash       : ${this.lastHash.substring(0, 10)}
            Hash           : ${this.hash.substring(0, 10)}
            Data           : ${this.data}
            publicKey      : ${this.publicKey.toString()}
            signature      : ${this.signature}
            candidatePubKey: ${this.candidatePubKey}
            referenceNo    : ${this.referenceNo}`;
    }

    //used to initialize the chain. This will always be the first block of the chain
    static genesis() {
        return new this('Genesis time', '----', 'fir57-h45h', [], 'x', 'sign', 'cand-pu8ke7','1234');
    }

    static mineBlock(lastBlock, data, candidatePubKey, referenceNo) {
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let keyPair = ChainUtil.genKeyPair();

        //generates public key for the block
        let publicKey = keyPair.getPublic('hex')

        timestamp = Date.now();

        hash = Block.hash(lastHash, data, publicKey, candidatePubKey);
        let signature = keyPair.sign(hash);

        return new this(timestamp, lastHash, hash, data, publicKey, signature, candidatePubKey, referenceNo);
    }

    //generates the hash using the SHA-256 algorithm
    static hash(lastHash, data, publicKey, candidatePubKey) {
        return ChainUtil.hash(`${lastHash}${data}${publicKey}${candidatePubKey}`).toString();
    }

    static idHash(idData) {
        return ChainUtil.hash(`${idData}`).toString();
    }

    static sign(dataHash) {
        return ChainUtil.genKeyPair().sign(dataHash);
    }

    static verify(pubKey, block, referenceNo) {
        // let idData = block.data.filter(el => el.type === data.type)[0].data.id; //gives the id number of the id
        let dataHash = block.hash;
        let digitalSignature = block.signature;

        if ((ChainUtil.verifySignature(pubKey, digitalSignature, dataHash)) && (block.referenceNo === referenceNo)) {
            return "Match";
        } else {
            return "No Match";
        }
    }

    static blockHash(block) {
        const { lastHash, data, publicKey, candidatePubKey } = block;
        return Block.hash(lastHash, data, publicKey, candidatePubKey);
    }

}

module.exports = Block;
