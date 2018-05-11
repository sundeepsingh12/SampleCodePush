
import AesCtr from '../classes/AesCtr'

describe('test encrypt', () => {
    let plaintext = 'test', password = 'pass', nBits = 256, counterBlock = [1, 2, 3, 4, 5, 6, 7, 8]

    it('should return  encrypted text', () => {
        expect(AesCtr.encrypt(plaintext, password, nBits, counterBlock)).toEqual('AQIDBAUGBwhuC2ac')
    })

    it('should return  decrypted text', () => {
        expect(AesCtr.decrypt('AQIDBAUGBwhuC2ac', password, nBits)).toEqual(plaintext)
    })

})



