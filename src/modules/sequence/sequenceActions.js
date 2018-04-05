
import {
    sequenceService
} from '../../services/classes/Sequence'
import {
    runSheetService
} from '../../services/classes/RunSheet'
import {
    keyValueDBService
} from '../../services/classes/KeyValueDBService'
import {
    SEQUENCE_LIST_FETCHING_START,
    SEQUENCE_LIST_FETCHING_STOP,
    PREPARE_UPDATE_LIST,
    SET_RUNSHEET_NUMBER_LIST,
    SET_RESPONSE_MESSAGE,
    Sequence,
    CLEAR_TRANSACTIONS_WITH_CHANGED_SEQUENCE_MAP,
    SEQUENCE_LIST_ITEM_DRAGGED,
    SET_SEQUENCE_LIST_ITEM,
    CUSTOMIZATION_LIST_MAP,
    SequenceRunsheetList
} from '../../lib/constants'
import {
    DUPLICATE_SEQUENCE_MESSAGE,
    SAVE_SUCCESSFUL,
    UNTRACKED_JOBS_MESSAGE,
    TOKEN_MISSING,
    INVALID_SCAN,
    JOB_NOT_PRESENT
} from '../../lib/ContainerConstants'
import {
    setState, navigateToScene
} from '../global/globalActions'
import CONFIG from '../../lib/config'
import _ from 'lodash'

/**
 * @param {*} runsheetNumber 
 * @param {*} jobMasterIds
 * This method prepare jobTransaction list for given runsheet and jobMasterIds
 * and check if there is duplicate sequence number present or not
 */
export function prepareListForSequenceModule(runsheetNumber, jobMasterIds) {
    return async function (dispatch) {
        try {
            //Set loader
            dispatch(setState(SEQUENCE_LIST_FETCHING_START))
            const jobMasterIdCustomizationMap = await keyValueDBService.getValueFromStore(CUSTOMIZATION_LIST_MAP)
            //create seperator map so that if sequence is changed and routing sequence number
            //is enabled then we can change text for line1, line2, circle1, circle2
            const jobMasterSeperatorMap = sequenceService.createSeperatorMap(jobMasterIdCustomizationMap)

            //get jobTransaction List with given runsheet number and jobMasterIds
            const sequenceList = await sequenceService.getSequenceList(runsheetNumber, JSON.parse(jobMasterIds))
            // case of Auto-Sequencing :- check for duplicate sequence if present then add those transactions whose sequence is changed to a temprorary map i.e. transactionsWithChangedSeqeunceMap
            const { isDuplicateSequenceFound, sequenceArray, transactionsWithChangedSeqeunceMap } = await sequenceService.checkForAutoSequencing(sequenceList, jobMasterSeperatorMap)
            dispatch(setState(SEQUENCE_LIST_FETCHING_STOP, {
                sequenceList: sequenceArray,
                responseMessage: (isDuplicateSequenceFound) ? DUPLICATE_SEQUENCE_MESSAGE : '',//show a toast if duplicate sequence is there
                transactionsWithChangedSeqeunceMap,//map containing those transaction whose sequence is changed, it will be empty if auto sequence does't occur 
                jobMasterSeperatorMap
            }))
        } catch (error) {
            // TODO
            //set toast if an error occured
            dispatch(setState(SET_RESPONSE_MESSAGE, error.message))
        }
    }
}

/**
 * @param {*} sequenceList 
 * 
 * This method resequence jobs by hitting an API and getting resequenced jobs and set it to sequence list 
 */
export function resequenceJobsFromServer(sequenceList) {
    return async function (dispatch) {
        try {
            dispatch(setState(SEQUENCE_LIST_FETCHING_START))
            // prepare request body for post request
            const sequenceRequestDto = await sequenceService.prepareRequestBody(sequenceList)
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            if (!token) {
                throw new Error(TOKEN_MISSING)
            }
            //hit an api with sequenceRequestDto as request body
            const sequenceResponse = await sequenceService.fetchResequencedJobsFromServer(token.value, sequenceRequestDto)
            const responseBody = await sequenceResponse.json
            //server will return response which may contain unAllocatedTransactionIds depending upon response body
            const unallocatedTransactionCount = responseBody.unAllocatedTransactionIds.length
            const updatedSequenceList = await sequenceService.processSequenceResponse(responseBody, sequenceList)//update sequence list and update jobTransactionDB
            dispatch(setState(PREPARE_UPDATE_LIST, {
                updatedSequenceList,
                responseMessage: (unallocatedTransactionCount) ? unallocatedTransactionCount + UNTRACKED_JOBS_MESSAGE : ''//if unallocatedTransactionCount present than show its couont in a toast 
            }))
        } catch (error) {
            // TODO
            dispatch(setState(PREPARE_UPDATE_LIST, {
                updatedSequenceList: sequenceList,
                responseMessage: error.message,
            }))
        }
    }
}

/**
 * This method get all runsheet available and if only one runsheet is present
 * then navigate to sequence container if no runsheet is present then show a toast
 * @param {*String} pageObject //pageobject from server 
 */
