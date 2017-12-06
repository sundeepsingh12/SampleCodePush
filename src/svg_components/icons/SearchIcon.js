import React, { Component } from 'react'
import Svg,{
    G,
    Circle,
    Line
    
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class SearchIcon extends Component {
    render() {
        return (
            <Svg
                width={this.props.width}
                height={this.props.height}
            >
                <G stroke="none" fill="none" fillRule="evenodd">
                    <Circle fill="none" stroke={this.props.color.color} strokeWidth="2" cx="13" cy="13" r="9"/>
                    <Line  fill="none" stroke={this.props.color.color} strokeWidth="2" strokeLinecap="round" x1="26" y1="26" x2="19.437" y2="19.437"/>
                </G>
            </Svg>
            
        );
    }
}