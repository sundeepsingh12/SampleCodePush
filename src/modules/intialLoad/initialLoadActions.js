import { keyValueDBService } from '../../services/classes/KeyValueDBService';
import { navDispatch } from '../navigators/NavigationService'
import { NavigationActions } from 'react-navigation'
import { APP_THEME } from '../../lib/constants'
import feStyle from '../../themes/FeStyle'

export function initialLoadAction() {
    return async () => {
        await checkForLoggedIn();
    }
}

export async function checkForLoggedIn() {
    try {
        const response = await keyValueDBService.getValueFromStore('LOGGED_IN_ROUTE')
        const appTheme = await keyValueDBService.getValueFromStore(APP_THEME);
        if (appTheme && appTheme.value) {
            feStyle.primaryColor = appTheme.value
            feStyle.bgPrimaryColor = appTheme.value
            feStyle.fontPrimaryColor = appTheme.value
            feStyle.shadeColor = appTheme.value + '98'
            feStyle.borderLeft4Color = appTheme.value
        }
        if (!response) {
            navDispatch(NavigationActions.navigate({ routeName: 'AuthRoute' }));
        }
        else {
            const { value: loggedInRoute } = response;
            navDispatch(NavigationActions.navigate({ routeName: loggedInRoute }));
        }
    }
    catch (error) {
        navDispatch(NavigationActions.navigate({ routeName: 'AuthRoute' }));
    }
}
