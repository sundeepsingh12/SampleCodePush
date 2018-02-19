import React, { Component } from 'react'
import Svg, {
    G,
    Rect,
    Path,
    Text,
    TSpan
} from 'react-native-svg';
import styles from '../../themes/FeStyle'

export default class GroupIcon extends Component {
    render() {
        return (
            <Svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
            >
                <G stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <G id="Update-Group-Icon" fill="#007AFF">
                        <Rect id="Rectangle-7" x="0.965456308" y="0" width="11.1345437" height="2.2" rx="1"></Rect>
                        <Rect id="Rectangle-7-Copy" x="0.965456308" y="4.4" width="11.1345437" height="2.2" rx="1"></Rect>
                        <Rect id="Rectangle-7-Copy-2" x="0.965456308" y="8.8" width="11.1345437" height="2.2" rx="1"></Rect>
                        <Path d="M11.0792,7.1175 C13.5974793,7.46656841 15.6108258,8.5012914 17.1193,10.2217 C18.3784396,11.6678406 19.2261645,13.494189 19.6625,15.7008 C18.7025619,14.3294598 17.5244736,13.3227865 16.1282,12.68075 C14.7319264,12.0387135 13.0489432,11.7177 11.0792,11.7177 L11.0792,14.8967 L5.6375,9.455 L11.0792,4.0133 L11.0792,7.1175 Z" id="reply---material" stroke="#FFFFFF" stroke-width="1.5" transform="translate(12.650000, 9.857050) scale(-1, 1) translate(-12.650000, -9.857050) "></Path>
                    </G>
                </G>
            </Svg>

        );
    }
}

