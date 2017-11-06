import StarRating from 'react-native-star-rating'
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight
}
    from 'react-native'
import React, { Component } from 'react'
import renderIf from '../lib/renderIf'

class NPSFeedback extends Component {

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
        }
    }

    render() {
        return (
            <View>
                <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={this.state.starCount}
                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                />
                {renderIf(!this.props.showSave,
                    <View style={{ flexDirection: "row" }}>
                        <TouchableHighlight style={styles.buttonStyle}
                            onPress={() => { this.props.onSave(this.state.starCount) }} >
                            <Text>Save</Text>
                        </TouchableHighlight>

                        <TouchableHighlight style={styles.buttonStyle}
                            onPress={() => { this.props.onCancel() }} >
                            <Text>Cancel</Text>
                        </TouchableHighlight>
                    </View>)}
            </View>

        );
    }
}
const styles = StyleSheet.create({
    buttonStyle: {
        flex: 2, justifyContent: "center", alignItems: "center", height: 50,
        backgroundColor: "#eeeeee",
        margin: 10
    }
});
export default NPSFeedback