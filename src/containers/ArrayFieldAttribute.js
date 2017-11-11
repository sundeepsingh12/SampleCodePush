import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
}
    from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as arrayActions from '../modules/array/arrayActions'
import ArrayBasicComponent from '../components/ArrayBasicComponent.js'
import {
    Container,
    Content,
    Header,
    Button,
    List,
    ListItem,
    Left,
    Body,
    Right,
    Icon,
    Title,
    Footer,
    FooterTab,
    StyleProvider,
    Card,
    CardItem
} from 'native-base'
import _ from 'lodash'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'

function mapStateToProps(state) {
    return {
        arrayElements: state.array.arrayElements,
        lastRowId: state.array.lastRowId,
        childElementsTemplate: state.array.childElementsTemplate,
        isSaveDisabled: state.array.isSaveDisabled
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...arrayActions }, dispatch)
    }
}

class ArrayFieldAttribute extends Component {

    componentWillMount() {
        this.props.actions.getSortedArrayChildElements(
            this.props.navigation.state.params.currentElement.fieldAttributeMasterId,
            this.props.navigation.state.params.jobStatusId,
            this.props.lastRowId,
            this.props.arrayElements
        )
    }
    renderData = (arrayRow) => {
        return (
            <ArrayBasicComponent
                arrayRow={arrayRow.item}
                arrayElements={this.props.arrayElements}
                isSaveDisabled={this.props.isSaveDisabled}
                lastRowId={this.props.lastRowId}
            //  childElementsTemplate={this.props.childElementsTemplate}
            />
        )
    }
    savePressed = () => {
        this.props.actions.saveArray(this.props.arrayElements,
            this.props.navigation.state.params.currentElement,
            this.props.navigation.state.params.jobTransaction,
            this.props.navigation.state.params.latestPositionId,
            this.props.navigation.state.params.formElements,
            this.props.navigation.state.params.nextEditable,
            this.props.navigation.state.params.isSaveDisabled)
        this.props.navigation.goBack()
    }
    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }
    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Header
                        style={StyleSheet.flatten([
                            styles.bgPrimary, {
                                borderBottomWidth: 0
                            }
                        ])}>
                        <Left>
                            <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]} onPress={() => { this.props.navigation.goBack(null) }} />
                        </Left>
                        <Body>
                            <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>Array</Text>
                        </Body>
                        <Right />
                    </Header>
                    <View style={[styles.flex1, styles.column]}>
                        <View style={[styles.flex1]}>
                            <FlatList
                                data={Object.values(this.props.arrayElements)}
                                renderItem={(item) => this.renderData(item)} //TODO add comments for item[1] 
                                keyExtractor={item => item.rowId}>
                            </FlatList>
                        </View>
                        <View style={[styles.row, styles.justifySpaceBetween]}>
                            <Text style={[styles.padding5, styles.alignStart]} >
                                Total Count : {_.size(this.props.arrayElements)}
                            </Text>
                            <Button disabled={this.props.isSaveDisabled} bordered style={[styles.padding5, styles.alignSelfEnd, styles.heightAuto]}
                                onPress={() => this.props.actions.addRowInArray(this.props.lastRowId, this.props.childElementsTemplate, this.props.arrayElements)}>
                                <Text> Add Row </Text>
                            </Button>
                        </View>
                    </View>

                    <Footer style={{
                        height: 'auto'
                    }}>
                        <FooterTab style={StyleSheet.flatten([styles.padding10, styles.bgWhite])}>
                            <Button success full disabled={this.props.isSaveDisabled} onPress={this.savePressed}>
                                <Text style={[styles.fontLg, styles.fontWhite]}>Save</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </Container >
            </StyleProvider >
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ArrayFieldAttribute)
