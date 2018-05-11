
import Aes from '../classes/Aes'

describe('test cipher', () => {
    it('should return cipher', () => {
        let input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 8, 7, 6, 5, 4, 3]
        let w = [1, 2, 3, 4]
        let result = [124, 111, 48, 123, 107, 1, 242, 242, 1, 107, 123, 48, 111, 119, 197, 197]
        expect(Aes.cipher(input, w)).toEqual(result)
    })

    it('should return key expansion', () => {
        let key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 8, 7, 6, 5, 4, 3]
        let result = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 9, 8, 7], [6, 5, 4, 3], [107, 240, 120, 107], [110, 246, 127, 99], [103, 255, 119, 100], [97, 250, 115, 103], [68, 127, 253, 132], [42, 137, 130, 231], [77, 118, 245, 131], [44, 140, 134, 228], [36, 59, 148, 245], [14, 178, 22, 18], [67, 196, 227, 145], [111, 72, 101, 117], [126, 118, 9, 93], [112, 196, 31, 79], [51, 0, 252, 222], [92, 72, 153, 171], [60, 152, 107, 23], [76, 92, 116, 88], [127, 92, 136, 134], [35, 20, 17, 45], [230, 26, 179, 49], [170, 70, 199, 105], [213, 26, 79, 239], [246, 14, 94, 194], [13, 66, 150, 115], [167, 4, 81, 26], [114, 30, 30, 245], [132, 16, 64, 55], [71, 75, 12, 44], [224, 79, 93, 54], [146, 81, 67, 195], [22, 65, 3, 244], [223, 48, 179, 107], [63, 127, 238, 93], [173, 46, 173, 158], [187, 111, 174, 106], [65, 212, 177, 129], [126, 171, 95, 220], [211, 133, 242, 66], [104, 234, 92, 40]]
        expect(Aes.keyExpansion(key)).toEqual(result)
    })
})


