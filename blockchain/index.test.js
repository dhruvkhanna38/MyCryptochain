const BlockChain = require("./index");
const Block = require("./block");
const cryptoHash = require("../util/cryptoHash");


describe("BlockChain" , function(){

            let blockChain , newChain , orignalChain;
            beforeEach(function(){
                blockChain = new BlockChain();
                newChain = new BlockChain();
                orignalChain = blockChain.chain;
            });
            

            it("Contains an array instance" , function(){
                expect(blockChain.chain instanceof Array).toEqual(true);
            });

            it("starts with genesis block" , function(){
                expect(blockChain.chain[0]).toEqual(Block.genesis());
            });

            it("adds new data to the end of the array" , function(){
                    const newData = "foo-data";
                    blockChain.addBlock(newData);
                    expect(blockChain.chain[blockChain.chain.length -1].data).toEqual(newData);
            });

            describe("isValidChain()" ,  function(){

                describe("when the chain does not start with the genesis block" , function(){
                    it("returns false" , function(){
                        blockChain.chain[0] = {data : "fake-genesis"};
                        expect(BlockChain.isValidChain(blockChain.chain)).toEqual(false);
                    });
                });

                describe("when the chain does start from the genesis block and has multiple blocks" , function(){
                        describe("and the last hash reference has changed", function(){
                                it("returns false" , function(){
                                    blockChain.addBlock({data : "harry"});
                                    blockChain.addBlock({data : "ron"});
                                    blockChain.addBlock({data : "hermione"});
                                    blockChain.chain[2].lastHash = "broken-lasthash";
                                    expect(BlockChain.isValidChain(blockChain.chain)).toEqual(false);
                                });
                        });
                        describe("the chain contains a block with an invalid field" , function(){
                                it("returns false" , function(){
                                    blockChain.addBlock({data : "harry"});
                                    blockChain.addBlock({data : "ron"});
                                    blockChain.addBlock({data : "hermione"});
                                    blockChain.chain[2].data = "Invalid-Data";
                                    expect(BlockChain.isValidChain(blockChain.chain)).toEqual(false);
                                });
                        });
                        describe("the chain contains a block with a jumped difficulty", function(){
                                it("return false" , function(){
                                    const lastBlock = blockChain.chain[blockChain.chain.length-1];
                                    const lastHash =  lastBlock.hash;
                                    const timestamp = Date.now();
                                    const nonce = 0;
                                    const data = [];
                                    const difficulty = lastBlock.difficulty - 3;
                                    const hash = cryptoHash(timestamp , lastHash , nonce, difficulty,data);
                                    const badBlock = new Block({lastHash, hash, nonce,difficulty, data,timestamp});
                                    blockChain.chain.push(badBlock);
                                    expect(BlockChain.isValidChain(blockChain.chain)).toEqual(false);
                                }); 
                        });
                        describe("the chain does not contain any invalid blocks" , function(){
                                it("return true", function(){
                                    blockChain.addBlock({data : "harry"});
                                    blockChain.addBlock({data : "ron"});
                                    blockChain.addBlock({data : "hermione"});
                                    expect(BlockChain.isValidChain(blockChain.chain)).toEqual(true);
                                });
                        });
                });
        });

            describe("replaceChain()" , function(){

                beforeEach(function(){
                    errorMock = jest.fn();
                    logMock = jest.fn();

                    global.console.error = errorMock;
                    global.console.log = logMock;

                });


                describe("when the chain is not longer" , function(){
                    it("it does not replace the chian" , function(){
                            newChain.chain[0] = {new : "chain"};
                            blockChain.replaceChian(newChain.chain);
                            expect(blockChain.chain).toEqual(orignalChain);
                    });
                    it("logs an error" , function(){
                        newChain.chain[0] = {new : "chain"};
                        blockChain.replaceChian(newChain.chain);
                        expect(errorMock).toHaveBeenCalled();
                    });
                });
                describe("when the chain is longer" , function(){
                    describe("if the chain is invalid" , function(){
                        it("it does not replace the chain" , function(){
                            newChain.addBlock({data : "harry"});
                            newChain.addBlock({data : "ron"});
                            newChain.addBlock({data : "hermione"});
                            newChain.chain[2].lastHash = "broken-lasthash";
                            blockChain.replaceChian(newChain.chain);
                            expect(blockChain.chain).toEqual(orignalChain);

                        });
                        it("logs an error" , function(){
                            newChain.addBlock({data : "harry"});
                            newChain.addBlock({data : "ron"});
                            newChain.addBlock({data : "hermione"});
                            newChain.chain[2].lastHash = "broken-lasthash";
                            blockChain.replaceChian(newChain.chain);
                            expect(errorMock).toHaveBeenCalled();
                        });
                    });
                    describe("if the chain is valid" , function(){
                        it("it does replace the chain" , function(){
                            newChain.addBlock({data : "harry"});
                            newChain.addBlock({data : "ron"});
                            newChain.addBlock({data : "hermione"});
                            blockChain.replaceChian(newChain.chain);
                            expect(blockChain.chain).toEqual(newChain.chain);
                        });
                        it("chain has been replaced" , function(){
                            newChain.addBlock({data : "harry"});
                            newChain.addBlock({data : "ron"});
                            newChain.addBlock({data : "hermione"});
                            blockChain.replaceChian(newChain.chain);
                            expect(logMock).toHaveBeenCalled();
                        });
                    });
                    

                });
            });
});

