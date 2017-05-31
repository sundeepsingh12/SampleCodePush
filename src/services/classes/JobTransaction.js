import * as realm from '../../repositories/realmdb'
const {
  TABLE_JOB_TRANSACTION,
} = require('../../lib/constants').default
class JobTransaction {

/**A Generic method for filtering out jobtransactions whose job status ids lie in 'statusids'  
 * 
 * @param {*} allJobTransactions 
 * @param {*} statusIds 
 */
  getUnseenJobTransactions(allJobTransactions, statusIds) {
    // let unseenJobTransactions = []
    // allJobTransactions.forEach(jobTransactionObject => {
    //   if (statusIds.includes(jobTransactionObject.jobStatusId)) {
    //     unseenJobTransactions.push(jobTransactionObject)
    //   }
    // })
    console.log(Object.keys(allJobTransactions))
    const unseenJobTransactions= allJobTransactions.filter(jobTransactionObject => unseenStatusIds.includes(jobTransactionObject.jobStatusId))
   
    return unseenJobTransactions
  }

  getAllJobTransactions() {
    const allJobTransactions = realm.getAll(TABLE_JOB_TRANSACTION)
    return allJobTransactions
  }
}

export let jobTransactionService = new JobTransaction()
