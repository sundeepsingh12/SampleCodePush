import React, { PureComponent } from 'react'
import Svg,{
    G,
    Rect,
    Path
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class TaskIcon extends PureComponent {
    render() {
        return (
            <Svg
            width="30" 
            height="30" 
            viewBox="0 0 1024 1024"
            >
                <G stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <G>
                        <Rect id="Rectangle-22" fill={styles.primaryColor} opacity="0.3" x="0" y="0" width="1024" height="1024"></Rect>
                        <Rect id="Rectangle-22-Copy-2" fill={styles.primaryColor} x="96" y="96" width="832" height="832"></Rect>
                        <Path d="M725.905768,405.773579 L465.646134,666.033213 C459.174069,672.505278 450.429896,676.119995 441.307039,676.119995 C432.184181,676.119995 423.405583,672.505278 416.967943,666.033213 L298.095389,547.160658 C284.63487,533.70014 284.63487,511.942985 298.095389,498.482467 C311.555907,485.021949 333.313061,485.021949 346.773579,498.482467 L441.307039,593.015927 L677.227577,357.095389 C690.688095,343.63487 712.44525,343.63487 725.905768,357.095389 C739.366286,370.555907 739.366286,392.313061 725.905768,405.773579 Z" id="Shape" fill="#FFFFFF" fillRule="nonzero"></Path>
                    </G>
                </G>
            </Svg>
            
        );
    }
}