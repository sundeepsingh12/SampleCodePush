import React, { Component } from 'react'
import Svg, {
    G,
    Rect,
    Path,
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class JobAssignmentIcon extends Component {
    render() {
        return (
            <Svg
                width={this.props.width}
                height={this.props.height}
                viewBox="0 0 1024 1024"
            >
                <G stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <G>
                        <Rect fill={styles.primaryColor} opacity="0.3" x="0" y="0" width="1024" height="1024"></Rect>
                        <Rect fill={styles.primaryColor} x="102.4" y="102.4" width="824" height="824"></Rect>
                        <Path d="M501.62146,551.600453 C504.611239,554.590233 508.055302,556.081978 511.944215,556.081978 C515.833129,556.081978 519.270904,554.591804 522.259111,551.600453 L731.408477,342.460518 C734.398257,339.469167 735.883715,336.026677 735.883715,332.137763 C735.883715,328.248849 734.388825,324.804787 731.408477,321.815008 L708.970985,299.371228 C705.981206,296.379877 702.537144,294.886559 698.643514,294.886559 C694.759316,294.886559 691.316826,296.379877 688.327047,299.371228 L511.944215,475.747772 L335.569243,299.371228 C332.577892,296.379877 329.135402,294.886559 325.246488,294.886559 C321.356002,294.886559 317.913512,296.379877 314.923733,299.371228 L292.489385,321.815008 C289.493318,324.804787 288,328.242562 288,332.137763 C288,336.032964 289.498033,339.470739 292.489385,342.460518 L501.62146,551.600453 Z" fill="#FFFFFF" fill-rule="nonzero"></Path>
                        <Path d="M708.970985,471.709526 C705.981206,468.718175 702.537144,467.224857 698.643514,467.224857 C694.759316,467.224857 691.316826,468.718175 688.327047,471.709526 L511.944215,648.084498 L335.569243,471.704811 C332.577892,468.713459 329.135402,467.220142 325.246488,467.220142 C321.356002,467.220142 317.913512,468.713459 314.923733,471.704811 L292.489385,494.147018 C289.493318,497.138369 288,500.58086 288,504.468202 C288,508.357115 289.498033,511.801178 292.489385,514.795673 L501.62146,723.932464 C504.611239,726.923815 508.055302,728.418705 511.944215,728.418705 C515.833129,728.418705 519.270904,726.923815 522.259111,723.932464 L731.408477,514.795673 C734.398257,511.804322 735.883715,508.361831 735.883715,504.476061 C735.883715,500.587147 734.388825,497.149373 731.408477,494.153306 L708.970985,471.709526 Z" fill="#FFFFFF" fill-rule="nonzero"></Path>
                    </G>
                </G>
            </Svg>
        );
    }
}