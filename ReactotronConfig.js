import Reactotron, {
    trackGlobalErrors,
    openInEditor,
    overlay,
    asyncStorage,
    networking
  } from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'

console.tron = Reactotron
  
Reactotron
    .configure({
        host: '192.168.31.34',
        name: "Fareye App"
    }) // controls connection & communication settings
    //.useReactNative()
    .use(reactotronRedux()) //  <- Redux like govt mind control experiments!!
    .use(trackGlobalErrors({
        veto: frame => frame.fileName.indexOf('/node_modules/react-native/') >= 0
    }))
    .use(openInEditor())
    .use(overlay())
    .use(asyncStorage())
    .use(networking())
    .connect() //let's connect!!!
