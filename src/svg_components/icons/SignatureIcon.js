import React, { PureComponent } from 'react'
import Svg, {
    G,
    Path,
    Circle,
    Line,
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class SignatureIcon extends PureComponent {
    render() {
        return (
            <Svg
                width={this.props.width}
                height={this.props.height}
                viewBox="0 0 30 30"
            >
                <G fill={this.props.color.color}>
                    <Line style="fill:none;stroke:#000000;stroke-width:2;stroke-Linecap:round;stroke-miterlimit:10;" x1="4" y1="26" x2="6.5" y2="23.5" />
                    <Path d="M19,16l7.414-7.414c0.781-0.781,0.781-2.047,0-2.828l-2.172-2.172c-0.781-0.781-2.047-0.781-2.828,0L14,11L19,16z" />
                    <Path d="M10.761,24.239L17,18c0,0-5-5-5-5l-6.241,6.241c-0.497,0.497-0.854,1.116-1.036,1.795l-0.65,2.429l2.595,2.42l2.291-0.608 C9.641,25.095,10.263,24.737,10.761,24.239z" />
                    <Path d="M25,8l1.379-1.379c0.828-0.828,0.828-2.17,0-2.998l-0.002-0.002c-0.828-0.828-2.17-0.828-2.998,0L22,5L25,8z" />
                    <Circle cx="6" cy="24" r="2" />
                    <Path style="fill:none;stroke:#000000;stroke-width:2;stroke-Linecap:round;stroke-miterlimit:10;" d="M22,5l-1.285-1.285 c-0.947-0.947-2.482-0.947-3.429,0L17,4c-1,1-2.5,3.5-4,5" />
                </G>
            </Svg>

        );
    }
}