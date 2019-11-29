const config = require("../config");
const cryptoHash = require("../util/cryptoHash");
const hexToBinary = require("hex-to-binary");


class Block {
    constructor({timestamp, lastHash, hash, data,nonce ,difficulty}){
            this.timestamp = timestamp;
            this.lastHash = lastHash;
            this.hash = hash;
            this.data = data;
            this.nonce =nonce;
            this.difficulty = difficulty;
     }
     static genesis(){
         return new Block(config.GENESIS_DATA);
     }
     static mineBlock({lastBlock , data}){
         var hash, timestamp;
         const lastHash = lastBlock.hash;
         var {difficulty} = lastBlock;
         var nonce =0;
         do{
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({orignalBlock : lastBlock ,  timestamp});
            hash = cryptoHash(timestamp ,lastHash ,data, nonce, difficulty)
         }while(hexToBinary(hash).substring(0,difficulty)!=='0'.repeat(difficulty));
         
         var block = new Block({timestamp , 
                                lastHash, 
                                data , 
                                difficulty,
                                nonce,
                                hash
                                }); 
         return block;
     } 
     
     static adjustDifficulty({orignalBlock , timestamp}){
         const {difficulty} =  orignalBlock;
         var difference = timestamp - orignalBlock.timestamp;
         if(difficulty<1){
             return 1;
         }
         if(difference > config.MINE_RATE){
             return difficulty - 1
         }
         else{
            return difficulty + 1;
         }
     }

     static checkDifficulty(lowerLimit , higherLimit, minedBlock){
            if(minedBlock.difficulty >= lowerLimit && minedBlock.difficulty<=higherLimit){
                return true;
            } 
            else{
                return false;
            }

     }
}

module.exports = Block;

