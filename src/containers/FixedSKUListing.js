'use strict'
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Platform,
  FlatList,
  Slider,
  TextInput,
}
  from 'react-native'
import { Container, Content, Tab, Tabs, Body, Button, Header, Title, Left, Right, Card, CardItem } from 'native-base';
import * as fixedSKUActions from '../modules/fixedSKU/fixedSKUActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Loader from '../components/Loader'
import {
  FIXED_SKU_QUANTITY,
  FIXED_SKU_UNIT_PRICE,
  FIXED_SKU_CODE
} from '../lib/AttributeConstants'
import * as globalActions from '../modules/global/globalActions'

var styles = StyleSheet.create({
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

/*
 * Bind all the actions
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...fixedSKUActions, ...globalActions }, dispatch)
  }
}

class FixedSKUListing extends Component {

  componentWillMount() {
    if (Object.keys(this.props.fixedSKUList).length === 0) {
      let attributeTypeId = 1;
      let fieldAttributeMasterId = 42133;
      this.props.actions.fetchFixedSKU(attributeTypeId, fieldAttributeMasterId)
    }
  }


  renderData = (item) => {
    if (item.childDataList) {
      return (
        <View>
          <Content>
            <Card>
              <CardItem >
                <Text>Code : {item.childDataList[FIXED_SKU_CODE].value}</Text>
              </CardItem>
              <CardItem >
                <Text>Unit Price : {item.childDataList[FIXED_SKU_UNIT_PRICE].value}</Text>
              </CardItem>
              <CardItem>
                <Slider style={{
                  width: 300, flex: 9,
                  flexDirection: 'column',
                }}
                  maximumValue={9999}
                  minimumValue={0}
                  onSlidingComplete={(quantity) => {
                    let payload = {
                      id: item.id,
                      quantity: quantity
                    }
                    this.props.actions.onChangeQuantity(this.props.fixedSKUList, payload)
                  }}
                />
                <TextInput style={{ flex: 1 }}
                  editable={true}
                  maxLength={4}
                  placeholder={'0'}
                  keyboardType={'numeric'}
                  onChangeText={(quantity) => {
                    let payload = {
                      id: item.id,
                      quantity
                    }
                    this.props.actions.onChangeQuantity(this.props.fixedSKUList, payload)
                  }}
                >{item.childDataList[FIXED_SKU_QUANTITY].value}
                </TextInput>
              </CardItem>
            </Card>
          </Content>
        </View>
      )
    }
  }

  render() {
    console.log('render called after save'+this.props.isLoaderRunning);
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
            Total Qauntity : {this.props.totalQuantity}
          </Text>
          <Button>
            <Text style={{ textAlign: 'center', width: '100%', color: 'white' }}
              onPress={() => {
                this.props.actions.onSave(this.props.fixedSKUList)
                this.props.actions.navigateToScene('Home', {})
              }}>
              Save
              </Text>
          </Button>
        </View>
      </Container>
    )
  }
};

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(FixedSKUListing)
