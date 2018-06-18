import React, { PureComponent } from 'react'
import Svg, {
    G,
    Path
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class MessageSendIcon extends PureComponent {
    render() {
        return (
            <Svg
                width={25}
                height={22}
                viewBox={`0 0 25 22`}
            >
                <G id="MessageSend-Icon" fill="none">
                    <Path d="M14.2108 10.8979C14.2108 10.8979 14.6341 4.84598 9.73969 0.694971C4.09751 -1.64663 -2.71572 1.9722 1.11671 10.8979C1.11671 10.8979 4.59782 15.0638 7.50408 17.299C11.6559 20.4921 19.6587 21.3547 24.75 21.45C20.8518 19.5888 15.7038 15.6894 14.2108 10.8979Z" transform="translate(25 21.45) rotate(-180)" fill="#E5E5EA" />
                </G>
            </Svg >
        )
    }
}