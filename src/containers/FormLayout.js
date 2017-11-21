'use strict'
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Platform,
  FlatList
}
  from 'react-native'
import { Container, Content, Footer, Card, CardItem, Button, Body, Header, Left, Right, Icon, Toast } from 'native-base'
import styles from '../themes/FeStyle'
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

function mapStateToProps(state) {
  return {
    formElement: state.formLayout.formElement,
    nextEditable: state.formLayout.nextEditable,
    isSaveDisabled: state.formLayout.isSaveDisabled,
    statusName: state.formLayout.statusName,
    jobTransactionId: state.formLayout.jobTransactionId,
    statusId: state.formLayout.statusId,
    latestPositionId: state.formLayout.latestPositionId,
    paymentAtEnd: state.formLayout.paymentAtEnd,
    isLoading: state.formLayout.isLoading,
    errorMessage: state.formLayout.errorMessage,
    currentElement: state.formLayout.currentElement,
    noOfElements: state.formLayout.noOfElements,
    nextElement: state.formLayout.nextElement
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...formLayoutActions, ...globalActions }, dispatch)
  }
}

class FormLayout extends Component {

  componentWillMount() {
    console.log('formLayout',this.props.navigation.state.params.navigationFormLayoutStates)
    this.props.actions.getSortedRootFieldAttributes(this.props.navigation.state.params.statusId, this.props.navigation.state.params.statusName, this.props.navigation.state.params.jobTransactionId);
  }

  renderData = (item) => {
    return (
      <BasicFormElement
        item={item}
        nextEditable={this.props.nextEditable}
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
      noOfElements: this.props.noOfElements,
      nextElement: this.props.nextElement,
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
      );
    }
  }

  _keyExtractor = (item, index) => item[1].key;
  render() {
    if ((this.props.errorMessage != null && this.props.errorMessage != undefined && this.props.errorMessage.length != 0)) {
      Toast.show({
        text: this.props.errorMessage,
        position: 'bottom',
        buttonText: 'Okay'
      })}
    if (this.props.isLoading) { return <Loader /> }
    return (
      <Container style={StyleSheet.flatten([styles.mainBg])}>
        <Header style={StyleSheet.flatten([styles.bgPrimary])}>
          <Left>
            <Button transparent onPress={() => { this.props.navigation.goBack(null) }}>
              <Icon name='arrow-back' style={StyleSheet.flatten([styles.fontXl, styles.fontWhite])} />
            </Button>
          </Left>
          <Body>
            <Text style={StyleSheet.flatten([styles.fontWhite])}>{this.props.statusName}</Text>
          </Body>
          <Right>

          </Right>
        </Header>
        <Content style={StyleSheet.flatten([styles.padding5])}>
          <FlatList
            data={Array.from(this.props.formElement)}
            extraData={this.state}
            renderItem={(item) => this.renderData(item.item[1])} //TODO add comments for item[1] 
            keyExtractor={this._keyExtractor}>
          </FlatList>
        </Content>
        <Button full success
          disabled={this.props.isSaveDisabled} onPress={() => this.saveJobTransaction()}>
          <Text style={{ color: 'white' }}>{this.props.paymentAtEnd ? this.props.paymentAtEnd.isCardPayment ? 'Proceed To Payment' : this.props.statusName : this.props.statusName}</Text>
        </Button>

      </Container>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormLayout)
