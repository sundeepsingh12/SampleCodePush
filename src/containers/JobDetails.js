'use strict'
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Platform,
  FlatList,
  TouchableOpacity
}
  from 'react-native'
import { Container, Content, Footer, FooterTab, Card, CardItem, Button, Body, Header, Left, Right, Icon,List,ListItem } from 'native-base';
import styles from '../themes/FeStyle'
import theme from '../themes/feTheme'
import { Actions } from 'react-native-router-flux'
import renderIf from '../lib/renderIf';

class JobDetails extends Component {

  constructor() {
    super();
    this.state = {
      active: false,
      parentActive : false,
      childActive: false,
      childActive2:false,
    };
  }

  // componentDidMount() {

  // }

  renderData = (item) => {
    return (
      <View style={StyleSheet.flatten([styles.row, styles.padding10, styles.bgWhite, { borderTopWidth: .5, borderColor: '#C5C5C5' }])}>
        <View style={StyleSheet.flatten([styles.row, styles.justifyStart, styles.alignCenter, { flex: .5 }])}>
          <Text style={StyleSheet.flatten([styles.bold, styles.fontSm])}>
            Child List
          </Text>
        </View>
        <View style={StyleSheet.flatten([styles.row, styles.justifyStart, styles.alignCenter, { flex: .5 }])}>
          <Text style={StyleSheet.flatten([styles.fontSm])}>
            Child String Content
          </Text>
        </View>
      </View>
    )
  }

  renderList() {
    let list = []
    for (var i = 0; i < 100; i++) {
      let obj = {
        id: i,
        name: 'xyz'
      }
      list.push(obj)
    }
    console.log(list)
    return list
  }

