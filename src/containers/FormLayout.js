'use strict'
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Platform,
  FlatList,
  TouchableOpacity,
}
  from 'react-native'
import { Container, Content, Card, Button, Body, Header, Right, Icon, Toast, Footer, FooterTab, StyleProvider } from 'native-base'
import styles from '../themes/FeStyle'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform';
import * as formLayoutActions from '../modules/form-layout/formLayoutActions.js'
import * as globalActions from '../modules/global/globalActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import BasicFormElement from '../components/FormLayoutBasicComponent.js'
import Loader from '../components/Loader'
import renderIf from '../lib/renderIf.js'
import {
  NET_BANKING,
  NET_BANKING_LINK,
  NET_BANKING_CARD_LINK,
  NET_BANKING_UPI_LINK,
  UPI,
} from '../lib/AttributeConstants'

import {
  SET_FORM_LAYOUT_STATE,
} from '../lib/constants'

function mapStateToProps(state) {
  return {
    formElement: state.formLayout.formElement,
    isSaveDisabled: state.formLayout.isSaveDisabled,
    statusName: state.formLayout.statusName,
    jobTransactionId: state.formLayout.jobTransactionId,
    statusId: state.formLayout.statusId,
    latestPositionId: state.formLayout.latestPositionId,
    paymentAtEnd: state.formLayout.paymentAtEnd,
    isLoading: state.formLayout.isLoading,
    errorMessage: state.formLayout.errorMessage,
    currentElement: state.formLayout.currentElement,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...formLayoutActions, ...globalActions }, dispatch)
  }
}

class FormLayout extends Component {

  componentWillMount() {
    if (this.props.navigation.state.params.editableFormLayoutState) {
      this.props.actions.setState(SET_FORM_LAYOUT_STATE, this.props.navigation.state.params.editableFormLayoutState)
    }
    else {
      this.props.actions.getSortedRootFieldAttributes(this.props.navigation.state.params.statusId, this.props.navigation.state.params.statusName, this.props.navigation.state.params.jobTransactionId);
    }
  }

  renderData = (item) => {
    return (
      <BasicFormElement
        item={item}
        formElement={this.props.formElement}
        isSaveDisabled={this.props.isSaveDisabled}
        jobTransaction={this.props.navigation.state.params.jobTransaction}
        jobStatusId={this.props.navigation.state.params.statusId}
        latestPositionId={this.props.latestPositionId} />
    )
  }

  paymentSceneFromModeTypeId(modeTypeId) {
    if (!modeTypeId) {
      return null
    }
    switch (modeTypeId) {
      case NET_BANKING.id:
      case NET_BANKING_LINK.id:
      case NET_BANKING_CARD_LINK.id:
      case NET_BANKING_UPI_LINK.id: return 'PayByLink'
      case UPI.id: return 'UPIPayment'
    }

    return null
  }



  saveJobTransaction() {
    let formLayoutState = {
      formElement: this.props.formElement,
      nextEditable: this.props.nextEditable,
      isSaveDisabled: this.props.isSaveDisabled,
      statusName: this.props.statusName,
      jobTransactionId: this.props.jobTransactionId,
      statusId: this.props.statusId,
      latestPositionId: this.props.latestPositionId,
      paymentAtEnd: this.props.paymentAtEnd,
      isLoading: this.props.isLoading,
      errorMessage: this.props.errorMessage,
      currentElement: this.props.currentElement,
    }
    if (this.props.paymentAtEnd && this.props.paymentAtEnd.isCardPayment) {
      this.props.actions.navigateToScene(this.paymentSceneFromModeTypeId(this.props.paymentAtEnd.modeTypeId),
        {
          contactData: this.props.navigation.state.params.contactData,
          formElement: this.props.formElement,
          jobTransaction: this.props.navigation.state.params.jobTransaction,
          paymentAtEnd: this.props.paymentAtEnd,
        })
    } else {
      this.props.actions.saveJobTransaction(
        formLayoutState,
        this.props.navigation.state.params.jobMasterId,
        this.props.navigation.state.params.contactData,
        this.props.navigation.state.params.jobTransaction,
        this.props.navigation.state.params.navigationFormLayoutStates,
        this.props.navigation.state.params.saveActivatedStatusData
      )
    }
  }

  _keyExtractor = (item, index) => item[1].key;

  render() {
    console.log(this.props)
    if ((this.props.errorMessage != null && this.props.errorMessage != undefined && this.props.errorMessage.length != 0)) {
      Toast.show({
        text: this.props.errorMessage,
        position: 'bottom',
        buttonText: 'Okay'
      })
    }
    if (this.props.isLoading) { return <Loader /> }
    if (this.props.formElement && this.props.formElement.length == 0) {
      <Footer style={[style.footer]}>
        <FooterTab style={[styles.padding10]}>
          <Button success full
            onPress={() => this.saveJobTransaction(this.props.formElement, this.props.jobTransactionId, this.props.statusId)}
            disabled={this.props.isSaveDisabled}>
            <Text style={[styles.fontLg, styles.fontWhite]}>{this.props.paymentAtEnd ? this.props.paymentAtEnd.isCardPayment ? 'Proceed To Payment' : this.props.statusName : this.props.statusName}</Text>
          </Button>
        </FooterTab>
      </Footer>
    }
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
            <Body>
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                  <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                </TouchableOpacity>
                <View style={[style.headerBody]}>
                  <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.statusName}</Text>
                </View>
                <View style={[style.headerRight]}>
                </View>
                <View />
              </View>
            </Body>
          </Header>

          <Content style={[styles.flex1, styles.bgWhite]}>
            <View style={[styles.paddingTop10, styles.paddingBottom10]}>
              <FlatList
                data={Array.from(this.props.formElement)}
                extraData={this.state}
                renderItem={(item) => this.renderData(item.item[1])} //item[1] contains the formLayoutObject as Array.from on map makes it array with 0 index containing key and 1st index containing object
                keyExtractor={this._keyExtractor}>
              </FlatList>
            </View>
          </Content>

          <Footer style={[style.footer]}>
            <FooterTab style={[styles.padding10]}>
              <Button success full
                onPress={() => this.saveJobTransaction(this.props.formElement, this.props.jobTransactionId, this.props.statusId)}
                disabled={this.props.isSaveDisabled}>
                <Text style={[styles.fontLg, styles.fontWhite]}>{this.props.paymentAtEnd ? this.props.paymentAtEnd.isCardPayment ? 'Proceed To Payment' : this.props.statusName : this.props.statusName}</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container >
      </StyleProvider >
    )
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
  footer: {
    height: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#f3f3f3'
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FormLayout)
