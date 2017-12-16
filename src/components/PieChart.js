'use strict'

import React, { Component } from 'react'

import {
    StyleSheet,
    View,
    Text,
    Platform,
    SegmentedControlIOS,
    TouchableHighlight
}
    from 'react-native'
import { Icon} from 'native-base'
import styles from '../themes/FeStyle'
import LinearGradient from 'react-native-linear-gradient'
import CircularProgress from '../svg_components/components/CircularProgress'

export default class PieChart extends Component {
    
    render() {
        const completedCount = this.props.count.successCounts + this.props.count.failCounts
        const total = completedCount + this.props.count.pendingCounts
        const percentage = (total != 0) ?  Math.round(Number(((completedCount)*100)/total)) : 0
        return (
          <TouchableHighlight onPress={() => this.props.press()} underlayColor={"#ffffff90"}> 
            <LinearGradient 
              colors={[styles.bgPrimary.backgroundColor, styles.shadeColor]}
              style={style.chartBlock}>
              <View style={[styles.justifyCenter, styles.paddingTop15, styles.paddingBottom15]}>
                <CircularProgress percentage={percentage} style={[{backgroundColor: '#green'}]}>
                    <View style={[styles.justifyCenter, styles.alignCenter]}>
                      <Text style={{fontSize: 40, color: '#ffffff', fontWeight: '500'}}>{this.props.count.pendingCounts}</Text>
                      <Text style={{fontSize: 18, color: '#ffffff'}}>pending</Text>
                    </View>
                </CircularProgress>
              </View>
              <View style={[styles.row, styles.justifySpaceAround]}>
                <View>
                  <Text
                    style={[styles.fontWhite, styles.fontXl, styles.bold, styles.fontCenter]}>{total}</Text>
                  <Text
                    style={[styles.fontWhite, styles.fontSm, styles.fontCenter]}>total</Text>
                </View>
                <View>
                  <Text
                    style={[styles.fontWhite, styles.fontXl, styles.bold, styles.fontCenter]}>{completedCount}</Text>
                  <Text
                    style={[styles.fontWhite, styles.fontSm, styles.fontCenter]}>done</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableHighlight>
          )
    }
}

const style = StyleSheet.create({
chartBlock: {
    margin: 10,
    height: 240,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.3,
    shadowRadius: 2
  }
})