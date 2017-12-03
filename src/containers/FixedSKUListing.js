'use strict'
import React, { Component } from 'react'
import { StyleSheet, View, Text, FlatList } from 'react-native'
import { Container, Button } from 'native-base';
import * as fixedSKUActions from '../modules/fixedSKU/fixedSKUActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Loader from '../components/Loader'
import { ARRAY_SAROJ_FAREYE } from '../lib/AttributeConstants'
import * as globalActions from '../modules/global/globalActions'
import FixedSKUListItem from '../components/FixedSKUListItem'

let styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#f7f7f7'
  },
})

function mapStateToProps(state) {
  return {
    isLoaderRunning: state.fixedSKU.isLoaderRunning,
    fixedSKUList: state.fixedSKU.fixedSKUList,
    totalQuantity: state.fixedSKU.totalQuantity,
  }
};


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...fixedSKUActions, ...globalActions }, dispatch)
  }
}

class FixedSKUListing extends Component {
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


  renderData = (item) => {
    if (item.childDataList) {
      return (
        <FixedSKUListItem item={item} />
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
        <View style={styles.container}>
          <FlatList
            data={Object.values(this.props.fixedSKUList)}
            renderItem={({ item }) => this.renderData(item)}
            keyExtractor={item => item.id}
          />
          <Text style={{ marginBottom: 10, marginTop: 10 }}>
            Total Quantity : {parseInt(this.props.totalQuantity)}
          </Text>
          <Button
            onPress={() => {
              this.props.actions.onSave(this.parentObject, this.formElement, this.props.fixedSKUList, this.isSaveDisabled, this.latestPositionId, this.jobTransaction.id)
              this.props.navigation.goBack()
            }}>
            <Text style={{ textAlign: 'center', width: '100%', color: 'white' }}>
              Save
              </Text>
          </Button>
        </View>
      </Container>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FixedSKUListing)
