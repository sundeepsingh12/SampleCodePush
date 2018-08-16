'use strict'

import { setState, showToastAndAddUserExceptionLog } from '../global/globalActions'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { postAssignmentService } from '../../services/classes/PostAssignment'
import { PENDING, SET_POST_ASSIGNMENT_TRANSACTION_LIST, SET_POST_ASSIGNMENT_ERROR, SET_POST_SCAN_SUCCESS, } from '../../lib/constants'
import { jobStatusService } from '../../services/classes/JobStatus'
import { jobMasterService } from '../../services/classes/JobMaster'
import { DISMISS } from '../../lib/ContainerConstants'
import { Toast } from 'native-base'

/**
 * This function fetch job transactions based on job master id
 * @param {*} jobMasterId 
 */
export function fetchUnseenJobs(jobMasterId) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_POST_ASSIGNMENT_TRANSACTION_LIST, { jobTransactionMap: null, loading: true, jobMaster: null }))
            const jobMaster = await jobMasterService.getJobMasterFromJobMasterList(jobMasterId)
            let unseenJobTransactionDTO = await jobTransactionService.getUnseenJobTransaction(jobMasterId)
            dispatch(setState(SET_POST_ASSIGNMENT_TRANSACTION_LIST, { jobTransactionMap: unseenJobTransactionDTO.jobTransactionMap, pendingCount: unseenJobTransactionDTO.pendingCount, loading: false, jobMaster: jobMaster[0] }))
        } catch (error) {
            showToastAndAddUserExceptionLog(1702, error.message, 'danger', 1)
            dispatch(setState(SET_POST_ASSIGNMENT_TRANSACTION_LIST, { jobTransactionMap: null, loading: false, jobMaster: null }))
        }
    }
}

/**
 * This function takes action for scanned job reference number accordingly
 * @param {*} referenceNumber 
 * @param {*} jobTransactionMap 
 * @param {*} jobMaster 
 * @param {*} isForceAssignmentAllowed 
 * @param {*} pendingCount 
 * @param {*} calledFromScan 
 */
export function checkScannedJob(referenceNumber, jobTransactionMap, jobMaster, isForceAssignmentAllowed, pendingCount, calledFromScan) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_POST_ASSIGNMENT_TRANSACTION_LIST, { jobTransactionMap, loading: true, pendingCount, scanError: null, jobMaster, scanSuccess: false }));
            let pendingStatus = await jobStatusService.getStatusForJobMasterIdAndCode(jobMaster.id, PENDING);
            let jobTransactionMapClone = JSON.parse(JSON.stringify(jobTransactionMap));
            let transactionObject = await postAssignmentService.checkScanResult(referenceNumber, jobTransactionMapClone, pendingStatus, jobMaster, isForceAssignmentAllowed, pendingCount);
            if (transactionObject.scanError && transactionObject.scanError !== '') {
                Toast.show({ text: transactionObject.scanError, buttonText: DISMISS, duration: 10000, buttonTextStyle: { color: "#FFE200" }, });
            }
            if (!calledFromScan || (transactionObject.scanError && transactionObject.scanError !== '')) {
                dispatch(setState(SET_POST_ASSIGNMENT_TRANSACTION_LIST, { jobTransactionMap: transactionObject.jobTransactionMap, loading: false, pendingCount: transactionObject.pendingCount, jobMaster, scanSuccess: false }));
            } else {
                dispatch(setState(SET_POST_ASSIGNMENT_TRANSACTION_LIST, { jobTransactionMap: transactionObject.jobTransactionMap, loading: false, pendingCount: transactionObject.pendingCount, jobMaster, scanSuccess: transactionObject.scanError ? false : true, }));
                setTimeout(() => {
                    dispatch(setState(SET_POST_SCAN_SUCCESS, { scanSuccess: false }));
                }, 3000);
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(1703, error.message, 'danger', 0);
            dispatch(setState(SET_POST_ASSIGNMENT_ERROR, { error: error.message }));
        }
    }
}
