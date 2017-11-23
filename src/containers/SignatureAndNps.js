import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
}
    from 'react-native'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import {
    Container,
    Content,
    Header,
    Left,
    Body,
    Icon,
    StyleProvider
} from 'native-base';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SignatureView from '../components/SignatureView'
import Signature from '../containers/Signature'
import NPSFeedback from '../components/NPSFeedback'
import * as signatureActions from '../modules/signature/signatureActions'

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...signatureActions }, dispatch)
    }
}

class SignatureAndNps extends Component {

    constructor(props) {
        super(props)
        this.state = {
            starCount: 0
        };
    }

    onStarRatingPress = (starCount) => {
        this.setState({
            starCount
        });
    }

    onRatingSaveEvent = (result) => {
        this.props.actions.saveSignatureAndRating(result,
            this.state.starCount,
            this.props.navigation.state.params.currentElement,
            this.props.navigation.state.params.formElements,
            this.props.navigation.state.params.nextEditable,
            this.props.navigation.state.params.isSaveDisabled,
            this.props.navigation.state.params.jobTransaction,
            this.props.navigation.state.params.latestPositionId)
        this.props.navigation.goBack()

    }

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }


    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Header searchBar style={[styles.bgWhite, style.header]}>
                        <Body>
                            <View
                                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                                <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                                    <Icon name="md-arrow-back" style={[styles.fontBlack, styles.fontXl, styles.fontLeft]} />
                                </TouchableOpacity>
                                <View style={[style.headerBody]}>
                                    <Text style={[styles.fontCenter, styles.fontBlack, styles.fontLg, styles.alignCenter]}>Signature</Text>
                                </View>
                                <TouchableOpacity style={[style.headerRight]}
                                    onPress={this.resetSign} >
                                    <Text style={[styles.fontBlack, styles.fontLg, styles.fontRight]}>Clear</Text>
                                </TouchableOpacity>
                                <View />
                            </View>
                        </Body>
                    </Header>
                    <View style={[styles.flex1]}>
                        <Signature navigation={this.props.navigation} onRatingSaveEvent={this.onRatingSaveEvent} />
                        <View style={[style.feedback]}>
                            <View style={[{ paddingLeft: 150, paddingRight: 150 }]}>
                                <NPSFeedback onStarPress={this.onStarRatingPress} showSave={true} />
                            </View>
                        </View>
                        <TouchableOpacity style={[style.fabButton, styles.bgPrimary]}
                            onPress={ this.saveSign } >
                            <Icon name="md-checkmark" style={[styles.fontWhite, styles.fontXl]} />
                        </TouchableOpacity>
                    </View>
                </Container>
            </StyleProvider>

        );
    }

    resetSign = () => {
        SignatureView.refs["sign"].resetImage();
    }
}

const style = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        height: 'auto',
        padding: 0,
        paddingRight: 0,
        paddingLeft: 0
    },
    headerLeft: {
        width: '15%',
        padding: 15
    },
    headerBody: {
        width: '70%',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10
    },
    headerRight: {
        width: '15%',
        padding: 15
    },
    fabButton: {
        position: 'absolute',
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 10,
        right: 10
    },

    feedback: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
    }
});
export default connect(null, mapDispatchToProps)(SignatureAndNps)
