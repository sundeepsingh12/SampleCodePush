import Reactotron, {
    trackGlobalErrors,
    openInEditor,
    overlay,
    asyncStorage,
    networking
} from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'
import Immutable from 'immutable'

import { getState } from './src/modules/navigators/NavigationService';

console.logs = function () {
    for (let i in arguments) {
        Reactotron.display({
            name: 'Console Log',
            value: arguments[i],
            preview: JSON.stringify(arguments[i]),
            important: true,
        })
    }
}

console.tron = Reactotron
  
if(__DEV__){
Reactotron //To be added dev under dev flag
    .configure({
    //    host: '192.168.0.108',
        name: "Fareye App"
    }) // Middlewares Now
    .use(reactotronRedux({
        onRestore:(state,oldState) => {
            return {...Immutable.Record(state),auth: {...Immutable.Record(state.auth)}}
        }
    })) //  <- Redux like a govt-run mind control experiment!!
    .use(trackGlobalErrors({
        veto: frame => frame.fileName.indexOf('/node_modules/react-native/') >= 0
    }))
    .use(tron => ({
        onCommand({ type, payload }) {
          if (type === 'custom') {
              if(payload === 'nav')
                console.logs(getState());            
        }
      }}))
    .use(openInEditor())
    .use(overlay())
    .use(asyncStorage())
    .use(networking())
    .connect() //let's connect!!!

}
