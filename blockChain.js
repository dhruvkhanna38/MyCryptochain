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

        static isValidChain(chain){
                if(JSON.stringify(chain[0])!== JSON.stringify(Block.genesis())){
                    return false;
                }
                
                for(var i= 1;i<chain.length;i++){
                    const actualLastHash = chain[i-1].hash;
                    const storedLastHash = chain[i].lastHash;

                    if(actualLastHash !== storedLastHash){
                        return false;
                    }
                    const validatedhash = cryptoHash(chain[i].timestamp, chain[i].lastHash , chain[i].data);
                    
                    if(chain[i].hash  != validatedhash){
                        return false;
                    }
                }
                return true;
        }

        replaceChian(chain){
            if(chain.length <= this.chain.length){
                console.error("incoming chain must be longer")
                return;
            }
            if(!BlockChain.isValidChain(chain)){
                console.error("incoming chain must be valid");
                return;
            }
            console.log("replacing chain with" ,  chain);
            this.chain = chain;
        }
}

module.exports = BlockChain;