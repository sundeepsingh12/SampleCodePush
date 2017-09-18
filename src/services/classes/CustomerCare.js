'use strict'

class CustomerCare {

    /**
     * 
     * @param {*} customerCareList 
     * @returns
     * CustomerCareMap : {
     *                      JobMasterId : [CustomerCare]
     *                   }
     */
    getCustomerCareMap(customerCareList) {
        let customerCareMap = {}
        customerCareList = customerCareList ? customerCareList : []
        customerCareList.forEach(customerCare => {
            customerCareMap[customerCare.jobMasterId] = customerCareMap[customerCare.jobMasterId] ? customerCareMap[customerCare.jobMasterId] : []
            customerCareMap[customerCare.jobMasterId].push(customerCare)
        })

        return customerCareMap
    }
}

export let customerCareService = new CustomerCare()