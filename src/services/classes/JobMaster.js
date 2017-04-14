/**
 * Created by udbhav on 12/4/17.
 */

import JobMasterInterface  from '../interfaces/JobMasterInterface'

class JobMaster extends JobMasterInterface{
    downloadJobMaster(deviceIMEI, deviceSIM, currentJobMasterVersion, deviceCompanyId) {
        const postData = JSON.stringify({
            deviceIMEI,
            deviceSIM,
            currentJobMasterVersion,
            deviceCompanyId
        })
        return this._fetch({
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            url: '/rest/device/job_master',
            body: postData
        })
            .then((res) => {
                if (res.status === 200) {
                    var results = this._pruneEmpty(res.json);
                    return results;
                }
            })
            .catch((error) => {
                throw (error)
            })
    }

    matchServerTimeWithMobileTime(serverTime){

    }

    saveJobMaster(){}

}
