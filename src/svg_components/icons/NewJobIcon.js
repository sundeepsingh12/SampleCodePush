import React, { PureComponent } from 'react'
import Svg,{
    G,
    Rect
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class NewJobIcon extends PureComponent {
    render() {
        return (
            <Svg
            width="30" 
            height="30" 
            viewBox="0 0 1024 1024"
            >
                <G id="Themes" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <G id="Live-Icon">
                        <Rect id="Rectangle-22-Copy-3" fill={styles.primaryColor} opacity="0.3" x="0" y="0" width="1024" height="1024"></Rect>
                        <Rect id="Rectangle-22-Copy-4" fill={styles.primaryColor} x="102.4" y="102.4" width="824" height="824"></Rect>
                        <Rect id="Path" fill="#FFFFFF" x="288" y="488" width="448" height="48"></Rect>
                        <Rect id="Path" fill="#FFFFFF" x="488" y="288" width="48" height="448"></Rect>
                    </G>
                </G>
            </Svg>
            
        );
    }
}