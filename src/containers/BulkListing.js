'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as bulkActions from '../modules/bulk/bulkActions'
import * as globalActions from '../modules/global/globalActions'
import Loader from '../components/Loader'

import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  BackHandler,
  TextInput
} from 'react-native'

import {
  Container,
  Header,
  Button,
  Text,
  Body,
  Icon,
  Footer,
  StyleProvider,
  ActionSheet,
  Toast
} from 'native-base'

import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf'
import JobListItem from '../components/JobListItem'
import _ from 'lodash'
import {
  NEXT_POSSIBLE_STATUS,
  FILTER_REF_NO,
  OK,
  CANCEL,
  UPDATE_ALL_SELECTED,
  BULK_UPDATE
} from '../lib/ContainerConstants'

import {
  FormLayout,
  CLEAR_BULK_STATE,
  HardwareBackPress,
  SET_BULK_SEARCH_TEXT,
  SET_BULK_ERROR_MESSAGE,
  QrCodeScanner
} from '../lib/constants'
import QRIcon from '../svg_components/icons/QRIcon'

function mapStateToProps(state) {
  return {
    bulkTransactionList: state.bulk.bulkTransactionList,
    isLoaderRunning: state.bulk.isLoaderRunning,
    selectedItems: state.bulk.selectedItems,
    selectAllNone: state.bulk.selectAllNone,
    isSelectAllVisible: state.bulk.isSelectAllVisible,
    searchText: state.bulk.searchText,
    isManualSelectionAllowed: state.bulk.isManualSelectionAllowed,
    searchSelectionOnLine1Line2: state.bulk.searchSelectionOnLine1Line2,
    idToSeparatorMap: state.bulk.idToSeparatorMap,
    errorToastMessage: state.bulk.errorToastMessage,
    nextStatusList: state.bulk.nextStatusList
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...bulkActions, ...globalActions }, dispatch)
  }
}

