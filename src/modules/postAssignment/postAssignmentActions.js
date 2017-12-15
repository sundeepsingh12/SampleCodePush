'use strict'

import { setState } from '../global/globalActions'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { moduleCustomizationService } from '../../services/classes/ModuleCustomization'
import { jobMasterService } from '../../services/classes/JobMaster'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { postAssignmentService } from '../../services/classes/PostAssignment'
import {
    CUSTOMIZATION_APP_MODULE,
    JOB_MASTER,
    SET_JOB_MASTER_LIST,
    SET_POST_ASSIGNMENT_TRANSACTION_LIST,
    SET_POST_ASSIGNMENT_ERROR,
    SET_POST_SCAN_SUCCESS,
    SET_POST_ASSIGNMENT_PARAMETERS,
} from '../../lib/constants'

import {
    JOB_ASSIGNMENT
} from '../../lib/AttributeConstants'
import { jobStatusService } from '../../services/classes/JobStatus';

/**
 * This action fetch job master list for order assignment module
 */
export function fetchJobMasterList() {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_JOB_MASTER_LIST, {
                jobMasterList: undefined,
                loading: true
            }))
            const appModulesList = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
            const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
            let jobAssignmentModule = moduleCustomizationService.getModuleCustomizationForAppModuleId(appModulesList.value, JOB_ASSIGNMENT)
            let remarks = jobAssignmentModule.length == 0 ? null : jobAssignmentModule[0].remark ? JSON.parse(jobAssignmentModule[0].remark) : null
            let preAssignmentList = remarks ? remarks.preAssignmentList : null
            let postAssignmentList = remarks ? remarks.postAssignmentList : null
            let orderJobMasterList = jobMasterService.getJobMasterListFromPostAndPreAssignmentList(postAssignmentList, preAssignmentList, jobMasterList.value)
            dispatch(setState(SET_JOB_MASTER_LIST, {
                jobMasterList: orderJobMasterList,
                loading: false
            }))
            dispatch(setState(
                SET_POST_ASSIGNMENT_PARAMETERS, {
                    isManualSelectionAllowed: remarks ? remarks.isManualSelectionAllowed : null,
                    isForceAssignmentAllowed: remarks ? remarks.isForceAssignmentAllowed : null
                }
            ))
        } catch (error) {
            console.log(error)
        }
    }
}

export function fetchUnseenJobs(jobMaster) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_POST_ASSIGNMENT_TRANSACTION_LIST, {
                jobTransactionList: null,
                loading: true
            }))
            let unseenJobTransactionDTO = await jobTransactionService.getUnseenJobTransaction(jobMaster)
            console.log(unseenJobTransactionDTO)
            console.log(unseenJobTransactionDTO)
            dispatch(setState(SET_POST_ASSIGNMENT_TRANSACTION_LIST, {
                jobTransactionMap: unseenJobTransactionDTO.jobTransactionMap,
                pendingCount: unseenJobTransactionDTO.pendingCount,
                loading: false
            }))
        } catch (error) {
            console.log(error)
        }
    }
}

export function checkScannedJob(referenceNumber, jobTransactionMap, jobMaster, isForceAssignmentAllowed, pendingCount) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_POST_ASSIGNMENT_TRANSACTION_LIST, {
                jobTransactionMap,
                loading: true,
                pendingCount: pendingCount,
                scanError: null
            }))
            console.log('jobTransactionList', jobTransactionMap)
            let pendingStatusId = await jobStatusService.getStatusIdForJobMasterIdAndCode(jobMaster.id, "PENDING")
            console.log(pendingStatusId)
            let jobTransactionMapClone = _.cloneDeep(jobTransactionMap)
            let transactionObject = await postAssignmentService.checkScanResult(referenceNumber, jobTransactionMapClone, pendingStatusId, jobMaster, isForceAssignmentAllowed, pendingCount)
            if (transactionObject.scanError && transactionObject.scanError !== '') {
                dispatch(setState(SET_POST_ASSIGNMENT_TRANSACTION_LIST, {
                    jobTransactionMap: transactionObject.jobTransactionMap,
                    loading: false,
                    pendingCount: transactionObject.pendingCount,
                    scanError: transactionObject.scanError
                }))
            } else {
                dispatch(setState(SET_POST_SCAN_SUCCESS, {
                    scanSuccess: transactionObject.scanError ? false : true,
                }))
                setTimeout(() => {
                    dispatch(setState(SET_POST_ASSIGNMENT_TRANSACTION_LIST, {
                        jobTransactionMap: transactionObject.jobTransactionMap,
                        loading: false,
                        pendingCount: transactionObject.pendingCount,
                        scanError: transactionObject.scanError
                    }))
                }, 3000);
            }

        } catch (error) {
            dispatch(setState(SET_POST_ASSIGNMENT_ERROR, {
                error: error.message
            }))
        }
    }
}
