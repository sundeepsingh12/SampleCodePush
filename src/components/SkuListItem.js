'use strict';
import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text
} from 'react-native'
import styles from '../themes/FeStyle'
import {
    SKU_ORIGINAL_QUANTITY,
    SKU_ACTUAL_QUANTITY
} from '../lib/AttributeConstants'
import {  CheckBox,Picker,Content } from 'native-base'
import _ from 'lodash'

const Item = Picker.Item;

  
 export default class SkuListItem extends PureComponent {

    checkSkuItemQuantity(rowItem,originalQuantityValue){
        let quantitySelector
        if (originalQuantityValue <= 1) {
            quantitySelector = <CheckBox  style={[style.cardCheckbox]} checked={rowItem.value!=0} onPress={()=>this.changeQuantityForCheckBox(rowItem.parentId,rowItem.value)} />
        }
        else if (originalQuantityValue > 1 && originalQuantityValue <= 1000) {
            
            quantitySelector = <Picker
                mode="dropdown"  
                selectedValue={rowItem.value}
                onValueChange={(value)=>this.changeSkuActualQuantity(value,rowItem.parentId)} >
                {this._populateItems(originalQuantityValue)}
            </Picker>
        }   
        return (
            <View>
             {quantitySelector}
            </View>
        )
    }

    changeSkuActualQuantity(selectedValue,parentId){
        //Call parent component using callback
        this.props.updateSkuActualQuantity(selectedValue,parentId)
    }

    changeQuantityForCheckBox(parentId,selectedValue){
        const newValue = (selectedValue==0)?1:0
        this.props.updateSkuActualQuantity(newValue,parentId)
    }

    _populateItems(value){
         return _.range(++value).map(number => {
             return <Item  label={number+""} value={number+''} key={number+""}/>
        }); 
    }
    
    renderListRow(rowItem,originalQuantityValue){
       
        const isSkuActualQuantity = (rowItem.attributeTypeId==SKU_ACTUAL_QUANTITY)

        if(rowItem.attributeTypeId!=SKU_ORIGINAL_QUANTITY){
         return(
          <View key={rowItem.autoIncrementId} style={[style.card, styles.row]}>

               {!isSkuActualQuantity  ?   <View style={[style.cardLeft]}>
                    <View style={[style.cardLeftTopRow]}>
                        <Text style={[styles.flexBasis40, styles.fontSm, styles.paddingTop10, styles.paddingBottom10, styles.paddingRight10]} >
                            {rowItem.label}
                          </Text>
                          <Text style={[styles.flexBasis60, styles.fontDefault, styles.padding10]}>
                            {rowItem.value}
                        </Text>
                    </View>
                  </View> :  
                  <View>
                  {this.checkSkuItemQuantity(rowItem,originalQuantityValue)}
                  </View>
                } 
            </View>
        )
    }
}
    render(){
      const originalQuantityValue = this.props.item.filter(object=>object.attributeTypeId==SKU_ORIGINAL_QUANTITY).map(item=>item.value)
        return (

          <Content style={[styles.flex1, styles.padding10, styles.bgLightGray]}>
              <View style={[style.card]}>
                    {this.props.item.map(object=> this.renderListRow(object,originalQuantityValue))} 
                    </View>
                    </Content>
        )
    }
}
const style = StyleSheet.create({
  header: {
    borderBottomWidth: 0,
    height: 'auto',
    paddingTop: 10,
    paddingBottom: 10
  },
  headerIcon: {
    width: 24
  },
  headerSearch: {
    paddingLeft: 10,
    paddingRight: 30,
    backgroundColor: '#1260be',
    borderRadius: 2,
    height: 30,
    color: '#fff',
    fontSize: 10
  },
  headerQRButton: {
    position: 'absolute',
    right: 5,
    paddingLeft: 0,
    paddingRight: 0
  },
  card: {
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowColor: '#d3d3d3',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  cardLeft: {
    flex: 0.85,
    borderRightColor: '#f3f3f3',
    borderRightWidth: 1
  },
  cardLeftTopRow: {
    flexDirection: 'row',
    borderBottomColor: '#f3f3f3',
    borderBottomWidth: 1
  },
  cardRight: {
    width: 40,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardCheckbox: {
    backgroundColor: 'green',
    borderRadius: 0,
  }

});

