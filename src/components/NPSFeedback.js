import StarRating from 'react-native-star-rating'
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight
}
    from 'react-native'
import React, { PureComponent } from 'react'
import renderIf from '../lib/renderIf'
import {
    SAVE,
    CANCEL
} from '../lib/ContainerConstants'
import styles from '../themes/FeStyle'

class NPSFeedback extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            starCount: 0
        };
    }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
        if (this.props.showSave) {
            this.props.onStarPress(rating)
        } else {
            this.props.onSave(rating, this.props.item)
        }
    }

    render() {
        return (
            <View>
                <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={(this.props.item && this.props.item.value) ? parseInt(this.props.item.value) : this.state.starCount}
                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                    fullStarColor={'#f6db7b'}
                    emptyStar={'ios-star-outline'}
                    iconSet={'Ionicons'}
                    fullStar={'ios-star'}
                    emptyStarColor={'#a3a3a3'}
                />
            </View>

        );
    }
}

export default NPSFeedback