'use strict';
var CryptoJS = require("crypto-js");

const secretKey = 'werewolves666';

export function CryptoService(){
    'ngInject';
    
    var Crypto = {

        encrypt(value){
            var ciphertext = CryptoJS.AES.encrypt(value, secretKey);
            return ciphertext.toString();
        },

        decrypt(value){
            var bytes  = CryptoJS.AES.decrypt(value, secretKey);
            var plaintext = bytes.toString(CryptoJS.enc.Utf8);

            return plaintext;
        }

    };

    return Crypto;

}