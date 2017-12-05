import React, { Component } from 'react'
import Svg, {
    G,
    Path
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class StarIcon extends Component {
    render() {
        return (
            <Svg
                width={this.props.width}
                height={this.props.height}
                viewBox={`0 0 ${this.props.width} ${this.props.height}`}
            >
                <G stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <G id="Form" rotate="-9.000000, -458.000000" fillRule="nonzero" fill={this.props.color.color}>
                        <G id="star" rotate="9.000000, 458.000000">
                            <Path d="M10.5464286,1.01537888 L12.6,7.04250932 L19.0164286,7.11614907 C19.5685714,7.12252174 19.7971429,7.81997516 19.3542857,8.14639752 L14.2064286,11.9445093 L16.1185714,18.0169565 C16.2828571,18.5395155 15.685,18.9700248 15.2342857,18.6535155 L10,14.9736522 L4.765,18.6528075 C4.315,18.9693168 3.71642857,18.5380994 3.88071429,18.0162484 L5.79285714,11.9438012 L0.645,8.14568944 C0.202142857,7.81926708 0.430714286,7.12181366 0.982857143,7.11544099 L7.39928571,7.04180124 L9.45285714,1.01467081 C9.63,0.496360248 10.37,0.496360248 10.5464286,1.01537888 Z" id="Shape"></Path>
                        </G>
                    </G>
                </G>
            </Svg>
        );
    }
}