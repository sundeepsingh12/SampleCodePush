import React, { Component } from 'react'
import Svg, {
    G,
    Path
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class TorchOnIcon extends Component {
    render() {
        return (
            <Svg
                width={this.props.width}
                height={this.props.height}
                viewBox="0 0 512 512"
            >
                <G id="flash_light" fill="#FFFFFF" fillRule="nonzero">
                    <Path d="M384,64V32c0-17.674-14.326-32-32-32H160c-17.673,0-32,14.326-32,32v32H384z" fill="#FFFFFF" />
                    <Path d="m128.54,96c2.509,36.365 14.028,67.963 38.917,88.23 15.046,12.251 24.543,30.007 24.543,49.411v246.359c0,17.673 14.327,32 32,32h64c17.674,0 32-14.327 32-32v-252.254c0-20.139 10.365-38.211 26.166-50.697 23.722-18.745 34.779-46.401 37.263-81.049h-254.889zm127.46,192c-17.673,0-32-14.327-32-32 0-17.674 14.327-32 32-32 17.674,0 32,14.326 32,32 0,17.673-14.326,32-32,32z" fill="#FFFFFF" />
                </G>
            </Svg>

        );
    }
}