'use strict'
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Dimensions,
  ListView,
  Platform,
  TouchableHighlight,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
}
  from 'react-native'

import { Form, Item, Input, Container, Content, ListItem, CheckBox, List, Body, Left, Right, Text, Header, Icon, Button } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as homeActions from '../modules/home/homeActions'
import { Actions } from 'react-native-router-flux';
import _ from 'underscore'
import renderIf from '../lib/renderIf';
import Swipeable from 'react-native-swipeable';

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 2,
    backgroundColor: '#f7f7f7',
    marginBottom: Platform.OS === 'ios' ? 60 : 50,
  },
  style_row_view: {
    flex: 1,
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#f7f7f7',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5
  },
  listCircle: {
    width: 64,
    height: 64,
    backgroundColor: 'green',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

  },
  listCircleCheckbox: {
    width: 64,
    height: 64,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15
  },
  hidden: {
    width: 0,
    height: 0
  },
  testsad: {
    borderBottomWidth: 0
  },
  circleLine1: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },
  circleLine2: {
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
    color: '#ffffff',
    width: 60
  }
})

function mapStateToProps(state) {
  return {
    jobTransactionCustomizationList: state.listing.jobTransactionCustomizationList,
    isRefreshing: state.listing.isRefreshing
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...homeActions }, dispatch)
  }
}

class Jobs extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (_.isEmpty(this.props.jobTransactionCustomizationList)) {
      this.props.actions.fetchJobs()
    }
  }

  toggleStatus() {
    this.setState({
      status: !this.state.status
    });
    console.log('toggle button handler: ' + this.state.status);
  }

  renderData = (item) => {
    return (
      <Swipeable
        leftButtons={[
          <Button style={[styles.swipeItem, { backgroundColor: 'red' }]}>
            <Ionicons name='ios-trash' style={{ fontSize: 34, color: '#ffffff', marginRight: 30, textAlign: 'right' }} />
          </Button>
        ]}
        rightButtons={[
          <Button style={[styles.swipeItem, { backgroundColor: '#062d4c' }]}>
            <Ionicons name='ios-call-outline' style={{ fontSize: 34, color: '#ffffff', marginLeft: 25 }} />
          </Button>,
          <Button style={[styles.swipeItem, { backgroundColor: '#395270' }]}>
            <Ionicons name='ios-pin-outline' style={{ fontSize: 34, color: '#ffffff', marginLeft: 25 }} />
          </Button>,
          <Button style={[styles.swipeItem, { backgroundColor: '#062d4c' }]}>
            <Ionicons name='ios-call-outline' style={{ fontSize: 34, color: '#ffffff', marginLeft: 25 }} />
          </Button>,
          <Button style={[styles.swipeItem, { backgroundColor: '#062d4c' }]}>
            <Ionicons name='ios-call-outline' style={{ fontSize: 34, color: '#ffffff', marginLeft: 25 }} />
          </Button>,
        ]}
      >
        <ListItem avatar>
          <Left>
            <TouchableHighlight underlayColor='#e7e7e7' style={[styles.listCircle]} onPress={() => this.toggleStatus()}>
              <View>
                <Text style={StyleSheet.flatten(styles.circleLine1)}>{`${item.circleLine1}`}</Text>
                <Text style={StyleSheet.flatten(styles.circleLine2)}>{`${item.circleLine2}`}</Text>
              </View>
            </TouchableHighlight>
          </Left>
          <Body >
            <Text adjustsFontSizeToFit>
              {`${item.line1}`}
            </Text>
            <Text note adjustsFontSizeToFit>
              {`${item.line2}`}
            </Text>
          </Body>
        </ListItem>
      </Swipeable>
    )
  }

  renderList() {
    const list = this.props.jobTransactionCustomizationList.filter(transactionCustomizationObject => this.props.statusIdList.includes(transactionCustomizationObject.statusId))
    list.sort(function (transaction1, transaction2) {
      return transaction1.seqSelected - transaction2.seqSelected
    })
    return list
  }

  render() {
    return (
      <Container>
        <View style={styles.container}>
          <List
            style={{ marginTop: 5, marginBottom: 50 }}>
            <FlatList
              data={this.renderList()}
              renderItem={({ item }) => this.renderData(item)}
              keyExtractor={item => item.id}
            />
          </List>
          <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 5, marginLeft: 5, marginRight: 5 }}>
            <View style={{ backgroundColor: '#fff', flexGrow: .90, height: 40 }}>
              <Input bordered='true' rounded style={{ fontSize: 14, backgroundColor: '#ffffff', borderColor: '#d3d3d3', borderWidth: 1 }}
                placeholder="Search Reference No." />
            </View>
            <View style={{ backgroundColor: '#d7d7d7', flexGrow: .10, height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name='ios-barcode-outline' style={{ fontSize: 34 }} />
            </View>
          </View>
        </View>
      </Container>
    )
  }

};

export default connect(mapStateToProps, mapDispatchToProps)(Jobs)
