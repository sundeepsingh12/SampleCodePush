import React, { Component } from 'react'
import Svg,{
    G,
    Rect,
    Path
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class TaskIcon extends Component {
    render() {
        return (
            <Svg
            width="30" 
            height="30" 
            viewBox="0 0 256 256"
            >
                <G stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <G>
                        <Rect fill={styles.primaryColor} opacity="0.3" x="0" y="0" width="256" height="256"/>
                        <Rect fill={styles.primaryColor} opacity="0.495878623" x="25" y="25" width="206" height="206"/>
                        <Rect fill={styles.primaryColor} x="48" y="48" width="160" height="160"/>
                        <Path d="M158.557805,112.393164 L121.377954,149.559556 C120.453375,150.4838 119.204211,151 117.900949,151 C116.597687,151 115.343605,150.4838 114.423944,149.559556 L97.4421946,132.583954 C95.5192685,130.661724 95.5192685,127.554693 97.4421946,125.632463 C99.3651208,123.710232 102.473278,123.710232 104.396204,125.632463 L117.900949,139.132319 L151.603796,105.441673 C153.526722,103.519442 156.634879,103.519442 158.557805,105.441673 C160.480732,107.363903 160.480732,110.470934 158.557805,112.393164 Z" fill="#FFFFFF" fillRule="nonzero"/>
                    </G>
                </G>
            </Svg>
            
        );
    }
}