  render() {
    return (
      <Container style={StyleSheet.flatten([theme.mainBg])}>
        <Header style={StyleSheet.flatten([theme.bgPrimary])}>
          <Left style={StyleSheet.flatten([styles.flexBasis15])}>
            <Button transparent onPress={() => { Actions.pop() }}>
              <Icon name='arrow-back' style={StyleSheet.flatten([styles.fontXl, styles.fontWhite])} />
            </Button>
          </Left>
          <Body style={StyleSheet.flatten([styles.alignCenter, styles.flexBasis70])}>
            <Text style={StyleSheet.flatten([styles.fontSm, styles.fontWhite, styles.fontCenter])}>Ref12345676565</Text>
            <Text style={StyleSheet.flatten([styles.fontSm, styles.fontWhite, styles.bold, styles.fontYellow, styles.fontCenter])}>Pending</Text>
          </Body>
          <Right style={StyleSheet.flatten([styles.flexBasis15])}>

          </Right>
        </Header>
        <Content style={StyleSheet.flatten([styles.padding5])}  scrollEnabled={!this.state.parentActive}>
          <Card>
            <CardItem button onPress={() => { this.setState({ active: !this.state.active }) }}>
              <Body style={StyleSheet.flatten([styles.padding10])}>
                <View style={StyleSheet.flatten([styles.width100, styles.row, styles.justifySpaceBetween])} >
                  <View style={StyleSheet.flatten([styles.marginRight15])}>
                    <Icon name='ios-list-outline' style={StyleSheet.flatten([styles.fontXl, theme.textPrimary])} />
                  </View>
                  <Text style={StyleSheet.flatten([styles.marginRightAuto, styles.fontLg])}>
                    Job Details
                  </Text>
                  <View>
                    <Icon name={this.state.active ? 'ios-arrow-up-outline' : 'ios-arrow-down-outline'} style={StyleSheet.flatten([styles.fontXl, theme.textPrimary, styles.justifyEnd])} />
                  </View>
                </View>
              </Body>
            </CardItem>


            {/*Job detail list*/}
            {renderIf(this.state.active,
              <CardItem cardBody>
                <View style={StyleSheet.flatten([styles.flex1, styles.column])} >
                  {/*This is parent list item*/}
                  <View style={StyleSheet.flatten([styles.column, { backgroundColor: '#F2F2F2' }])}>

                    <TouchableOpacity style={StyleSheet.flatten([styles.row, styles.padding10, { borderTopWidth: .5, borderColor: '#C5C5C5' }])} onPress={() => { this.setState({ childActive: !this.state.childActive,parentActive:!this.state.childActive }) }}>
                      <View style={StyleSheet.flatten([styles.row, styles.justifyStart, styles.alignCenter, { flex: .5 }])}>
                        <Text style={StyleSheet.flatten([styles.bold, styles.fontSm])} >
                          Parent List
                      </Text>
                      </View>
                      <View style={StyleSheet.flatten([styles.row, styles.justifySpaceBetween, styles.alignCenter, { flex: .5 }])}>
                        <Text style={StyleSheet.flatten([styles.fontSm])}>
                          String Content
                      </Text>
                        <Text>
                          <Icon name='md-arrow-dropdown' style={StyleSheet.flatten([styles.alignSelfEnd, styles.fontBlack, styles.fontXl])} />
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/*This is child list items*/}
                    {renderIf(this.state.childActive,
                      <Content style={StyleSheet.flatten([{flex:1 ,height: 100}])}>
                        <List>
                          <FlatList
                            data={this.renderList()}
                            renderItem={({ item }) => this.renderData(item)}
                            keyExtractor={item => item.id}
                          />
                        </List>
                      </Content>)}
                    {/*End child list items*/}

                  </View>

                  {/*This is parent list item*/}
                  <TouchableOpacity style={StyleSheet.flatten([styles.column, { backgroundColor: '#F2F2F2' }])} onPress={() => { this.setState({ childActive2: !this.state.childActive2,parentActive:!this.state.childActive2 }) }}>
                    <View style={StyleSheet.flatten([styles.row, styles.padding10, { borderTopWidth: .5, borderColor: '#C5C5C5' }])}>
                      <View style={StyleSheet.flatten([styles.row, styles.justifyStart, styles.alignCenter, { flex: .5 }])}>
                        <Text style={StyleSheet.flatten([styles.bold, styles.fontSm])}>
                          Parent List
                      </Text>
                      </View>
                      <View style={StyleSheet.flatten([styles.row, styles.justifySpaceBetween, styles.alignCenter, { flex: .5 }])}>
                        <Text style={StyleSheet.flatten([styles.fontSm])}>
                          String Content
                      </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {renderIf(this.state.childActive2,
                      <Content style={StyleSheet.flatten([{flex:1 ,height: 100}])}>
                        <List>
                          <FlatList
                            data={this.renderList()}
                            renderItem={({ item }) => this.renderData(item)}
                            keyExtractor={item => item.id}
                          />
                        </List>
                      </Content>)}

                  {/*This is parent list item*/}
                  <View style={StyleSheet.flatten([styles.column, { backgroundColor: '#F2F2F2' }])}>
                    <View style={StyleSheet.flatten([styles.row, styles.padding10, { borderTopWidth: .5, borderColor: '#C5C5C5' }])}>
                      <View style={StyleSheet.flatten([styles.row, styles.justifyStart, styles.alignCenter, { flex: .5 }])}>
                        <Text style={StyleSheet.flatten([styles.bold, styles.fontSm])}>
                          Parent List
                      </Text>
                      </View>
                      <View style={StyleSheet.flatten([styles.row, styles.justifySpaceBetween, styles.alignCenter, { flex: .5 }])}>
                        <Text style={StyleSheet.flatten([styles.fontSm])}>
                          String Content
                      </Text>
                      </View>
                    </View>
                  </View>


                </View>
              </CardItem>
            )}
            {/*End job detail list*/}
          </Card>
          <Card>
            <CardItem>
              <Body style={StyleSheet.flatten([styles.padding10])}>
                <View style={StyleSheet.flatten([styles.width100, styles.row, styles.justifySpaceBetween])}>
                  <View style={StyleSheet.flatten([styles.marginRight15])}>
                    <Icon name='ios-list-box-outline' style={StyleSheet.flatten([styles.fontXl, theme.textPrimary])} />
                  </View>
                  <Text style={StyleSheet.flatten([styles.marginRightAuto, styles.fontLg])}>
                    Field Details
                  </Text>
                  <View>
                    <Icon name='ios-arrow-down-outline' style={StyleSheet.flatten([styles.fontXl, theme.textPrimary, styles.justifyEnd])} />
                  </View>
                </View>
              </Body>
            </CardItem>
          </Card>
          <Card>
            <CardItem>
              <Body style={StyleSheet.flatten([styles.padding10])}>
                <View style={StyleSheet.flatten([styles.width100, styles.row, styles.justifySpaceBetween])}>
                  <View style={StyleSheet.flatten([styles.marginRight15])}>
                    <Icon name='ios-mail-outline' style={StyleSheet.flatten([styles.fontXl, theme.textPrimary])} />
                  </View>
                  <View style={StyleSheet.flatten([styles.marginRightAuto, styles.column])}>
                    <View style={StyleSheet.flatten([styles.row, styles.alignStart, styles.justifySpaceBetween])}>
                      <Text style={StyleSheet.flatten([styles.fontXs, { color: '#ababab' }])}>Messages</Text>
                      <Text style={StyleSheet.flatten([styles.fontXs, styles.bold, theme.textPrimary])}>View</Text>
                    </View>
                    <Text style={StyleSheet.flatten([styles.fontSm, styles.marginTop5])}>Lorem Ipsum is simply dummy text of the printing and typesetting…</Text>
                    <Text style={StyleSheet.flatten([styles.fontXs, styles.marginTop5, theme.textPrimary])}>3 New Messages</Text>
                  </View>
                </View>
              </Body>
            </CardItem>
          </Card>
        </Content>
        <View style={StyleSheet.flatten([styles.column, { padding: 3, backgroundColor: '#FF0000' }])}>
          <Text style={StyleSheet.flatten([styles.bold, styles.fontCenter, styles.fontSm, styles.fontWhite])}>
            2hr 3min 34s Left
          </Text>
        </View>
        <View style={StyleSheet.flatten([styles.column, styles.bgWhite, styles.padding5, { borderTopWidth: 1, borderTopColor: '#d3d3d3' }])}>
          <View style={StyleSheet.flatten([styles.row, styles.flexWrap, styles.justifyCenter, styles.alignCenter])}>
            <Button small primary style={{ margin: 2 }}>
              <Text style={{ color: 'white' }}>Success</Text>
            </Button>
            <Button small primary style={{ margin: 2 }}>
              <Text style={{ color: 'white' }}>Fail</Text>
            </Button>
            <Button small primary style={{ margin: 2 }}>
              <Text style={{ color: 'white' }}>Pickup</Text>
            </Button>
            <Button small primary style={{ margin: 2 }}>
              <Text style={{ color: 'white' }}>Status</Text>
            </Button>
          </View>
        </View>
        <Footer>
          <FooterTab>
            <Button>
              <Icon name="ios-chatbubbles-outline" />
            </Button>
            <Button>
              <Icon name="ios-call-outline" />
            </Button>
            <Button active>
              <Icon active name="ios-navigate-outline" />
            </Button>
            <Button>
              <Icon name="ios-help-circle-outline" />
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
};

export default JobDetails