export function getRunsheetsForSequence(pageObject) {
    return async function (dispatch) {
        try {
            //set loader to true
            dispatch(setState(SEQUENCE_LIST_FETCHING_START))
            //get all runsheet
            //TODO get runsheets for selected jobMasters
            const runsheetNumberList = await runSheetService.getRunsheets()
            dispatch(setState(SET_RUNSHEET_NUMBER_LIST, runsheetNumberList))
            //In case of single runsheet navigate to sequence container
            if (_.size(runsheetNumberList) == 1) {
                dispatch(navigateToScene(Sequence, {
                    runsheetNumber: runsheetNumberList[0],
                    jobMasterIds: pageObject.jobMasterIds
                }))
            } else if (_.size(runsheetNumberList) > 1) {//if more than 1 runsheet present then show list
                dispatch(navigateToScene(SequenceRunsheetList, {
                    displayName: pageObject.name,
                    jobMasterIds: pageObject.jobMasterIds
                }))
            }
        } catch (error) {
            // TODO
            dispatch(setState(SET_RESPONSE_MESSAGE, error.message))
        }
    }
}

/**
 * When user drags and drop sequence list item this method is called
 * @param {*Object} rowParam //{ to, //final drag position
 *                               from ,//intial position
 *                               jobTransaction   
 *                              }
 * @param {*Array} sequenceList 
 * @param {*Object} transactionsWithChangedSeqeunceMap 
 */
export function rowMoved(rowParam, sequenceList, transactionsWithChangedSeqeunceMap, jobMasterSeperatorMap) {
    return async function (dispatch) {
        try {
            let { cloneSequenceList, newTransactionsWithChangedSeqeunceMap } = await sequenceService.onRowDragged(rowParam, sequenceList, transactionsWithChangedSeqeunceMap, jobMasterSeperatorMap)
            dispatch(setState(SEQUENCE_LIST_ITEM_DRAGGED, {
                sequenceList: cloneSequenceList,
                transactionsWithChangedSeqeunceMap: newTransactionsWithChangedSeqeunceMap,
            }))
        } catch (error) {
            //TODO
            dispatch(setState(SET_RESPONSE_MESSAGE, error.message))
        }
    }
}

/**
 * @param {*Object} transactionsWithChangedSeqeunceMap 
 * 
 * This method saves transactions which have changed sequence
 */
export function saveSequencedJobTransactions(transactionsWithChangedSeqeunceMap) {
    return async function (dispatch) {
        try {
            dispatch(setState(SEQUENCE_LIST_FETCHING_START))
            //update jobTransaction in DB and set start module so as if it get open it will reload
            await sequenceService.updateJobTrasaction(transactionsWithChangedSeqeunceMap)
            dispatch(setState(CLEAR_TRANSACTIONS_WITH_CHANGED_SEQUENCE_MAP, SAVE_SUCCESSFUL))//clear transactionsWithChangedSeqeunceMap to empty
        } catch (error) {
            // TODO
            dispatch(setState(SET_RESPONSE_MESSAGE, error.message))
        }
    }
}

/**
 * @param {*String} searchText 
 * @param {*Array} sequenceList 
 * 
 * This method search transaction on given reference number
 */
export function searchReferenceNumber(searchText, sequenceList) {
    return async function (dispatch) {
        try {
            //get jobTransaction from the list when exact match of reference number is found
            let searchObject = sequenceService.searchReferenceNumber(searchText, sequenceList)
            if (!searchObject) {
                throw new Error(INVALID_SCAN)//if no match found show error
            }
            //set jobTransaction whose reference number is matched and open modal so user can change its sequence number
            dispatch(setState(SET_SEQUENCE_LIST_ITEM, searchObject))
        } catch (error) {
            //TODO
            dispatch(setState(SET_RESPONSE_MESSAGE, error.message))
        }
    }
}


/**
 * @param {*} currentSequenceListItemIndex 
 * @param {*} newSequence 
 * @param {*} sequenceList 
 * @param {*} transactionsWithChangedSeqeunceMap 
 * 
 * This method shift rows and set the new rows to sequence list when value is entered from dialog box
 */
export function jumpSequence(currentSequenceListItemIndex, newSequence, sequenceList, transactionsWithChangedSeqeunceMap, jobMasterSeperatorMap) {
    return async function (dispatch) {
        try {
            //below method find final index and runs onRowDragged method
            let { cloneSequenceList, newTransactionsWithChangedSeqeunceMap } = await sequenceService.jumpSequence(currentSequenceListItemIndex, newSequence, sequenceList, transactionsWithChangedSeqeunceMap, jobMasterSeperatorMap)
            dispatch(setState(SEQUENCE_LIST_ITEM_DRAGGED, {
                sequenceList: cloneSequenceList,
                transactionsWithChangedSeqeunceMap: newTransactionsWithChangedSeqeunceMap,
            }))
        } catch (error) {
            //TODO
            dispatch(setState(SET_RESPONSE_MESSAGE, error.message))
        }
    }
}
