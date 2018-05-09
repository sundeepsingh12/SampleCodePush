
import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'
import {
    GET,
} from '../../lib/AttributeConstants'

class AppDownload{

    getDownloadLinkFromServer(token,applicationVersion){
        console.log('getDownloadLinkFromServer called >>>>')
        const url = CONFIG.API.IOS_DOWNLOAD_URL + '?applicationVersion='+applicationVersion
        console.log('url >>>>>'+url)
        let appDownloadResponse = RestAPIFactory(token).serviceCall(null, url, GET)
        console.log('appDownloadResponse >>>>>'+appDownloadResponse)
        return appDownloadResponse
    }

}

export let appDownload = new AppDownload()