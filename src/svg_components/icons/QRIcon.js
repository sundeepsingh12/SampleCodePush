import React, { PureComponent } from 'react'
import Svg,{
    Path,
    Rect,
    G
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class QRIcon extends PureComponent {
    render() {
        return (
            <Svg
                width={this.props.width}
                height={this.props.height}
                viewBox={`0 0 ${this.props.width} ${this.props.height}`}
            >
                <G fill={this.props.color.color}>
                    <Path d="M10,4H6C4.895,4,4,4.895,4,6v4c0,1.105,0.895,2,2,2h4c1.105,0,2-0.895,2-2V6C12,4.895,11.105,4,10,4z M10,10H6V6h4V10z M9,9H7V7h2V9z"/>
                    <Path d="M10,18H6c-1.105,0-2,0.895-2,2v4c0,1.105,0.895,2,2,2h4c1.105,0,2-0.895,2-2v-4C12,18.895,11.105,18,10,18z M10,24H6v-4h4V24z M9,23H7v-2h2V23z"/>
                    <Path d="M24,4h-4c-1.105,0-2,0.895-2,2v4c0,1.105,0.895,2,2,2h4c1.105,0,2-0.895,2-2V6C26,4.895,25.105,4,24,4z M24,10h-4V6h4V10zM23,9h-2V7h2V9z"/>
                    <Rect x="14" y="6" width="2" height="2"/>
                    <Rect x="14" y="10" width="2" height="2"/>
                    <Rect x="14" y="14" width="2" height="2"/>
                    <Rect x="10" y="14" width="2" height="2"/>
                    <Rect x="6" y="14" width="2" height="2"/>
                    <Rect x="18" y="14" width="2" height="2"/>
                    <Rect x="22" y="14" width="2" height="2"/>
                    <Rect x="16" y="16" width="2" height="2"/>
                    <Rect x="20" y="16" width="2" height="2"/>
                    <Rect x="18" y="18" width="2" height="2"/>
                    <Rect x="14" y="18" width="2" height="2"/>
                    <Rect x="16" y="20" width="2" height="2"/>
                    <Rect x="18" y="22" width="2" height="2"/>
                    <Rect x="16" y="24" width="2" height="2"/>
                    <Rect x="24" y="16" width="2" height="2"/>
                    <Rect x="24" y="20" width="2" height="2"/>
                    <Rect x="20" y="20" width="2" height="2"/>
                    <Rect x="20" y="24" width="2" height="2"/>
                    <Rect x="22" y="22" width="2" height="2"/>
                    <Rect x="22" y="18" width="2" height="2"/>
                    <Rect x="14" y="22" width="2" height="2"/>
                </G>
            </Svg>
            
        );
    }
}