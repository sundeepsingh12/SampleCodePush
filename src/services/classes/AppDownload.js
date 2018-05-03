
import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'
import {
    GET,
} from '../../lib/AttributeConstants'

class AppDownload{

    getDownloadLinkFromServer(token,applicationVersion){
        const url = CONFIG.API.IOS_DOWNLOAD_URL + '?applicationVersion='+applicationVersion
        let appDownloadResponse = RestAPIFactory(token).serviceCall(null, url, GET)
        return appDownloadResponse
    }

}

export let appDownload = new AppDownload()