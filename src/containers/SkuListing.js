'use strict';
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
}
  from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as skuListingActions from '../modules/skulisting/skuListingActions'
import Loader from '../components/Loader'
import SkuListItem from '../components/SkuListItem'
import { Container, Content, ListItem, List, Text, Footer, FooterTab, Button, Input } from 'native-base'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf';
import _ from 'underscore';

class SkuListing extends Component {

  componentWillMount() {
    const fieldAttributeMasterId = this.props.navigation.state.params.currentElement.fieldAttributeMasterId
    console.log('fieldAttributeMasterId', fieldAttributeMasterId)
    const jobId = this.props.navigation.state.params.jobTransaction.jobId
    console.log('jobId', jobId)
    this.props.actions.prepareSkuList(this.props.navigation.state.params.currentElement.fieldAttributeMasterId, this.props.navigation.state.params.jobTransaction.jobId)
  }

  renderData(item) {
    return (
      <SkuListItem item={item} skuObjectValidation={this.props.skuObjectValidation} updateSkuActualQuantity={this.updateSkuActualQty.bind(this)} />
    )
  }

  updateSkuActualQty(value, parentId) {
    this.props.actions.updateSkuActualQuantityAndOtherData(value, parentId, this.props.skuListItems, this.props.skuChildItems)
  }

  onChangeSkuCode(skuCode) {
    this.props.actions.changeSkuCode(skuCode)
  }


  render() {
    if (this.props.skuListingLoading) {
      return <Loader />
    }
    else {
      return (
        <Container style={StyleSheet.flatten([styles.mainBg])}>
          <View style={StyleSheet.flatten([{ flex: 1, minHeight: '50%', maxHeight: '100%' }])}>
            <List>
              <FlatList
                data={_.values(this.props.skuListItems)}
                renderItem={({ item }) => this.renderData(item)}
                keyExtractor={item => _.values(this.props.skuListItems).indexOf(item)}
                ItemSeparatorComponent={this.renderSeparator}
              />
            </List>
          </View>
          {renderIf(this.props.isSearchBarVisible,
            <View style={{ flex: 2, flexDirection: 'row' }}>
              <View style={{ backgroundColor: '#fff', flexGrow: .90, height: 40 }}>
                <Input value={this.props.skuSearchTerm}
                  onChangeText={value => this.onChangeSkuCode(value)}
                  bordered='true'
                  rounded
                  style={{ fontSize: 14, backgroundColor: '#ffffff', borderColor: '#d3d3d3', borderWidth: 1 }}
                  placeholder="Scan Sku Code" />
              </View>
              <View onPress={() => this.scanSkuItem()} style={{ backgroundColor: '#d7d7d7', flexGrow: .10, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name='ios-barcode-outline' style={{ fontSize: 34 }} />
              </View>
            </View>)}

          <Footer>
            <FooterTab>
              <Button onPress={() => this.saveSkuList()}>
                <Text style={{ textAlign: 'center', width: '100%', color: 'white' }}>Proceed</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      )
    }
  }

  scanSkuItem() {
    //Code incomplete
    const searchTerm = this.props.skuSearchTerm;
    if (skuSearchTerm) {
      this.props.actions.scanSkuItem(this.props.skuListItems, searchTerm)
    }
  }

  saveSkuList() {
    this.props.actions.saveSkuListItems(
      this.props.skuListItems, this.props.skuObjectValidation, this.props.skuChildItems,
      this.props.skuObjectAttributeId, this.props.navigation.state.params.jobTransaction.id, this.props.navigation.state.params.latestPositionId,
      this.props.navigation.state.params.currentElement, this.props.navigation.state.params.formElements,
      this.props.navigation.state.params.nextEditable,
      this.props.navigation.state.params.isSaveDisabled
    )
    this.props.navigation.goBack()
  }


  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };
}

function mapStateToProps(state) {
  return {
    skuListingLoading: state.skuListing.skuListingLoading,
    skuListItems: state.skuListing.skuListItems,
    isSearchBarVisible: state.skuListing.isSearchBarVisible,
    skuSearchTerm: state.skuListing.skuSearchTerm,
    skuObjectValidation: state.skuListing.skuObjectValidation,
    skuChildItems: state.skuListing.skuChildItems,
    skuObjectAttributeId: state.skuListing.skuObjectAttributeId
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...skuListingActions }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SkuListing)