import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity, } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as arrayActions from '../modules/array/arrayActions'
import ArrayBasicComponent from '../components/ArrayBasicComponent.js'
import CustomAlert from '../components/CustomAlert.js'
import { Container, Content, Header, Button, List, ListItem, Left, Body, Right, Icon, Title, Footer, FooterTab, StyleProvider, Card, CardItem, Toast } from 'native-base'
import _ from 'lodash'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf'
import Loader from '../components/Loader'
import TitleHeader from '../components/TitleHeader'
import { TOTAL_COUNT, ADD, SAVE, ADD_TOAST, OK } from '../lib/ContainerConstants'

function mapStateToProps(state) {
    return {
        arrayElements: state.array.arrayElements,
        lastRowId: state.array.lastRowId,
        childElementsTemplate: state.array.childElementsTemplate,
        isSaveDisabled: state.array.isSaveDisabled,
        errorMessage: state.array.errorMessage,
        arrayMainObject: state.array.arrayMainObject,
        isLoading: state.array.isLoading,
        arrayReverseDataStoreFilterMap: state.formLayout.arrayReverseDataStoreFilterMap,
        sequenceWiseMasterIds: state.array.sequenceWiseMasterIds
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...arrayActions }, dispatch)
    }
}

class ArrayFieldAttribute extends PureComponent {

    static navigationOptions = ({ navigation }) => {
        return { header: <TitleHeader pageName={navigation.state.params.currentElement.label} goBack={navigation.goBack} /> }
    }

    componentDidMount() {
        this.props.actions.setInitialArray(
            this.props.navigation.state.params.currentElement,
            this.props.navigation.state.params.formLayoutState,
            this.props.navigation.state.params.jobTransaction,
            this.props.arrayReverseDataStoreFilterMap,
        )
    }
    componentWillUnmount() {
        this.props.actions.clearArrayState()
    }
    renderData = (arrayRow) => {
        let formLayoutState = {
            formElement: this.props.arrayElements,
            isSaveDisabled: this.props.isSaveDisabled,
            latestPositionId: this.props.navigation.state.params.formLayoutState.latestPositionId,
            fieldAttributeMasterParentIdMap: this.props.navigation.state.params.formLayoutState.fieldAttributeMasterParentIdMap,
            jobAndFieldAttributesList: this.props.navigation.state.params.formLayoutState.jobAndFieldAttributesList,
            sequenceWiseMasterIds: this.props.sequenceWiseMasterIds
        }
        return (
            <ArrayBasicComponent
                arrayRow={arrayRow.item}
                formLayoutState={formLayoutState}
                arrayElements={this.props.arrayElements}
                isSaveDisabled={this.props.isSaveDisabled}
                lastRowId={this.props.lastRowId}
                jobTransaction={this.props.navigation.state.params.jobTransaction}
                jobStatusId={this.props.jobStatusId}
                arrayFieldAttributeMasterId={this.props.navigation.state.params.currentElement.fieldAttributeMasterId}
                navigate={this.props.navigation.navigate}
                goBack={this.props.navigation.goBack}
            />
        )
    }
    addPressed = () => {
        if (this.props.isSaveDisabled) {
            Toast.show({
                text: ADD_TOAST,
                position: 'bottom',
                buttonText: OK,
            })
        }
        else {
            this.props.actions.addRowInArray(this.props.lastRowId,
                this.props.childElementsTemplate,
                this.props.arrayElements,
                this.props.navigation.state.params.jobTransaction,
                this.props.isSaveDisabled,
                this.props.sequenceWiseMasterIds
            )
        }
    }
    savePressed = () => {
        this.props.actions.saveArray(this.props.arrayElements,
            this.props.navigation.state.params.currentElement,
            this.props.navigation.state.params.jobTransaction,
            this.props.navigation.state.params.formLayoutState,
            this.props.arrayMainObject,
            this.props.arrayReverseDataStoreFilterMap,
            this.props.navigation.goBack
        )
    }

    backPressed = () => {
        this.props.navigation.goBack()
        this.props.actions.clearArrayState()
    }
    getLoader() {
        let loader
        if (this.props.isLoading) {
            loader = <Loader />
        }
        return loader
    }
    getListView() {
        let list
        if (!this.props.isLoading) {
            list =
                <FlatList
                    data={Object.values(this.props.arrayElements)}
                    renderItem={(item) => this.renderData(item)}
                    keyExtractor={item => String(item.rowId)}>
                </FlatList>
        }
        return list
    }
    headerView() {
        let view
        view = <Header searchBar style={StyleSheet.flatten([{ backgroundColor: styles.bgPrimaryColor }, style.header])}>
            <Body>
                <View
                    style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                    <TouchableOpacity style={[style.headerLeft]} onPress={this.backPressed}>
                        <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                    </TouchableOpacity>
                    <View style={[style.headerBody]}>
                        <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.navigation.state.params.currentElement.label}</Text>
                    </View>
                    <View style={[style.headerRight]}>
                    </View>
                    <View />
                </View>
            </Body>
        </Header>
        return view
    }
    render() {
        return (
            <StyleProvider style={getTheme(platform)} >
                <Container>
                    {/* {this.headerView()} */}
                    {renderIf(this.props.errorMessage != '',
                        <CustomAlert title='Alert' message={this.props.errorMessage} onOkPressed={this.backPressed} />
                    )}
                    <Content style={[styles.flex1, styles.bgWhite]}>
                        {this.getLoader()}
                        {this.getListView()}
                    </Content>
                    <SafeAreaView style={[styles.bgWhite]}>
                        <Footer
                            style={[style.footer, styles.bgWhite]}>
                            <View style={[styles.justifySpaceBetween, styles.row, styles.alignCenter, styles.paddingBottom10]}>
                                <Text
                                    style={[styles.fontDefault, styles.fontBlack, styles.marginBottom10]}>{TOTAL_COUNT} {_.size(this.props.arrayElements)}</Text>
                                <Button bordered success small onPress={this.addPressed}>
                                    <Text style={[styles.fontSuccess, styles.padding10]}>{ADD}</Text>
                                </Button>
                            </View>
                            <View style={[{ backgroundColor: styles.bgPrimaryColor }]}>
                                <Button success full disabled={this.props.isSaveDisabled} onPress={this.savePressed} >
                                    <Text style={[styles.fontLg, styles.fontWhite]}>{SAVE}</Text>
                                </Button>
                            </View>
                        </Footer>
                    </SafeAreaView>
                </Container >
            </StyleProvider >
        )
    }
};
const style = StyleSheet.create({// Comment Refactor these
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
    footer: {
        flexDirection: 'column',
        height: 'auto',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3',
        padding: 10
    },
    card: {
        borderBottomWidth: 10,
        borderBottomColor: '#f3f3f3'
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(ArrayFieldAttribute)
