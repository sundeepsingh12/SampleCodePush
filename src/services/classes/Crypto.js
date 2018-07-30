'use strict'

import sha256 from 'crypto-js/sha256';

class Crypto {

  createEncryptionKey(company){
    const key = `!@#$%${company.id}^&${company.code}+_)(*`,blockSize = 16
    const hashDigest = sha256(key);
    const byteArray = this._wordArrayToByteArray(hashDigest.words,blockSize)
    const arrayBuffer = this._byteToUint8Array(byteArray)
    const keyInBase64format = this._arrayBufferToBase64(arrayBuffer)
    return keyInBase64format
  }

    _arrayBufferToBase64(buffer) {
      var binary = '';
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64String = this._btoa(binary);
      return base64String
    }

 //javascript default btoa doesn't work outside of debug js remotely in RN,hence this code is written    
_btoa(input = '') {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = input;
  let output = '';
  for (let block = 0, charCode, i = 0, map = chars; str.charAt(i | 0) || (map = '=', i % 1); output += map.charAt(63 & block >> 8 - i % 1 * 8)) {
    charCode = str.charCodeAt(i += 3 / 4);
    if (charCode > 0xFF) {
      throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
    }
    block = block << 8 | charCode;
  }
  return output;
}


 _wordToByteArray(word, length) {
    var ba = [], i,xFF = 0xFF;
    if (length > 0)
      ba.push(word >>> 24);
    if (length > 1)
      ba.push((word >>> 16) & xFF);
    if (length > 2)
      ba.push((word >>> 8) & xFF);
    if (length > 3)
      ba.push(word & xFF);
  
    return ba;
  }

   _byteToUint8Array(byteArray) {
    var uint8Array = new Uint8Array(byteArray.length);
    for(var i = 0; i < uint8Array.length; i++) {
        uint8Array[i] = byteArray[i];
    }
    return uint8Array;
}

_wordArrayToByteArray(wordArray, length) {
    if (wordArray.hasOwnProperty("sigBytes") && wordArray.hasOwnProperty("words")) {
      length = wordArray.sigBytes;
      wordArray = wordArray.words;
    }
  
    var result = [],bytes,i = 0;
    while (length > 0) {
      bytes = this._wordToByteArray(wordArray[i], Math.min(4, length));
      length -= bytes.length;
      result.push(bytes);
      i++;
    }
    return [].concat.apply([], result);
  }
}

export let cryptoService = new Crypto()