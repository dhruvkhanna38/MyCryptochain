const config = require("./config");
const cryptoHash = require("./cryptoHash");

var lightningHash = function(data){
    return data + "*";
}

class Block {
    constructor({timestamp, lastHash, hash, data}){
            this.timestamp = timestamp;
            this.lastHash = lastHash;
            this.hash = hash;
            this.data = data;
     }
     static genesis(){
         return new Block(config.GENESIS_DATA);
     }
     static mineBlock({lastBlock , data}){
         const timestamp = Date.now();
         const lastHash = lastBlock.hash;
        var block = new Block({timestamp , 
                                lastHash, 
                                data , 
                                hash : cryptoHash(timestamp ,  lastHash , data)
                                }); 
        return block;
     }      
}

module.exports = Block;

