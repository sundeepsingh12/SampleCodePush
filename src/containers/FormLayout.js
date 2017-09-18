'use strict'
import React, {Component} from 'react'
import
{
  StyleSheet,
  View,
  Text,
  Platform
}
from 'react-native'
import { Container, Content,Footer, Thumbnail, FooterTab,Input, Card, CardItem, Button, Body, Header, Left, Right, Icon} from 'native-base';
import styles from '../themes/FeStyle'
import theme from '../themes/feTheme'
import imageFile from '../../images/fareye-logo.png'

class FormLayout extends Component {

  render () {
    return (
      <Container style={StyleSheet.flatten([theme.mainBg])}>
        <Header style={StyleSheet.flatten([theme.bgPrimary])}>
          <Left>
            <Button transparent>
              <Icon name='arrow-back' style={StyleSheet.flatten([styles.fontXl, styles.fontWhite])}/>
            </Button>
          </Left>
          <Body>
            <Text style={StyleSheet.flatten([styles.fontWhite])}>Status Name</Text>
          </Body>
          <Right>
            
          </Right>
        </Header>
        <Content style={StyleSheet.flatten([styles.padding5])}>
          <Card>
            <CardItem>
              <Body style={StyleSheet.flatten([styles.padding0])}>
                <View style={StyleSheet.flatten([styles.width100, styles.row, styles.justifySpaceBetween])} >
                  <View style={StyleSheet.flatten([{flexBasis: '12%', paddingTop: 2}])}>
                    <Icon name='md-create' style={StyleSheet.flatten([styles.fontXxl, theme.textPrimary, {marginTop: -5}])}/>
                  </View>
                  <View style={StyleSheet.flatten([styles.marginRightAuto, {flexBasis: '88%'}])}>
                    <View  style={StyleSheet.flatten([styles.row])}>
                        <View style={StyleSheet.flatten([{flexBasis: '80%'}])}>
                            <Text style={StyleSheet.flatten([styles.fontSm, styles.bold])}>
                                Label
                            </Text>
                            <Text style={StyleSheet.flatten([styles.fontXs, styles.marginTop5, {color: '#999999'}])}>
                                Sub Label
                            </Text>
                        </View>

                        <View style={StyleSheet.flatten([styles.row, styles.justifySpaceBetween, {flexBasis: '20%'}])}>
                            <Icon name='ios-checkmark' style={StyleSheet.flatten([styles.fontXxxl, styles.fontSuccess, {marginTop: -5}])}/>
                            <Icon name='ios-help-circle-outline' style={StyleSheet.flatten([styles.fontXl])}/>
                        </View>
                    </View>
                    <View>
                        <Input placeholder='Regular Textbox' style={StyleSheet.flatten([styles.marginTop10, styles.fontSm, {borderWidth: 1, height: 30, borderColor: '#BDBDBD', borderRadius: 4}])} />
                    </View>
                  </View>
                </View>
              </Body>
            </CardItem>
         </Card>
         <Card>
            <CardItem>
              <Body style={StyleSheet.flatten([styles.padding0])}>
                <View style={StyleSheet.flatten([styles.width100, styles.row, styles.justifySpaceBetween])} >
                  <View style={StyleSheet.flatten([{flexBasis: '12%', paddingTop: 2}])}>
                    <Icon name='ios-camera-outline' style={StyleSheet.flatten([styles.fontXxl, theme.textPrimary, {marginTop: -5}])}/>
                  </View>
                  <View style={StyleSheet.flatten([styles.marginRightAuto, {flexBasis: '88%'}])}>
                    <View  style={StyleSheet.flatten([styles.row])}>
                        <View style={StyleSheet.flatten([{flexBasis: '80%'}])}>
                            <Text style={StyleSheet.flatten([styles.fontSm, styles.bold])}>
                                Image
                            </Text>
                            <Text style={StyleSheet.flatten([styles.fontXs, styles.marginTop5, {color: '#999999'}])}>
                                Take Picture
                            </Text>
                        </View>

                        <View style={StyleSheet.flatten([styles.row, styles.justifySpaceBetween, {flexBasis: '20%'}])}>
                            <Icon name='ios-checkmark' style={StyleSheet.flatten([styles.fontXxxl, styles.fontSuccess, {marginTop: -5}])}/>
                            <Icon name='ios-help-circle-outline' style={StyleSheet.flatten([styles.fontXl])}/>
                        </View>
                    </View>
                    <View>
                        <View style={StyleSheet.flatten([styles.marginTop10, styles.row, styles.justifyStart, styles.alignCenter])}>
                            <Icon name='ios-image-outline' style={StyleSheet.flatten([styles.fontXl, styles.fontDarkGray, styles.marginRight5])}/>
                            <Text style={StyleSheet.flatten([styles.fontSm, styles.fontDarkGray])}>No Picture</Text>
                        </View>
                    </View>
                  </View>
                </View> 
              </Body>
            </CardItem>
         </Card>
         
         <Card style={StyleSheet.flatten([{backgroundColor: '#EFFEEC'}])}>
            <CardItem style={StyleSheet.flatten([{backgroundColor: '#EFFEEC', borderWidth: .5, borderColor: '#00B22A'}])}>
              <Body style={StyleSheet.flatten([styles.padding0])}>
                <View style={StyleSheet.flatten([styles.width100, styles.row, styles.justifySpaceBetween])} >
                  <View style={StyleSheet.flatten([{flexBasis: '12%', paddingTop: 2}])}>
                    <Icon name='ios-create-outline' style={StyleSheet.flatten([styles.fontXxl, theme.textPrimary, {marginTop: -5}])}/>
                  </View>
                  <View style={StyleSheet.flatten([styles.marginRightAuto, {flexBasis: '88%'}])}>
                    <View  style={StyleSheet.flatten([styles.row])}>
                        <View style={StyleSheet.flatten([{flexBasis: '80%'}])}>
                            <Text style={StyleSheet.flatten([styles.fontSm, styles.bold])}>
                                Customer Signature
                            </Text>
                            <Text style={StyleSheet.flatten([styles.fontXs, styles.marginTop5, {color: '#999999'}])}>
                                Sign
                            </Text>
                        </View>

                        <View style={StyleSheet.flatten([styles.row, styles.justifySpaceBetween, {flexBasis: '20%'}])}>
                            <Icon name='ios-checkmark' style={StyleSheet.flatten([styles.fontXxxl, styles.fontSuccess, {marginTop: -5}])}/>
                            <Icon name='ios-help-circle-outline' style={StyleSheet.flatten([styles.fontXl])}/>
                        </View>
                    </View>
                    <View>
                        <View style={StyleSheet.flatten([styles.marginTop10, styles.row, styles.justifyStart, styles.alignCenter])}>
                            <Thumbnail style={StyleSheet.flatten([styles.bgDanger])} square source={{uri: 'http://www.apdconsumo.pt/person.png'}} />
                        </View>
                    </View>
                  </View>
                </View>
              </Body>
            </CardItem>
         </Card>
        </Content>
       
        <Button full success>
            <Text style={{color: 'white'}}>Success</Text>
        </Button>
      </Container>
    )
  }
};

export default FormLayout
