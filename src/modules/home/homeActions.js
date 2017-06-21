'use strict'

import { homeService } from '../../services/classes/Home'
const {
  JOB_FETCHING_START,
  JOB_FETCHING_WAIT
} = require('../../lib/constants').default


export function jobDownload(jobTransactions) {
    return {
        type: JOB_FETCHING_START,
        payload : jobTransactions
    }
}

export function isFetchingFalse() {
    return {
        type: JOB_FETCHING_WAIT,
        payload : true
    }
}

export function fetchJobs(pageNumber) {
    return async function (dispatch) {
        try {
            dispatch(isFetchingFalse())
            console.log('pageNumber')
            console.log(pageNumber)
            console.log('fetchJobs action')
            var data = await homeService.getConfigurations(pageNumber)
            console.log('data fetchJobs')
            console.log(data)
            dispatch(jobDownload(data))
        } catch (error) {
            console.log(error)
        }
    }
}