import React, { Component } from 'react'
import Svg, {
    G,
    Rect,
    Path,
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class RevertIcon extends Component {
    render() {
        return (
            <Svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
            >
                <G stroke="none" strokeWidth="1" fill={this.props.color.color} fillRule="evenodd">
                    <Path d="M0 0h24v24H0z" fill="none"/>
                    <Path d="M14 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm-2-9c-4.97 0-9 4.03-9 9H0l4 4 4-4H5c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.51 0-2.91-.49-4.06-1.3l-1.42 1.44C8.04 20.3 9.94 21 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
                </G>
            </Svg>

        );
    }
}