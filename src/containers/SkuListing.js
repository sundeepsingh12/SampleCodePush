'use strict'
import React, { PureComponent } from 'react'
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
import {
  Container,
  Content,
  Text,
  Footer,
  FooterTab,
  Button,
  Input,
  StyleProvider,
  Header,
  Left,
  Body,
  Right,
  Icon,
  Toast
} from 'native-base'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf'
import _ from 'lodash'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import * as globalActions from '../modules/global/globalActions'

class SkuListing extends PureComponent {

  componentDidMount() {
    const fieldAttributeMasterId = this.props.navigation.state.params.currentElement.fieldAttributeMasterId
    const jobId = this.props.navigation.state.params.jobTransaction.jobId
    this.props.actions.prepareSkuList(this.props.navigation.state.params.currentElement.fieldAttributeMasterId, this.props.navigation.state.params.jobTransaction.jobId)
  }

  renderData(item) {
    return (
      <SkuListItem item={item} skuObjectValidation={this.props.skuObjectValidation} updateSkuActualQuantity={this.updateSkuActualQty.bind(this)} reasonsList = {this.props.reasonsList} navigateToScene = {this.props.actions.navigateToScene.bind(this)}/>
    )
  }

  updateSkuActualQty(value, rowItem) {
    this.props.actions.updateSkuActualQuantityAndOtherData(value, rowItem, this.props.skuListItems, this.props.skuChildItems, this.props.skuValidationForImageAndReason)
  }

  onChangeSkuCode(skuCode) {
    this.props.actions.changeSkuCode(skuCode)
  }

  static navigationOptions = ({ navigation }) => {
    return { header: null }
  }

  render() {
    if (this.props.skuListingLoading) {
      return <Loader />
    }
    else {
      return (
        <StyleProvider style={getTheme(platform)}>
          <Container>
            <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
              <Body>
                <View
                  style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.marginBottom10, styles.marginTop15]}>
                  <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]} onPress={() => { this.props.navigation.goBack(null) }} />
                  <Text
                    style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>SKU</Text>
                  <View />
                </View>
               
              </Body>

            </Header>

            <Content style={[styles.flex1, styles.padding10, styles.bgLightGray]}>
              <FlatList
              initialNumToRender={_.size(this.props.skuListItems)}
                data={_.values(this.props.skuListItems)}
                renderItem={({ item }) => this.renderData(item)}
                keyExtractor={item => String(_.values(this.props.skuListItems).indexOf(item))}
              />
            </Content>

            <Footer style={[styles.heightAuto, styles.column, styles.padding10]}>
              <Button primary full onPress={this.saveSkuList}>
                <Text style={[styles.fontLg, styles.fontWhite]}>Proceed</Text>
              </Button>
            </Footer>
          </Container>
        </StyleProvider>
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
  
  saveSkuList = () => {
      this.props.actions.saveSkuListItems(
        this.props.skuListItems, this.props.skuObjectValidation, this.props.skuChildItems,
        this.props.skuObjectAttributeId, this.props.navigation.state.params.jobTransaction, this.props.navigation.state.params.latestPositionId,
        this.props.navigation.state.params.currentElement, this.props.navigation.state.params.formElements,
        this.props.navigation.state.params.isSaveDisabled, this.props.navigation, this.props.skuValidationForImageAndReason)
  }
}

function mapStateToProps(state) {
  return {
    skuListingLoading: state.skuListing.skuListingLoading,
    skuListItems: state.skuListing.skuListItems,
    isSearchBarVisible: state.skuListing.isSearchBarVisible,
    skuSearchTerm: state.skuListing.skuSearchTerm,
    skuObjectValidation: state.skuListing.skuObjectValidation,
    skuChildItems: state.skuListing.skuChildItems,
    skuObjectAttributeId: state.skuListing.skuObjectAttributeId,
    skuValidationForImageAndReason: state.skuListing.skuValidationForImageAndReason,
    reasonsList: state.skuListing.reasonsList,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...skuListingActions, ...globalActions }, dispatch)
  }
}

const style = StyleSheet.create({
  header: {
    borderBottomWidth: 0,
    height: 'auto',
    paddingTop: 10,
    paddingBottom: 10
  },
  headerIcon: {
    width: 24
  },
  headerSearch: {
    paddingLeft: 10,
    paddingRight: 30,
    backgroundColor: '#1260be',
    borderRadius: 2,
    height: 30,
    color: '#fff',
    fontSize: 10
  },
  headerQRButton: {
    position: 'absolute',
    right: 5,
    paddingLeft: 0,
    paddingRight: 0
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SkuListing)
