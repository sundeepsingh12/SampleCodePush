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
import Loader from '../components/Loader'

function mapStateToProps(state){
  return{
    formElement : state.formLayout.formElement,
    nextEditable : state.formLayout.nextEditable,
    isSaveDisabled : state.formLayout.isSaveDisabled,
    statusName : state.formLayout.statusName,
    jobTransactionId : state.formLayout.jobTransactionId,
    statusId : state.formLayout.statusId,
    isLoading : state.formLayout.isLoading
  }
}

function mapDispatchToProps(dispatch){
  return {
    actions : bindActionCreators({ ...formLayoutActions}, dispatch)
  }
}
class FormLayout extends Component {

  componentWillMount() {
      this.props.actions.getSortedRootFieldAttributes(this.props.navigation.state.params.statusId,this.props.navigation.state.params.statusName,this.props.navigation.state.params.jobTransactionId);  
}

renderData = (item) => {
  return (
    <BasicFormElement item={item} nextEditable = {this.props.nextEditable} formElement = {this.props.formElement} isSaveDisabled = {this.props.isSaveDisabled}/>
  )
}

saveJobTransaction(){
  this.props.actions.saveJobTransaction(this.props.formElement,this.props.jobTransactionId,this.props.statusId);
}

_keyExtractor = (item,index) => item[1].key;

  render () {
    if(this.props.isLoading){ return <Loader/>}
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