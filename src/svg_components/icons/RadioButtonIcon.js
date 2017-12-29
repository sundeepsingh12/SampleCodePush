import React, { Component } from 'react'
import Svg, {
    Path,
    Rect,
    G,
    Circle
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class RadioButtonIcon extends Component {
    render() {
        return (
            <Svg
                width={this.props.width}
                height={this.props.height}
                viewBox={`0 0 ${this.props.width} ${this.props.height}`}
            // width='35' height="35" viewBox="0 0 35 35"
            >

                <G stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <Path d="M9.00381388,30.5209731 C3.67101898,27.9037354 0,22.4198422 0,16.0785366 C0,7.19860606 7.19860606,0 16.0785366,0 C21.3733267,0 26.0703526,2.55933279 29,6.50838405 C26.8651137,5.46062111 24.4639022,4.87228383 21.9252772,4.87228383 C13.0453467,4.87228383 5.8467406,12.0708899 5.8467406,20.9508205 C5.8467406,24.535961 7.02012855,27.847042 9.00381388,30.5209731 Z" id="Combined-Shape" fill="#02AAB0"></Path>
                    <Circle id="Oval-2" stroke="#02AAB0" stroke-width="3" cx="22.5" cy="21.5" r="13.5"></Circle>
                    <Circle id="Oval-3" fill="#02AAB0" cx="22.5" cy="21.5" r="6.5"></Circle>
                </G>

            </Svg>

        );
    }
}
// <? xml version = "1.0" encoding = "UTF-8" ?>
//     <svg width="38px" height="37px" viewBox="0 0 38 37" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns: xlink="http://www.w3.org/1999/xlink">
//         <!-- Generator: Sketch 48.2 (47327) - http://www.bohemiancoding.com/sketch -->
//     <title>Group 3</title>
//         <desc>Created with Sketch.</desc>
//         <defs></defs>
//         <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
//             <g id="Group-3">
//                 <path d="M9.00381388,30.5209731 C3.67101898,27.9037354 0,22.4198422 0,16.0785366 C0,7.19860606 7.19860606,0 16.0785366,0 C21.3733267,0 26.0703526,2.55933279 29,6.50838405 C26.8651137,5.46062111 24.4639022,4.87228383 21.9252772,4.87228383 C13.0453467,4.87228383 5.8467406,12.0708899 5.8467406,20.9508205 C5.8467406,24.535961 7.02012855,27.847042 9.00381388,30.5209731 Z" id="Combined-Shape" fill="#02AAB0"></path>
//                 <circle id="Oval-2" stroke="#02AAB0" stroke-width="3" cx="22.5" cy="21.5" r="13.5"></circle>
//                 <circle id="Oval-3" fill="#02AAB0" cx="22.5" cy="21.5" r="6.5"></circle>
//             </g>
//         </g>
//     </svg>