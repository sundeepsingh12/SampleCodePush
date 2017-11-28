'use strict'
import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    TouchableHighlight,
} from 'react-native'
import { Container, Card, CardItem, Body, Icon, Right } from 'native-base'
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf'
import SearchIcon from '../../src/svg_components/icons/SearchIcon'

class FormLayoutActivityComponent extends Component {

    render() {
        return (
            <TouchableHighlight disabled = {!this.props.item.editable} onPress={() => this.props.press(this.props.item)}>
            <View style={style.formCard}>
                <View style={style.iconContainer}>
                    <SearchIcon />
                </View>
                <View style={style.formCardDetail}>
                    <View>
                        <Text style={[styles.fontDefault, styles.lineHeight25, styles.fontPrimary]}>
                            {this.props.item.label}
                        </Text>
                        <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20]}>
                            {this.props.item.subLabel}
                        </Text>
                    </View>
                    <View style={[styles.row]}>
                        <View style={[styles.marginRight5]}>
                            <Icon name="ios-checkmark-circle" style={[styles.fontXl, styles.fontSuccess, styles.fontXxl]} />
                        </View>
                        <View>
                            <Icon name="ios-help-circle" style={[styles.fontXl, styles.fontLightGray, styles.fontXxl]} />
                        </View>
                    </View>
                </View>
            </View>
            </TouchableHighlight>
            // <Card>
            //     <CardItem style={this.props.item.focus ? { backgroundColor: 'blue' } : null} button={this.props.item.editable} onPress={() => this.props.press(this.props.item)}>
            //         <Body style={StyleSheet.flatten([styles.padding0])}>
            //             <View style={StyleSheet.flatten([styles.width100, styles.row, styles.justifySpaceBetween])} >
            //                 <View style={StyleSheet.flatten([{ flexBasis: '12%', paddingTop: 2 }])}>
            //                     <Icon name='md-create' style={StyleSheet.flatten([styles.fontXxl, styles.fontPrimary, { marginTop: -5 }])} />
            //                 </View>
            //                 <View style={StyleSheet.flatten([styles.marginRightAuto, { flexBasis: '88%' }])}>
            //                     <View style={StyleSheet.flatten([styles.row])}>
            //                         <View style={StyleSheet.flatten([{ flexBasis: '80%' }])}>
            //                             <Text style={StyleSheet.flatten([styles.fontSm, styles.bold])}>
            //                                 {this.props.item.label}
            //                             </Text>
            //                             <Text style={StyleSheet.flatten([styles.fontXs, styles.marginTop5, { color: '#999999' }])}>
            //                                 {this.props.item.subLabel}
            //                             </Text>
            //                         </View>
            //                     </View>

            //                     <Text style={StyleSheet.flatten([styles.fontXs, styles.marginTop5, { color: '#999999' }])}>
            //                         {this.props.item.helpText}
            //                     </Text>
            //                 </View>
            //             </View>
            //         </Body>
            //         <Right>{renderIf(this.props.item.showCheckMark,
            //             <Icon name='ios-checkmark' style={StyleSheet.flatten([styles.fontXxxl, styles.fontSuccess, { marginTop: -5 }])} />
            //         )}</Right>
            //     </CardItem>
            // </Card>
        )
    }
}

const style = StyleSheet.create({
    //  styles.column, styles.paddingLeft0, styles.paddingRight0, {height: 'auto'}
    header: {
      borderBottomWidth: 0,
      height: 'auto',
      padding: 0,
      paddingRight: 0,
      paddingLeft: 0
    },
    headerLeft: {
      width: '15%',
      padding: 15
    },
    headerBody: {
      width: '70%',
      paddingTop: 15,
      paddingBottom: 15,
      paddingLeft: 10,
      paddingRight: 10
    },
    headerRight: {
      width: '15%',
      padding: 15
    },
    dropDown: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
      paddingTop: 10,
      paddingBottom: 10,
      borderBottomWidth: 1, 
      borderBottomColor: '#d3d3d3'
    },
    listIcon: {
      width: 50,
      height: 50,
      backgroundColor: 'green',
      borderRadius: 3,
    },
    formCard: {
      minHeight: 70,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 10,
      backgroundColor: '#ffffff'
    },
    iconContainer: {
      width: 40,
      height: 50,
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    formCardDetail: {
      flex: 1,
      minHeight: 70,
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 10,
      marginLeft: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomColor: '#d3d3d3',
      borderBottomWidth: 1
    },
    footer: {
      height: 'auto',
      borderTopWidth: 1,
      borderTopColor: '#f3f3f3'
    },
  
  });

export default FormLayoutActivityComponent