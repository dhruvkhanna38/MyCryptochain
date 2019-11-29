const express = require("express");
const request = require("request");
const bodyParser = require("body-parser"); 
const Blockchain = require("../Cryptochain/blockchain/index");
const app = express();
const PubSub = require("./app/pubsub");
app.use(bodyParser.json());

const DEFAULT_PORT = 3000;

const blockChain = new Blockchain();
const pubsub = new PubSub({blockChain});

const ROOT_NODE_ADDRESS = "http://localhost:" + DEFAULT_PORT;

setTimeout(function(){
    pubsub.broadcastChain();
 } , 1000);


app.get("/api/blocks" , function(req,res){
    res.json(blockChain.chain);
});

app.post("/api/mine" , function(req,res){
    const data = req.body;
    blockChain.addBlock({data});
    pubsub.broadcastChain();
    res.redirect("/api/blocks");
}); 

const syncChains = function(){
    request({url : ROOT_NODE_ADDRESS+"/api/blocks"} ,  function(error , response, body){
            if(!error  && response.statusCode === 200){
                const rootChain = JSON.parse(body);
                console.log("root chain" , rootChain );
                blockChain.replaceChian(rootChain);
            }
    });
} 

var peerPort;

if(process.env.GENERATE_PEER_PORT === 'true'){
    peerPort = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = peerPort || DEFAULT_PORT;

app.listen(PORT , function(){
    console.log("listening on" , PORT);
    if(PORT !== DEFAULT_PORT){
        syncChains();
    }
   
});