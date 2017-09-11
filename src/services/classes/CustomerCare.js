'use strict'

class CustomerCare {

    /**
     * 
     * @param {*} customerCareList 
     * @returns
     * Map<JobMasterId,[CustomerCare]>
     */
    getCustomerCareMap(customerCareList) {
        let customerCareMap = {}
        if (!customerCareList) {
            customerCareList = []
        }
        customerCareList.forEach(customerCare => {
            if (!customerCareMap[customerCare.jobMasterId]) {
                customerCareMap[customerCare.jobMasterId] = []
            }
            customerCareMap[customerCare.jobMasterId].push(customerCare)
        })

        return customerCareMap
    }
}

export let customerCareService = new CustomerCare()