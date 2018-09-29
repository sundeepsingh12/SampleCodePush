import { navDispatch } from '../navigators/NavigationService'
import { NavigationActions } from 'react-navigation'

export function initialLoadAction() {
    return async () => {
        await checkForLoggedIn();
    }
}

export async function checkForLoggedIn() {
    try {
    }
    catch (error) {
        navDispatch(NavigationActions.navigate({ routeName: 'AuthRoute' }));
    }
}
