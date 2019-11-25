const Block = require("./block");
const cryptoHash = require("./cryptoHash");



class BlockChain {
        constructor(){
            const genesis = Block.genesis();
            this.chain = [genesis];
        }

        addBlock(newData){
            const newBlock = Block.mineBlock({
                lastBlock : this.chain[this.chain.length-1] , 
                data : newData
            });
            this.chain.push(newBlock);
        }
}

module.exports = BlockChain;