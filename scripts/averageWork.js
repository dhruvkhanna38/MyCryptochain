const BlockChain = require("../blockchain/index");

var blockChain = new BlockChain();

blockChain.addBlock({data : "initial"});

var prevTimestamp , nextTimestamp, timeDiff, nextBlock, average;
var times = [];
var sum =0;

for(var i =0;i<10000;i++){
    prevTimestamp = blockChain.chain[blockChain.chain.length-1].timestamp;
    var blockchainData = "data" + i ;
    blockChain.addBlock({data : blockchainData});
    nextBlock = blockChain.chain[blockChain.chain.length-1];
    nextTimestamp =  nextBlock.timestamp;
    timeDiff = nextTimestamp -  prevTimestamp;
    times.push(timeDiff);
    sum = sum + timeDiff;
    console.log("average = ", sum/times.length);
    console.log("difficulty= ", nextBlock.difficulty);
    console.log("timeDiff= ", timeDiff);
}
