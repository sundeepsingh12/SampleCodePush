import React, { Component } from 'react'
import Svg,{
    G,
    Rect,
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class BulkIcon extends Component {
    render() {
        return (
            <Svg
            width="30" 
            height="30" 
            viewBox="0 0 256 256"
            >
                <G stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <G fill={styles.primaryColor}>
                        <Rect opacity="0.5" x="0" y="0" width="176" height="176"/>
                        <Rect opacity="0.5" x="80" y="80" width="176" height="176"/>
                        <Rect x="80" y="80" width="96" height="96"/>
                    </G>
                </G>
            </Svg>
            
        );
    }
}