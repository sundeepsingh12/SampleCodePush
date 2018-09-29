'use strict'
import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'

var style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  width70: {
    width: '70%'
  },

  forgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },

  logoContainer: {
    marginTop: 70,
    flexBasis: '20%',
    justifyContent: 'flex-start',
    marginBottom: 20
  },

  logoStyle: {
    width: 94,
  }

})

function mapStateToProps(state) {
  return {
  }
}

class Login extends PureComponent {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.props.checkRememberMe()
  }

  render() {
    return (
            <View style={style.container}>
            </View>
    )
  }
};

export default connect(mapStateToProps, null)(Login)