const crypto = require("crypto");
const hexToBinary = require("hex-to-binary");

const cryptoHash = function(...inputs){
    const hash = crypto.createHash("sha256");
    hash.update(inputs.sort().join(' '));
    return (hash.digest('hex'));
}

module.exports = cryptoHash;