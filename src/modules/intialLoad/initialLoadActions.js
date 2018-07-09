import { keyValueDBService } from '../../services/classes/KeyValueDBService';
import { navDispatch } from '../navigators/NavigationService'
import { NavigationActions } from 'react-navigation'

export function initialLoadAction() {
    return async () => {
        await checkForLoggedIn();
    }
}

export async function checkForLoggedIn() {
    try{    
        const response =  await keyValueDBService.getValueFromStore('LOGGED_IN_ROUTE')
        if(!response){
            navDispatch(NavigationActions.navigate({ routeName: 'AuthRoute' }));
        }
        else {
            const { value: loggedInRoute } = response;
            navDispatch(NavigationActions.navigate({ routeName: loggedInRoute }));
        }
    }
    catch(error) {
        navDispatch(NavigationActions.navigate({ routeName: 'AuthRoute' }));
    }
}
