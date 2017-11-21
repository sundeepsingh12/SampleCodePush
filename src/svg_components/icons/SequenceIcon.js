import React, { Component } from 'react'
import Svg,{
    G,
    Circle,
    Polygon
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class SequenceIcon extends Component {
    render() {
        return (
            <Svg
            width="30" 
            height="30" 
            viewBox="0 0 256 256"
            >
                <G id="Themes" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <G>
                        <Polygon id="Rectangle" fill="#D8D8D8" points="17 60.683583 61.1157833 17 241 197.517454 197.343788 241"/>
                        <Circle id="Oval-3" fill={styles.primaryColor} cx="39.5" cy="39.5" r="39.5"/>
                        <Circle id="Oval-3-Copy" fill={styles.primaryColor} opacity="0.5" cx="216.5" cy="39.5" r="39.5"/>
                        <Circle id="Oval-3-Copy-2" fill={styles.primaryColor} cx="216.5" cy="216.5" r="39.5"/>
                        <Circle id="Oval-3-Copy-3" fill={styles.primaryColor} opacity="0.5" cx="39.5" cy="216.5" r="39.5"/>
                    </G>
                </G>
            </Svg>
            
        );
    }
}