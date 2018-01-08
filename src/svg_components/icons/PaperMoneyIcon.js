import React, { PureComponent } from 'react'
import Svg, {
    G,
    Path,
    Circle
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class PaperMoneyIcon extends PureComponent {
    render() {
        return (
            <Svg
                width={this.props.width}
                height={this.props.height}
                viewBox='0 0 30 20'
            >
                <G stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <G rotate="-8.000000, -563.000000">
                        <G id="paper_money" rotate="9.000000, 564.000000">
                            <Path d="M1.53846154,3.07692308 L18.4615385,3.07692308" id="Shape" stroke={this.props.color.color} strokeWidth="2" strokeLinecap="round"></Path>
                            <Path d="M3.07692308,0 L16.9230769,0" id="Shape" stroke={this.props.color.color} strokeWidth="2" strokeLinecap="round"></Path>
                            <Path d="M18.4615385,16.9230769 L1.53846154,16.9230769 C1.11384615,16.9230769 0.769230769,16.5784615 0.769230769,16.1538462 L0.769230769,6.92307692 C0.769230769,6.49846154 1.11384615,6.15384615 1.53846154,6.15384615 L18.4615385,6.15384615 C18.8861538,6.15384615 19.2307692,6.49846154 19.2307692,6.92307692 L19.2307692,16.1538462 C19.2307692,16.5784615 18.8861538,16.9230769 18.4615385,16.9230769 Z" id="Shape" stroke={this.props.color.color} strokeWidth="2" strokeLinecap="round"></Path>
                            <Circle id="Oval" fill={this.props.color.color} fillRule="nonzero" cx="18.4615385" cy="6.92307692" r="1.53846154"></Circle>
                            <Circle id="Oval" fill={this.props.color.color} fillRule="nonzero" cx="1.53846154" cy="6.92307692" r="1.53846154"></Circle>
                            <Circle id="Oval" fill={this.props.color.color} fillRule="nonzero" cx="1.53846154" cy="16.1538462" r="1.53846154"></Circle>
                            <Circle id="Oval" fill={this.props.color.color} fillRule="nonzero" cx="18.4615385" cy="16.1538462" r="1.53846154"></Circle>
                            <Circle id="Oval" fill={this.props.color.color} fillRule="nonzero" cx="16.1538462" cy="11.5384615" r="1"></Circle>
                            <Circle id="Oval" fill={this.props.color.color} fillRule="nonzero" cx="3.84615385" cy="11.5384615" r="1"></Circle>
                            <Path d="M8.08769231,14.6153846 L11.9123077,14.6153846 C12.6169231,13.9807692 13.0769231,13.0169231 13.0769231,11.9230769 C13.0769231,10.0115385 11.6992308,8.46153846 10,8.46153846 C8.30076923,8.46153846 6.92307692,10.0115385 6.92307692,11.9230769 C6.92307692,13.0169231 7.38307692,13.9807692 8.08769231,14.6153846 Z" id="Shape" fill={this.props.color.color} fillRule="nonzero"></Path>
                        </G>
                    </G>
                </G>
            </Svg>
        );
    }
}