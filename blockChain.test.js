const BlockChain = require("./blockChain");
const Block = require("./block");


describe("BlockChain()" , function(){
    const blockChain = new BlockChain();

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
});