class BulkListing extends PureComponent {

  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  }

  renderData = (item) => {
    return (
      <JobListItem data={item}
        onPressItem={() => this.onClickRowItem(item)}
      />
    )
  }

  componentDidUpdate() {
    if (this.props.errorToastMessage && this.props.errorToastMessage != '') {
      Toast.show({
        text: this.props.errorToastMessage,
        position: 'bottom',
        buttonText: OK,
        duration: 5000
      })
      this.props.actions.setState(SET_BULK_ERROR_MESSAGE, '')
    }
  }

  onClickRowItem(item) {
    if (this.props.isManualSelectionAllowed) {
      this.props.actions.toggleMultipleTransactions([item], this.props.bulkTransactionList, this.props.selectedItems)
    }
  }

  selectAll = () => {
    this.props.actions.toggleAllItems(this.props.bulkTransactionList, this.props.selectAllNone, this.props.selectedItems)
  }

  componentDidMount() {
    this.props.actions.getBulkJobTransactions(this.props.navigation.state.params)
    BackHandler.addEventListener(HardwareBackPress, this._goBack)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(HardwareBackPress, this._goBack)
  }


  _setQrValue = (value) => {
    if (value && value != '')
      this.props.actions.setSearchedItem(value, this.props.bulkTransactionList, this.props.searchSelectionOnLine1Line2, this.props.idToSeparatorMap, this.props.selectedItems)
  }

  searchBarView() {
    return (
      <View style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.paddingLeft10, styles.paddingRight10]}>
        <View style={[styles.relative, { width: '85%', height: 30 }]}>
          <TextInput
            placeholder={FILTER_REF_NO}
            placeholderTextColor={'rgba(255,255,255,.6)'}
            selectionColor={'rgba(224, 224, 224,.5)'}
            style={[style.headerSearch]}
            returnKeyType={"search"}
            keyboardAppearance={"dark"}
            underlineColorAndroid={'transparent'}
            onChangeText={(searchText) => {
              this.props.actions.setState(SET_BULK_SEARCH_TEXT, searchText)
            }}
            onEndEditing={() => {
              if (this.props.searchText && this.props.searchText != '')
                this.props.actions.setSearchedItem(this.props.searchText, this.props.bulkTransactionList, this.props.searchSelectionOnLine1Line2, this.props.idToSeparatorMap, this.props.selectedItems)
            }}
            value={this.props.searchText} />
          <Button small transparent style={[style.inputInnerBtn]} onPress={() => {
            if (this.props.searchText && this.props.searchText != '')
              this.props.actions.setSearchedItem(this.props.searchText, this.props.bulkTransactionList, this.props.searchSelectionOnLine1Line2, this.props.idToSeparatorMap, this.props.selectedItems)
          }}>
            <Icon name="md-search" style={[styles.fontWhite, styles.fontXl]} />
          </Button>
        </View>
        <TouchableOpacity style={[{ width: '15%' }, styles.marginLeft15]} onPress={() => {
          BackHandler.removeEventListener(HardwareBackPress, this._goBack)
          this.props.navigation.navigate(QrCodeScanner, { returnData: this._setQrValue.bind(this) })
        }} >
          <QRIcon width={30} height={30} color={styles.fontWhite} />
        </TouchableOpacity>
      </View>
    )
  }

  renderList() {
    if (!this.props.searchText || this.props.searchText == '') {
      return Object.values(this.props.bulkTransactionList)
    }
    else {
      let jobTransactionArray = []
      let searchText = this.props.searchText
      _.forEach(this.props.bulkTransactionList, function (value) {
        let values = [value.runsheetNo, value.referenceNumber, value.line1, value.line2, value.circleLine1, value.circleLine2]
        if (_.some(values, (data) => _.includes(_.toLower(data), _.toLower(searchText)))) {
          jobTransactionArray.push(value)
        }
      })
      return jobTransactionArray;
    }
  }

  render() {
    if (this.props.isLoaderRunning) {
      return <Loader />
    }
    else {
      if (_.isEmpty(this.props.bulkTransactionList)) {
        return (
          <StyleProvider style={getTheme(platform)}>
            <Container>
              <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, styles.padding5])}>
                <Body>
                  <View
                    style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                    <TouchableOpacity style={[style.headerLeft, styles.paddingTop10]} onPress={() => {
                      this.props.navigation.goBack(null)
                      this.props.actions.setState(CLEAR_BULK_STATE)
                    }}>
                      <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                    </TouchableOpacity>
                    <View style={[style.headerBody]}>
                      <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{BULK_UPDATE}</Text>
                    </View>
                    <View style={[style.headerRight]}>
                    </View>
                    <View />
                  </View>
                </Body>
              </Header>

              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                <Text style={[styles.margin30, styles.fontDefault, styles.fontDarkGray]}>No jobs present</Text>
              </View>
            </Container>
          </StyleProvider>
        )
      } else {
        let nextStatusNames = []
        const searchBarView = this.searchBarView()
        this.props.nextStatusList.forEach(object => {
          let statusObject =
            { text: object.name, icon: "md-arrow-dropright", iconColor: "#000000" }
          nextStatusNames.push(statusObject)
        })
        nextStatusNames.push({ text: CANCEL, icon: "close", iconColor: styles.bgDanger.backgroundColor })
        const nextStatusIds = this.props.nextStatusList.map(nextStatus => nextStatus.id)

        return (
          <StyleProvider style={getTheme(platform)}>
            <Container>
              <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
                <Body>
                  <View
                    style={[styles.row, styles.width100, styles.justifySpaceBetween,]}>
                    <Button transparent onPress={() => {
                      this.props.actions.setState(CLEAR_BULK_STATE)
                      this.props.navigation.goBack(null)
                    }}>
                      <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]} />
                    </Button>
                    <View style={[style.headerBody]}>
                      <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>{(this.props.navigation.state.params.groupId) ? this.props.navigation.state.params.groupId : BULK_UPDATE}}</Text>
                    </View>
                    <View style={[style.headerRight]}>
                      {this.props.isSelectAllVisible ?
                        <Text
                          onPress={this.selectAll}
                          style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>{this.props.selectAllNone}</Text>
                        : null}
                    </View>
                    <View />
                  </View>
                  {searchBarView}
                </Body>
              </Header>
              <FlatList
                data={this.renderList()}
                renderItem={({ item }) => this.renderData(item)}
                keyExtractor={item => String(item.id)}
              />

              <Footer
                style={[{ height: 'auto' }, styles.column, styles.padding10]}>
                <Text
                  style={[styles.fontSm, styles.marginBottom10]}>Total Count : {this.props.selectedItems.length}</Text>
                <Button
                  onPress={() => {
                    (nextStatusNames.length > 2) ? ActionSheet.show(
                      {
                        options: nextStatusNames,
                        cancelButtonIndex: nextStatusNames.length - 1,
                        title: NEXT_POSSIBLE_STATUS
                      },
                      buttonIndex => {
                        if (buttonIndex >= 0 && buttonIndex != nextStatusNames.length - 1) {
                          this.goToFormLayout(nextStatusIds[buttonIndex], nextStatusNames[buttonIndex].text)
                        }
                      }
                    ) : this.goToFormLayout(nextStatusIds[0], nextStatusNames[0].text)
                    BackHandler.removeEventListener(HardwareBackPress, this._goBack)
                  }}
                  success full
                  disabled={_.isEmpty(this.props.selectedItems)}
                >
                  <Text style={[styles.fontLg, styles.fontWhite]}>{UPDATE_ALL_SELECTED}</Text>
                </Button>
              </Footer>

            </Container>
          </StyleProvider>
        )
      }
    }
  }

  goToFormLayout(statusId, statusName) {
    this.props.actions.navigateToScene(FormLayout, {
      statusId,
      statusName,
      jobMasterId: this.props.navigation.state.params.pageObject.jobMasterIds[0],
      jobTransaction: Object.values(this.props.selectedItems),
    }
    )
  }

  _goBack = () => {
    this.props.actions.setState(CLEAR_BULK_STATE)
  }
}

const style = StyleSheet.create({
  header: {
    borderBottomWidth: 0,
    height: 'auto',
    padding: 0,
    paddingRight: 0,
    paddingLeft: 0,
    paddingBottom: 10
  },

  headerLeft: {
    width: '15%',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerBody: {
    width: '50%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerRight: {
    width: '35%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerSearch: {
    paddingLeft: 10,
    paddingRight: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    borderRadius: 2,
    paddingTop: 0,
    paddingBottom: 0,
    height: 30,
    color: '#fff',
    fontSize: 11
  },
  inputInnerBtn: {
    position: 'absolute',
    top: 0,
    right: 5,
    paddingLeft: 0,
    paddingRight: 0
  },
  headerQRButton: {
    position: 'absolute',
    right: 5,
    paddingLeft: 0,
    paddingRight: 0
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BulkListing)

