'use strict'
import { NetInfo } from 'react-native'

class Utilities {

    async checkInternetConnection() {
        let connectionInfo = await NetInfo.getConnectionInfo().then(reachability => {
            if (reachability.type === 'unknown') {
                return new Promise(resolve => {
                    const handleFirstConnectivityChangeIOS = isConnected => {
                        NetInfo.isConnected.removeEventListener('connectionChange', handleFirstConnectivityChangeIOS);
                        resolve(isConnected);
                    };
                    NetInfo.isConnected.addEventListener('connectionChange', handleFirstConnectivityChangeIOS);
                });
            }
            return (reachability.type !== 'none' && reachability.type !== 'unknown')
        });
        return connectionInfo
    }
}

export let utilitiesService = new Utilities()