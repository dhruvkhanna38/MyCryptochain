const redis = require("redis");
const Blockchain = require("../blockchain");
const CHANNELS = {TEST : "TEST" , 
                  BLOCKCHAIN : "BLOCKCHAIN"};

class PubSub{
    
    constructor({blockChain}){
        
        this.blockchain =  blockChain;
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();
        this.subscribeToChannels();
        this.subscriber.on("message" , (channel , message)=>this.handleMessage(channel, message));
    }
    handleMessage(channel, message){
        console.log("Message:" , message , " channel:" , channel);
        const parsedMessage = JSON.parse(message);
        if(channel =  CHANNELS.BLOCKCHAIN){
            this.blockchain.replaceChian(parsedMessage);
        }
    }
    subscribeToChannels(){
       Object.values(CHANNELS).forEach(channel=>{
            this.subscriber.subscribe(channel);
       });
    }
    publish({channel , message}){
        this.subscriber.unsubscribe(channel , ()=>{
            this.publisher.publish(channel, message ,  ()=>{
                this.subscriber.subscribe(channel);
            });
        });
    }

    broadcastChain(){
        this.publish({
            channel : CHANNELS.BLOCKCHAIN ,
            message : JSON.stringify(this.blockchain.chain)
        });
    }
}

module.exports = PubSub;