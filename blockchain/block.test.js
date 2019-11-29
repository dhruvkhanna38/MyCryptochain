const Block = require("./block");
const config = require("../config");
const hexToBinary = require("hex-to-binary");
const cryptoHash = require("../util/cryptoHash");

describe("Block" , function(){
        const timestamp = 2000;
        const lastHash = "foo-lasthash";
        const hash = "foo-hash";
        const data = ["Blockchain" ,  "Data"];
        const nonce = 1;
        var difficulty = 1;
        const block = new Block({timestamp , lastHash , hash , data , nonce , difficulty});
        it("has a timestamp, lasthash, hash, data ,nonce and difficulty" , function(){
            expect(block.timestamp).toEqual(timestamp);
            expect(block.lastHash).toEqual(lastHash);
            expect(block.hash).toEqual(hash);
            expect(block.data).toEqual(data);
            expect(block.nonce).toEqual(nonce);
        });

        describe("genesis()" , function(){
            const genesisBlock = Block.genesis();
            console.log(genesisBlock);
            it("return a block instance" , function(){
                expect(genesisBlock instanceof Block).toEqual(true);
            });
            it("returns the genesis data" , function(){
                expect(genesisBlock).toEqual(config.GENESIS_DATA);
            });
        });

        describe("mineBlock()" , function(){
            const lastBlock = Block.genesis();
            const data = "Mined Data";
            const minedBlock = Block.mineBlock({lastBlock , data});

            it("return a block instance" , function(){
                expect(minedBlock instanceof Block).toEqual(true);
            });
            it("sets the lastHash equal to hash of the last block" , function(){
                expect(minedBlock.lastHash).toEqual(lastBlock.hash);
            });
            it("sets the data" , function(){
                expect(minedBlock.data).toEqual(data);
            });
            it("sets a timestamp", function(){
                expect(minedBlock.timestamp).not.toEqual(undefined);
            });
            it("sets a hash", function(){
                expect(minedBlock.hash).
                toEqual(cryptoHash(minedBlock.timestamp, 
                                   minedBlock.lastHash ,
                                   data,
                                   minedBlock.nonce, 
                                   minedBlock.difficulty));
            });
            it("sets a hash with the assigned difficulty", function(){
                expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)).
                toEqual('0'.repeat(minedBlock.difficulty));
            });

            it("adjusts difficulty" , function(){
                var flag = Block.checkDifficulty(lastBlock.difficulty-1, lastBlock.difficulty+1 ,minedBlock);
                expect(flag).toBe(true);
            });
        });

        describe("adjustDifficulty()", function(){
            describe("lower the difficulty for a slowly mined block" , function(){
                expect(Block.adjustDifficulty({orignalBlock : block , 
                    timestamp : block.timestamp + config.MINE_RATE + 100})).toEqual(block.difficulty-1);
            });

            describe("raise the difficulty for a quickly mined block" , function(){
                expect(Block.adjustDifficulty({orignalBlock : block , 
                    timestamp : block.timestamp + config.MINE_RATE - 100})).toEqual(block.difficulty+1);
            });
            describe("it has a lower limit of 1" , function(){
                    block.difficulty = -1;
                    expect(Block.adjustDifficulty({orignalBlock : block})).toEqual(1);
            });
        });

});