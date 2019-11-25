const Block = require("./block.js");
const config = require("./config");

describe("Block" , function(){
        const timestamp = "date";
        const lastHash = "foo-lasthash";
        const hash = "foo-hash";
        const data = ["Blockchain" ,  "Data"];
        const block = new Block({timestamp , lastHash , hash , data});
        it("has a timestamp, lasthash, hash, data" , function(){
            expect(block.timestamp).toEqual(timestamp);
            expect(block.lastHash).toEqual(lastHash);
            expect(block.hash).toEqual(hash);
            expect(block.data).toEqual(data);
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
                expect(minedBlock.timestamp).toEqual(minedBlock.timestamp, minedBlock.lastHash , data);
            })
        });

});