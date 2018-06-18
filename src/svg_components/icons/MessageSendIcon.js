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
                    <Path d="M14.2108 10.8999C14.2108 10.8999 14.6341 4.8469 9.73969 0.695103C4.09751 -1.64694 -2.71572 1.97258 1.11671 10.8999C1.11671 10.8999 4.59782 15.0667 7.50408 17.3023C11.6559 20.496 19.6587 21.3588 24.75 21.4541C20.8518 19.5925 15.7038 15.6924 14.2108 10.8999Z" transform="translate(0 21.4541) scale(1 -1)" fill="#A0A0AF" />
                </G>
            </Svg >
        )
    }
}