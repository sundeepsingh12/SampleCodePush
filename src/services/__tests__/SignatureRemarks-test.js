'use strict'

import { signatureService } from '../classes/SignatureRemarks'
import moment from 'moment'
import RNFS from 'react-native-fs';
describe('test cases for getFieldAttributeMasterMap', () => {
    const fieldDataList = [
        {
            label: 'xyz',
            value: '1'
        }
    ]

    const fieldDataMap = new Map();
    fieldDataMap[6143] = [{
        label: 'xyz',
        subLabel: null,
        helpText: null,
        key: '7',
        required: false,
        value: '1',
        attributeTypeId: 27,
        fieldAttributeMasterId: 6143,
    }]
    it('should return empty fieldDataList for undefined ', () => {
        expect(signatureService.filterRemarksList(undefined)).toEqual([])
    })

    it('should return empty fieldDataList for empty map', () => {
        expect(signatureService.filterRemarksList([])).toEqual([])
    })
    
    it('should return fieldAttributeMasterMap for fieldAttributeMasterList', () => {
        expect(signatureService.filterRemarksList(fieldDataMap)).toEqual(fieldDataList)
    })

    it('should return image name', () => {
        const result = 'test'
        const currentTimeInMillis = moment()    
        const imagename='sign_' + currentTimeInMillis + '.jpg'
        RNFS.writeFile = jest.fn()
        return signatureService.saveFile(result).then(() => {            
        expect(RNFS.writeFile).toHaveBeenCalledTimes(1)
    })
})
})
