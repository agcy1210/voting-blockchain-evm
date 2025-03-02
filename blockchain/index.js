const Block = require('./block');
const ChainUtil = require('../chain-util');

class Blockchain {
    constructor() {
        // creates a chain in the form of list
        this.chain = [Block.genesis()];
    }

    addBlock(data, candidatePubKey, referenceNo) {
        // as chain is a list we can get the last block by index one less than current
        const lastBlock = this.chain[this.chain.length - 1];
        const block = Block.mineBlock(lastBlock, data, candidatePubKey, referenceNo);
        this.chain.push(block);

        ChainUtil.backupBlockchain(this.chain);        

        return block;
    }

    isValidChain(chain) {
        // check if the incoming chain contains the proper genesis block
        // here block's stringified form is used because in JS two objects referring to same original object can't be equal.

        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i - 1];

            // verifies the lasthash and hash field of block. If the data is tempered then blockHash() will give new hash.
            // hence verification will be failed and we will know that something went wrong
            
            if (block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)) {
                return false;
            }
        }
        // if everything is alright
        return true;
    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            console.log('Recieved chain is not longer than the current chain');
            return;
        } else if (!this.isValidChain(newChain)) {
            console.log('Recieved chain is not valid');
            return;
        }

        console.log('Replacing the blockchain with the new chain');
        this.chain = newChain;
    }

    verifyDetails(referenceNo) {
        let block = this.chain.filter(block => {
            return block.referenceNo === referenceNo;
        })[0];
        

        if(block){
            let pubKey = block.publicKey;
            return Block.verify(pubKey, block, referenceNo);
        } else {
            return "Block not found";
        }
    }

    generateResults() {
        let candidates_results = {};
        this.chain.forEach(block => {
            console.log(block.candidatePubKey)
            if(candidates_results[block.candidatePubKey] === undefined) {
                console.log(block);
                candidates_results[block.candidatePubKey] = 1;
            } else {
                let prevResult = candidates_results[block.candidatePubKey];
                candidates_results[block.candidatePubKey] = prevResult + 1
            }
        });
        console.log(candidates_results)
        return candidates_results;
    }
}

module.exports = Blockchain;