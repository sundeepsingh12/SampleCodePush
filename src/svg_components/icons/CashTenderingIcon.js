import React, { Component } from 'react'
import Svg, {
    G,
    Path,
    Circle,
    Line,
    Rect
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class CashTenderingIcon extends Component {
    render() {
        return (
            <Svg
                width='60'
                height='60'
                viewBox="0 0 60 60"
            >
                <G fill={this.props.color.color}>
                    <Path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" d="M26,23 v2.96c0,0-0.475,1.04-1,1.04s-8-4-21-4" />
                    <Path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" d="M26,19H4 c-0.552,0-1-0.448-1-1V6c0-0.552,0.448-1,1-1h22c0.552,0,1,0.448,1,1v12C27,18.552,26.552,19,26,19z" />
                    <Circle cx="26" cy="6" r="2" />
                    <Circle cx="4" cy="6" r="2" />
                    <Circle cx="4" cy="18" r="2" />
                    <Circle cx="26" cy="18" r="2" />
                    <Path d="M23,26c0,0,0.889,2.009,2,2.009s2-0.904,2-2.009s-0.895-2-2-2S23,24.895,23,26z" />
                    <Circle cx="23" cy="12" r="1" />
                    <Circle cx="7" cy="12" r="1" />
                    <Path d="M12.514,16h4.972C18.402,15.175,19,13.922,19,12.5c0-2.485-1.791-4.5-4-4.5s-4,2.015-4,4.5 C11,13.922,11.598,15.175,12.514,16z" />
                    <Rect x="25" y="22" width="2" height="2" />
                </G>
            </Svg>

        );
    }
}