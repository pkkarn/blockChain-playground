const SHA256 = require('crypto-js/sha256');
const dayjs = require('dayjs');

class Block {
    constructor(index, timestamp, data, previousHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
    }

    createGenesisBlock() {
        return new Block(0, dayjs().format(), 'Genesis Block', "fddddddddddddddddddddddd0")
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block) {
        // we assing previousHash of new request block with has of previous block
        block.previousHash = this.getLatestBlock().hash;
        // now as we changed the previous hash then we also have to change its hash
        block.hash = block.calculateHash();
        this.chain.push(block);
    }

    isValidChain() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            // to check whether current hash of block is valid as per data - with calculateHash()
            if(currentBlock.hash !== currentBlock.calculateHash()) {
                console.log('Current hash is not valid');
                return false;
            } 
            // to check whether current hash of block is pointing to previous block
            if(currentBlock.previousHash !== previousBlock.hash) {
                console.log('Previous hash is not valid');
                return false;
            }
        }

        return true;
    }
}

const blockChainInst = new BlockChain();
for(let i = 0; i < 100; i++) {
    blockChainInst.addBlock(new Block(i, dayjs().format(), { amount: i }));
}

console.log(blockChainInst.isValidChain());

blockChainInst.chain[1].data = { amount: 1000 };
blockChainInst.chain[1].hash = blockChainInst.chain[1].calculateHash();

console.log(blockChainInst.isValidChain());
