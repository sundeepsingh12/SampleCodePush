/**
 * # Main.js
 *  This is the main app screen
 *
 */
'use strict'
/*
 * ## Imports
 *
 * Imports from redux
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

/**
 * The actions we need
 */
import * as authActions from '../modules/login/loginActions'
import * as globalActions from '../modules/global/globalActions'
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * Router
 */
import {Actions} from 'react-native-router-flux'

/**
 * The components needed from React
 */
import React, {Component} from 'react'
import
{
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  Dimensions,
  TouchableHighlight,
  Platform
}
from 'react-native'

import { Container, Content, Tab, Tabs,Body, Header, Title, Left, Right} from 'native-base';


/**
 * The platform neutral button
 */
const Button = require('apsl-react-native-button')

/**
 *  Instead of including all app states via ...state
 *  One could explicitly enumerate only those which Main.js will depend on.
 *
 */
function mapStateToProps (state) {
  return {
    auth: {
      form: {
        isFetching: state.auth.form.isFetching
      }
    },
    global: {
      currentState: state.global.currentState,
      showState: state.global.showState
    }
  }
};

/*
 * Bind all the actions
 */
function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ ...authActions, ...globalActions }, dispatch)
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    marginBottom : 60,
    backgroundColor : '#f7f7f7'
  },
  summary: {
    fontFamily: 'BodoniSvtyTwoITCTT-Book',
    fontSize: 18,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#FF3366',
    borderColor: '#FF3366',
    marginLeft: 10,
    marginRight: 10
  },
  pieChartImage: {
    width: 355,
    resizeMode: 'contain'
  },
  tileWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 0,
    justifyContent: ('space-between'),
    paddingLeft: 10,
    paddingRight: 10
  },
  appTiles: {
    height: Dimensions.get("window").width/2 - 15,
    width: Dimensions.get("window").width/2 - 15,
    marginBottom: 10,
    backgroundColor: '#0059B2',
    flexDirection: 'column',
    justifyContent: ('center'),
    alignItems: 'center',
    borderRadius: 4
  }

})

/**
 * ## App class
 */
class Utilities extends Component {

  handlePress () {
    Actions.Subview({
      title: 'Subview'
      // you can add additional props to be passed to Subview here...
    })
  }

  render () {
    return (
      <Container>
        <Header>
            <Left/>
            <Body>
                <Title>Utilities</Title>
            </Body>
            <Right/>
        </Header>
        <View style={styles.container}>
          <ScrollView>
            <View style={{padding: 10, paddingTop: 0}}>
              <Image style={styles.pieChartImage}
                source={require('../../images/job-chart.png')}
              />
            </View>
            <View style={styles.tileWrapper}>
              <Button style={styles.appTiles}>
                <Ionicons style={{color: 'white'}} name={'ios-cloud-upload-outline'} size={100} />
                <Text style={{color: 'white', }}>Backup Upload</Text>
              </Button>
              <Button style={styles.appTiles}>
                <Ionicons style={{color: 'white'}} name={'ios-card-outline'} size={100} />
                <Text style={{color: 'white', }}>MSWipe</Text>
              </Button>
              <Button style={styles.appTiles}>
                <Ionicons style={{color: 'white'}} name={'ios-chatboxes-outline'} size={100} />
                <Text style={{color: 'white', }}>Message Box</Text>
              </Button>
              <Button style={styles.appTiles}>
                <Ionicons style={{color: 'white'}} name={'ios-list-outline'} size={100} />
                <Text style={{color: 'white', }}>Transaction Summary</Text>
              </Button>
              <Button style={styles.appTiles}>
                <Ionicons style={{color: 'white'}} name={'ios-podium-outline'} size={100} />
                <Text style={{color: 'white', }}>Statistic</Text>
              </Button>
            </View>
          </ScrollView>
        </View>
      </Container>

      
    )
  }
};

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(Utilities)
