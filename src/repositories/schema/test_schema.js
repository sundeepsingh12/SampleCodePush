// This file is for testing purpose only (validating json schemas)
const test_schema = {
    "createdDate": "2015-12-31 13:43:07",
    "lastModifiedDate": "2017-05-03 12:31:16",
    "id": 4954,
    "login": "597ede",
    "firstName": "Honk",
    "lastName": "Gama",
    "email": "honk@a",
    "activated": true,
    "autoPushMailActivated": false,
    "langKey": null,
    "activationKey": "06059881142905595138",
    "cityId": 744,
    "hubId": 2757,
    "merchants": null,
    "lastLoginTime": "2017-05-03 12:32:54",
    "hubs": [

    ],
    "userType": {
        "id": 902,
        "name": "Field Executive",
        "role": [
            {
                "id": 11,
                "name": "ROLE_DEVICE"
            }
        ],
        "companyId": 295
    },
    "employeeCode": "honk_gama",
    "mobileNumber": "9717827785",
    "company": {
        "createdDate": "2015-12-31 11:59:15",
        "lastModifiedDate": "2017-03-02 16:27:15",
        "id": 295,
        "name": "gama",
        "code": "gama",
        "timeZone": "Asia/Kolkata",
        "expiryDuration": 24,
        "billingDate": "2015-12-31",
        "billingAddress": "Pitampura",
        "paymentTerms": 0,
        "billingCurrencyId": 18,
        "billingTaxes": [
            {
                "id": 3,
                "name": "Vat",
                "value": "5",
                "description": "Tax as per Mah. govt rules"
            }
        ],
        "companySlabses": [
            {
                "id": 202,
                "companyId": 295,
                "slabStart": 50,
                "slabEnd": 100,
                "fixedAmount": 100.0,
                "unitTransactionAmount": 10.0,
                "reductionFactor": 10.0
            }
        ],
        "postHookUrl": "",
        "erpPullUrl": null,
        "apkVersion": "0.2.3",
        "apkVersionId": 9,
        "currentJobMasterVersion": 4445,
        "postHookServiceCalledAtRunSheetClosed": true,
        "enable": true,
        "customLoginActivated": false,
        "customErpPullActivated": true,
        "customLoginUrl": null,
        "postHookCalledAtUnseenAndPending": true,
        "autoLogoutFromDevice": true,
        "paidAutoRoutingActivated": true,
        "autoRoutingExpiryDate": "2017-07-06",
        "autoRoutingCreditPerDay": 10000,
        "imeiRestriction": false,
        "imeiRestrictionWithHub": false,
        "singleLogin": false,
        "allowOffRouteNotification": true
    },
    "locked": false,
    "isLoggedIn": true,
    "accountNonExpired": true,
    "accountNonLocked": true,
    "credentialsNonExpired": true,
    "authorities": [
        {
            "authority": "ROLE_DEVICE"
        }
    ],
    "username": "597ede",
    "enabled": true,
    "lastLoginDuration": "1 secs ago"

};

module.exports = test_schema;