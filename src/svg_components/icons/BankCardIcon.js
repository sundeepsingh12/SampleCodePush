import React, { PureComponent } from 'react'
import Svg, {
    G,
    Path
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class BankCardIcon extends PureComponent {
    render() {
        return (
            <Svg
                width={this.props.width}
                height={this.props.height}
                viewBox={`0 0 ${this.props.width} ${this.props.height}`}
            >
                <G id="On-Invision-Screens" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <G id="Form" rotate="-9.000000, -515.000000" fillRule="nonzero" fill={this.props.color.color}>
                        <G id="bank_cards" rotate="9.000000, 515.000000">
                            <Path d="M16.4285714,2.16541353 L16.4285714,1.44360902 C16.4285714,0.646015038 15.7892857,0 15,0 L1.42857143,0 C0.639285714,0 0,0.646015038 0,1.44360902 L0,2.16541353 L16.4285714,2.16541353 Z" id="Shape"></Path>
                            <Path d="M0,4.33082707 L0,10.8270677 C0,11.6246617 0.639285714,12.2706767 1.42857143,12.2706767 L15,12.2706767 C15.7892857,12.2706767 16.4285714,11.6246617 16.4285714,10.8270677 L16.4285714,4.33082707 L0,4.33082707 Z" id="Shape"></Path>
                            <Path d="M20,5.05263158 L20,4.33082707 C20,3.53323308 19.3607143,2.88721805 18.5714286,2.88721805 L17.8571429,2.88721805 L17.8571429,5.05263158 L20,5.05263158 Z" id="Shape"></Path>
                            <Path d="M17.8571429,7.21804511 L17.8571429,12.2706767 C17.8571429,13.0682707 17.2178571,13.7142857 16.4285714,13.7142857 L3.57142857,13.7142857 L3.57142857,14.4360902 C3.57142857,15.2336842 4.21071429,15.8796992 5,15.8796992 L18.5714286,15.8796992 C19.3607143,15.8796992 20,15.2336842 20,14.4360902 L20,7.21804511 L17.8571429,7.21804511 Z" id="Shape"></Path>
                        </G>
                    </G>
                </G>
            </Svg>
        );
    }
}