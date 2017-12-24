import React, { Component } from 'react'
import Svg, {
    G,
    Path
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class TimeIcon extends Component {
    render() {
        return (
            <Svg
                width={this.props.width}
                height={this.props.height}
                viewBox="0 0 90 60"
            >
                <G fill={this.props.color.color}>
                    <Path d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30 S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z" />
                    <Path d="M30,6c-0.552,0-1,0.447-1,1v23H14c-0.552,0-1,0.447-1,1s0.448,1,1,1h16c0.552,0,1-0.447,1-1V7C31,6.447,30.552,6,30,6z" />
                </G>
            </Svg>

        );
    }
}