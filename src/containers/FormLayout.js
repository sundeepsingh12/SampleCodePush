'use strict'
import React, {Component} from 'react'
import 
{
  StyleSheet,
  View,
  Text,
  Platform,
  FlatList
}
from 'react-native'
import { Container, Content,Footer, Thumbnail, FooterTab,Input, Card, CardItem, Button, Body, Header, Left, Right, Icon} from 'native-base';
import styles from '../themes/FeStyle'
import theme from '../themes/feTheme'
import imageFile from '../../images/fareye-logo.png'
import * as formLayoutActions from '../modules/form-layout/formLayoutActions.js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import BasicFormElement from '../components/FormLayoutBasicComponent.js'
import renderIf from '../lib/renderIf.js'


function mapStateToProps(state){
  return{
    formElement : state.formLayout.formElement,
    nextEditable : state.formLayout.nextEditable,
    isSaveDisabled : state.formLayout.isSaveDisabled,
    statusName : state.formLayout.statusName,
    jobTransactionId : state.formLayout.jobTransactionId,
    statusId : state.formLayout.statusId,
    latestPositionId :state.formLayout.latestPositionId
  }
}

function mapDispatchToProps(dispatch){
  return {
    actions : bindActionCreators({ ...formLayoutActions}, dispatch)
  }
}
class FormLayout extends Component {

  componentWillMount() {
    console.log('inside component will mount with statusId', this.props.statusId);
    this.props.actions.getSortedRootFieldAttributes(this.props.navigation.state.params.statusId,this.props.navigation.state.params.statusName,this.props.navigation.state.params.jobTransactionId);  
}

renderData = (item) => {
  console.log('formlayout container item',item);
  console.log('form layout container state', this.props.nextEditable);
  console.log('isSaveDisabled',this.props.isSaveDisabled);
  return (
    <BasicFormElement item={item} nextEditable = {this.props.nextEditable} formElement = {this.props.formElement} isSaveDisabled = {this.props.isSaveDisabled} jobTransactionId = {this.props.jobTransactionId} latestPositionId = {this.props.latestPositionId}/>
  )
}

saveJobTransaction(){
  this.props.actions.saveJobTransaction(this.props.formElement,this.props.jobTransactionId,this.props.statusId);
}

_keyExtractor = (item,index) => item[1].key;

  render () {
    console.log('render of form', this.props);
    return (
      <Container style={StyleSheet.flatten([theme.mainBg])}>
        <Header style={StyleSheet.flatten([theme.bgPrimary])}>
          <Left>
            <Button transparent onPress={() => { this.props.navigation.goBack(null) }}>
              <Icon name='arrow-back' style={StyleSheet.flatten([styles.fontXl, styles.fontWhite])}/>
            </Button> 
          </Left>
          <Body>
            <Text style={StyleSheet.flatten([styles.fontWhite])}>{this.props.statusName}</Text>
          </Body>
          <Right>
            
          </Right>
        </Header>
        <Content style={StyleSheet.flatten([styles.padding5])}>
          <FlatList
                data = {Array.from(this.props.formElement)}
                extraData={this.state}
                renderItem={(item) => this.renderData(item.item[1])} //TODO add comments for item[1] 
                keyExtractor={this._keyExtractor}>
          </FlatList>
        </Content>
       
        <Button full success 
          disabled={this.props.isSaveDisabled} onPress = {() => this.saveJobTransaction(this.props.formElement,this.props.jobTransactionId,this.props.statusId)}>
          <Text style={{color: 'white'}}>{this.props.statusName}</Text>
        </Button>
        
      </Container>
    )
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(FormLayout)

//TODO
//3) Spinner
//5) Test with non required
  //7) Parent, positionId and latest positionID
//8) Add comments for every methods
//9) Remove todos and logs
//10) End to end testing
//11) Commit ans push changes