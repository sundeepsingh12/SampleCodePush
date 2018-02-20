'use strict'
import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native'
import { Container, Button, Footer, Header, Icon, Body, Toast } from 'native-base';
import * as fixedSKUActions from '../modules/fixedSKU/fixedSKUActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Loader from '../components/Loader'
import { ARRAY_SAROJ_FAREYE } from '../lib/AttributeConstants'
import * as globalActions from '../modules/global/globalActions'
import FixedSKUListItem from '../components/FixedSKUListItem'
import styles from '../themes/FeStyle'
import { SET_TOAST_ERROR_MESSAGE } from '../lib/constants'
import { OK, SAVE, TOTAL_QUANTITY } from '../lib/ContainerConstants'

let style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#f7f7f7'
  },
  footer: {
    flexDirection: 'column',
    height: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#f3f3f3',
    padding: 10
  },
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
    width: '20%',
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 15
  },
})

function mapStateToProps(state) {
  return {
    isLoaderRunning: state.fixedSKU.isLoaderRunning,
    fixedSKUList: state.fixedSKU.fixedSKUList,
    totalQuantity: state.fixedSKU.totalQuantity,
    errorMessage: state.fixedSKU.errorMessage
  }
};


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...fixedSKUActions, ...globalActions }, dispatch)
  }
}

class FixedSKUListing extends PureComponent {
  constructor(props) {
    super(props)
    let navigationState = this.props.navigation.state.params
    this.parentObject = navigationState['currentElement']
    this.jobTransaction = navigationState['jobTransaction']
    this.latestPositionId = navigationState['latestPositionId']
    this.formElement = navigationState['formElements']
    this.isSaveDisabled = navigationState['isSaveDisabled']
  }

  componentWillMount() {
    if (this.parentObject.value != ARRAY_SAROJ_FAREYE) {
      this.props.actions.fetchFixedSKU(this.parentObject.fieldAttributeMasterId)
    }
  }

  componentDidUpdate() {
    if (this.props.errorMessage != '') {
      Toast.show({
        text: this.props.errorMessage,
        position: "bottom" | "center",
        buttonText: OK,
        type: 'danger',
        duration: 3000
      })
      this.props.actions.setState(SET_TOAST_ERROR_MESSAGE, '')
    }
  }

  showToast(message) {
    this.props.actions.setState(SET_TOAST_ERROR_MESSAGE, message)
  }

  renderData = (item) => {
    if (item.childDataList) {
      return (
        <FixedSKUListItem item={item} showToast={this.showToast.bind(this)} />
      )
    }
  }

  render() {
    if (this.props.isLoaderRunning) {
      return (
        <Loader />
      )
    }
    return (
      <Container>
        <View style={style.container}>
          <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
            <Body>
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack() }}>
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

          <FlatList
            data={Object.values(this.props.fixedSKUList)}
            renderItem={({ item }) => this.renderData(item)}
            keyExtractor={item => String(item.id)}
          />

          <Footer
            style={[style.footer, styles.bgWhite, styles.column]}>
            <View style={[styles.justifySpaceBetween, styles.row, styles.alignCenter, styles.paddingBottom10]}>
              <Text>
                {TOTAL_QUANTITY} {parseInt(this.props.totalQuantity)}
              </Text>
            </View>
            <View style={[styles.bgPrimary]}>
              <Button success full style={[styles.bgPrimary]}
                onPress={() => {
                  this.props.actions.onSave(this.parentObject, this.formElement, this.props.fixedSKUList, this.isSaveDisabled, this.latestPositionId, this.jobTransaction)
                }}>
                <Text style={{ textAlign: 'center', width: '100%', color: 'white' }}>
                  {SAVE}
                </Text>
              </Button>
            </View>
          </Footer>
        </View>
      </Container >
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FixedSKUListing)
