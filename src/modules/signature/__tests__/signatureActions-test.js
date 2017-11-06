'use strict'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'

var actions = require('../signatureActions')
const {
    SET_FIELD_DATA_LIST,
    SAVE_SIGNATURE,
    USER,
    FormLayout,
    UPDATE_FIELD_DATA_WITH_CHILD_DATA
} = require('../../../lib/constants').default
import { signatureService } from '../../../services/classes/SignatureRemarks'
import {
    SIGNATURE,
    NPS_FEEDBACK
} from '../../../lib/AttributeConstants'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('signature actions', () => {
    it('should set field data list', () => {
        const fieldDataList = 'this is field data list object'
        expect(actions.setFieldDataList(fieldDataList)).toEqual({
            type: SET_FIELD_DATA_LIST,
            payload: fieldDataList
        })
    })
    it('filters remarks list and set in field data list', () => {
        const remarksList = [
            {
                label: 'hi',
                value: 'hello'
            }
        ]
        const expectedActions = [
            {
                type: SET_FIELD_DATA_LIST,
                payload: remarksList
            },
        ]
        signatureService.filterRemarksList = jest.fn()
        signatureService.filterRemarksList.mockReturnValue(remarksList)
        const store = mockStore({})
        return store.dispatch(actions.getRemarksList(remarksList))
            .then(() => {
                expect(signatureService.filterRemarksList).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
    it('should save signature and nps rating in form layout state', () => {
        const expectedActions = [
            {
                type: UPDATE_FIELD_DATA_WITH_CHILD_DATA,
            },
        ]

        const testSignature = 'test1'
        const testRating = '1'
        const signatureValue = 'signature.jpg'
        let parameters = {
            currentElement: {
                fieldAttributeMasterId: 10,
                positionId: 10
            },
            formElement: {value:{
                fieldAttributeMasterId: 10,
                positionId: 10
            }},
            nextEditable: {},
            isSaveDisabled: true,
            latestPositionId: 2,
            jobTransactionId: 123
        }
        let fieldAttributeMasterList = {
            value:
            [{
                id: 1,
                attributeTypeId: SIGNATURE,
                parentId: 10,
            },
            {
                id: 2,
                attributeTypeId: NPS_FEEDBACK,
                parentId: 10,

            },
            {
                id: 3,
                attributeTypeId: 18,
            }]
        }
        const childFieldDataList = {
            "fieldDataList": [
                {
                    fieldAttributeMasterId: 1,
                    attributeTypeId: SIGNATURE,
                    value: signatureValue,
                    parentId: 10,
                    positionId: 3,
                    jobTransactionId: 123
                },
                {
                    fieldAttributeMasterId: 2,
                    attributeTypeId: NPS_FEEDBACK,
                    value: testRating,
                    parentId: 10,
                    positionId: 4,
                    jobTransactionId: 123

                }
            ],
            "latestPositionId": 4
        }

        signatureService.saveFile = jest.fn();
        signatureService.saveFile.mockReturnValue(signatureValue)
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(fieldAttributeMasterList)
        const store = mockStore({})
        return store.dispatch(actions.saveSignatureAndRating(signatureValue,
            testRating,
            parameters.currentElement,
            parameters.formElement,
            parameters.nextEditable,
            parameters.isSaveDisabled,
            parameters.jobTransactionId,
            parameters.latestPositionId))
            .then(() => {
                expect(signatureService.saveFile).toHaveBeenCalled()
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(signatureService.prepareSignAndNpsFieldData(signatureValue, testRating, parameters.currentElement, fieldAttributeMasterList, parameters.jobTransactionId, parameters.latestPositionId)).toEqual(childFieldDataList)
            })
    })

}
)    