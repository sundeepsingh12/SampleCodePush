require('regenerator/runtime')

export default class AuthenticationInterface {
    /**
     * ### login
     *
     * @param
     * * * * *  FORM DATA * * * * * * *
     *  j_username : 597ede
     *  j_password : 5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5
     *
     *
     *  * @returns
     * * * * *  HEADERS  * * * * * * *
     * status: 200 | 403
     * JSESSIONID: "r:Kt9wXIBWD0dNijNIq2u5rRllW"

     */
    login (j_username, j_password) {

    }

    /**
     * This saves JsessionID in store
     * @param jsessionId
     *
     * @return
     * isSavingSucessful :true
     */
    saveJSessionId(jsessionId) {

    }

    /**
     * This gets JsessionId from store
     * @return
     * jsessionId
     *
     */
   getJSessionId(){}

}