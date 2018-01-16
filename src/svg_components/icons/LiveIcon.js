import React, { PureComponent } from 'react'
import Svg,{
    G,
    Rect,
    Path
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class LiveIcon extends PureComponent {
    render() {
        return (
            <Svg
            width="30" 
            height="30" 
            viewBox="0 0 1024 1024"
            >
                <G id="Themes" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <G id="Live-Icon">
                        <Rect id="Rectangle-22" fill={styles.primaryColor} opacity="0.3" x="0" y="0" width="1024" height="1024"></Rect>
                        <Rect id="Rectangle-22-Copy-2" fill={styles.primaryColor} x="96" y="96" width="832" height="832"></Rect>
                        <Path d="M667.111719,452.136375 C664.506154,446.291286 658.705442,442.527163 652.30564,442.527163 C633.779814,442.527163 530.348048,442.527163 530.348048,442.527163 L580.513112,309.946027 C582.397551,304.96629 581.716047,299.377954 578.688899,294.995722 C575.663337,290.615075 570.678845,288 565.353602,288 L444.697208,288 C437.958239,288 431.921377,292.169856 429.536112,298.472979 L353.049129,500.616697 C351.16469,505.596434 351.846194,511.18477 354.873341,515.567002 C357.900489,519.947649 362.884981,522.564309 368.210224,522.564309 L503.558585,521.751258 L432.046584,711.94646 C431.101987,714.460102 432.079867,717.290723 434.374793,718.68543 C436.66972,720.080136 439.633472,719.642705 441.429156,717.645739 L664.363513,469.573379 C668.639557,464.812357 669.717285,457.981464 667.111719,452.136375 Z" fill="#FFFFFF" fillRule="nonzero"></Path>
                    </G>
                </G>
            </Svg>
            
        );
    }
}