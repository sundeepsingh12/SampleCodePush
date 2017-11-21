import React, { Component } from 'react'
import Svg,{
    G,
    Rect,
    Polygon
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class LiveIcon extends Component {
    render() {
        return (
            <Svg
            width="30" 
            height="30" 
            viewBox="0 0 256 256"
            >
                <G id="Themes" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <G id="Live-Icon">
                        <Rect fill="#D8D8D8" x="104" y="0" width="48" height="48"/>
                        <Rect fill="#D8D8D8" x="104" y="208" width="48" height="48"/>
                        <Rect fill={styles.primaryColor} opacity="0.5" x="208" y="104" width="48" height="48"/>
                        <Rect fill={styles.primaryColor} opacity="0.5" x="0" y="104" width="48" height="48"/>
                        <Polygon fill={styles.primaryColor} opacity="0.5" points="16 48 48 16 128 80.0099606 80 128"/>
                        <Polygon fill={styles.primaryColor} opacity="0.5" points="128 176.109583 175.922145 128 239 206.999355 207.143178 239"/>
                        <Polygon fill={styles.primaryColor} rotate="45" origin="68.104076, 188.000000" points="34.1040764 137 102.104076 137 90.7733979 239 45.4299456 238.996707"/>
                        <Polygon fill={styles.primaryColor} points="208 16 240 48.0283933 176.021107 128 128 79.9916619"/>
                    </G>
                </G>
            </Svg>
            
        );
    }
}