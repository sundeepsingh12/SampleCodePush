import React, { Component } from 'react'
import Svg, {
    G,
    Ellipse,
    Polygon,
    Path,
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class CartIcon extends Component {
    render() {
        return (
            <Svg
                width={this.props.width}
                height={this.props.height}
                viewBox={`0 0 ${this.props.width} ${this.props.height}`}
            >
                <G stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <G id="Form" origin="-8.000000, -345.000000">
                        <G id="shopping_cart" origin="9.000000, 346.000000">
                            <Ellipse id="Oval" fill={this.props.color.color} fillRule="nonzero" cx="16" cy="17.4166667" rx="1.6" ry="1.58333333"></Ellipse>
                            <Ellipse id="Oval" fill={this.props.color.color} fillRule="nonzero" cx="8" cy="17.4166667" rx="1.6" ry="1.58333333"></Ellipse>
                            <Polygon id="Shape" fill={this.props.color.color} fillRule="nonzero" points="17.6 13.4583333 6.8 13.4583333 4 4.75 20 4.75"></Polygon>
                            <Path d="M0,0 L1.5024,0 C2.0344,0 2.5032,0.34675 2.6536,0.852625 L6.0624,12.3222917 C6.2624,12.9952083 6.8872,13.4583333 7.5968,13.4583333 L16.3776,13.4583333 C17.0992,13.4583333 17.7312,12.9801667 17.9216,12.2914167 L20,4.75 L4,4.75" id="Shape" stroke={this.props.color.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></Path>
                        </G>
                    </G>
                </G>
            </Svg>
        );
    }
}