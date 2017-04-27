/**
 * Created by udbhav on 12/4/17.
 */

export default class JobMasterInterface{



    /**This saves entire companyObject in store
     *
     * @param companyObject
     * @return
     * isSaveSuccess: true
     */
    saveCompanyObject(companyObject){}

    /**
     *
     * @return
     * companyObject
     */

    getCompanyObject(){}


    matchServerTimeWithMobileTime(serverTime){
    }

    /**
     * This saves entire jobMaster array in store and returns true if saving was successful
     * @param jobMaster
     *
     * @return
     * isSaveSuccess : false
     */
    saveJobMaster(jobMaster){

    }

    /**
     * @return
     * jobMaster
     */
    getJobMaster(){}


    saveFieldAttributeMaster(fieldAttributeMaster){

    }

    /**
     *
     * @return
     * fieldAttributeMaster
     */
    getFieldAttributeMaster(){}

    saveJobAttributesMaster(jobAttributesMaster){}

    getJobAttributesMaster(){}


    saveJobAttributesValueMaster(jobAttributesValueMaster){}



    getJobAttributesValueMaster(){}


    saveFieldAttributesValueMaster(fieldAttributesValueMaster){}

    getFieldAttributesValueMaster(){}


    saveJobStatus(jobStatus){}

    getJobStatus(){}


    saveCustomizationAppModules(customizationAppModules){

    }

    getCustomizationAppModules(){}


    saveCustomizationJobList(customizationJobList){

    }

    getCustomizationJobList(){}


    saveTabs(tabs){}

    getTabs(){}

    saveJobMoneyTransactionMode(jobMoneyTransactionMode){}

    getJobMoneyTransactionMode(){}


    saveCustomerCare(customerCare){}



    saveSmsTemplate(smsTemplate){}

    getSmsTemplate(){}


    saveFieldAttributeStatus(fieldAttributeStatus){}

    getFieldAttributeStatus(){}


    saveFieldValidations(fieldValidations){}

    getFieldValidations(){}


    saveFieldValidationsConditions(fieldValidationsConditions){}

    getFieldValidationsConditions(){}


    saveSmsJobStatuses(smsJobStatuses){}

    getSmsJobStatuses(){}






}

