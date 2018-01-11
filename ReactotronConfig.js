import Reactotron, {
    trackGlobalErrors,
    openInEditor,
    overlay,
    asyncStorage,
    networking
} from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'

import Immutable from 'immutable'

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

if (__DEV__) {
    Reactotron //To be added dev under dev flag
        .configure({
            host: '192.168.1.120',
            name: "Fareye App"
        }) // controls connection & communication settings
        //.useReactNative()
        .use(reactotronRedux({
            onRestore: (state, oldState) => {
                console.tron.display({
                    name: 'gunn',
                    value: state,
                    important: true
                });
                // for(let i in state) {
                //     //console.tron.log(i)
                //      if(i === 'nav'|| i === 'auth') {
                //          console.tron.log('bazoooka',true)
                //         // newstate[i] = state[i]
                //          continue
                //      }
                //      //console.tron.log(state[i],true)
                //      newstate[i] = Immutable.Record(state[i])
                // }
                // console.tron.log(newstate,true)
                // return newstate
                return { ...Immutable.Record(state), nav: state.nav, auth: { ...Immutable.Record(state.auth) } }
            }
        })) //  <- Redux like a govt-run mind control experiment!!
        .use(trackGlobalErrors({
            veto: frame => frame.fileName.indexOf('/node_modules/react-native/') >= 0
        }))
        .use(openInEditor())
        .use(overlay())
        .use(asyncStorage())
        .use(networking())
        .connect() //let's connect!!!

}
