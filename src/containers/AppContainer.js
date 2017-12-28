'use strict';

import React, {PureComponent} from 'react';
import ReactNative from 'react-native';

const {
  AppRegistry,
  stylezheet,
  Text,
  View,
  TouchableHighlight,
  Animated
} = ReactNative;

import { Button } from 'native-base'


var isHidden = true;

class AppContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bounceValue: new Animated.Value(100),  //This is the initial position of the subview
      buttonText: "Show Subview"
    };
  }


  _toggleSubview() {    
    this.setState({
      buttonText: !isHidden ? "Show Subview" : "Hide Subview"
    });

    var toValue = 300;

    if(isHidden) {
      toValue = 0;
    }

    //This will animate the transalteY of the subview between 0 & 100 depending on its current state
    //100 comes from the style below, which is the height of the subview.
    Animated.spring(
      this.state.bounceValue,
      {
        toValue: toValue,
        velocity: 3,
        tension: 2,
        friction: 8,
      }
    ).start();

    isHidden = !isHidden;
  }

  render() {
    return (
      <View style={stylez.container}>
          <TouchableHighlight style={stylez.button} onPress={()=> {this._toggleSubview()}}>
            <Text style={stylez.buttonText}>{this.state.buttonText}</Text>
          </TouchableHighlight>
          <Animated.View
            style={[stylez.subView,
              {transform: [{translateY: this.state.bounceValue}]}]}
          >
            <Text>This is a sub view</Text>
          </Animated.View>
                           <Button style={stylez.loginButton}
            onPress={() => {
            }}>
              <Text> DONE </Text>
            </Button>
      </View>
    );
  }
}



var stylez = stylezheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop: 66
  },
  button: {
    padding: 8,
  },
  loginButton: {
   position:'absolute',
   bottom: 0,
   height:40,
   backgroundColor:'blue',
   justifyContent:'center',
   width: 40
 },
  buttonText: {
    fontSize: 17,
    color: "#007AFF"
  },
  subView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    height: 100,
  }
});

export default AppContainer
