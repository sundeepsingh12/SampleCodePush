'use strict';
import React, { Component } from 'react'
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
import {  CheckBox,Picker } from 'native-base'
import renderIf from '../lib/renderIf'
import _ from 'lodash'

const Item = Picker.Item

  
 export default class SkuListItem extends Component {

    checkSkuItemQuantity(rowItem,originalQuantityValue){
        let quantitySelector
        if (originalQuantityValue <= 1) {
            quantitySelector = <CheckBox checked={rowItem.value!=0} onPress={()=>this.changeQuantityForCheckBox(rowItem.parentId,rowItem.value)} />
        }
        else if (originalQuantityValue > 1 && originalQuantityValue <= 1000) {
            
            quantitySelector = <Picker style={StyleSheet.flatten([{ width: '100%' }])}
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
          <View key={rowItem.autoIncrementId} style={StyleSheet.flatten([styles.column, { backgroundColor: '#F2F2F2' }])}>

               {!isSkuActualQuantity  ?   <View style={StyleSheet.flatten([styles.row, styles.padding5,styles.justifyStart])}>
                    <View style={StyleSheet.flatten([styles.row, styles.justifyStart, styles.alignCenter, { flex: .5 }])}>
                        <Text style={StyleSheet.flatten([styles.bold, styles.fontLg])} >
                            {rowItem.label}
                          </Text>
                    </View>
                     <View style={StyleSheet.flatten([styles.row, styles.justifySpaceBetween, styles.alignCenter, { flex: .5 }])}>
                        <Text style={StyleSheet.flatten([styles.fontSm])}>
                            {rowItem.value}
                        </Text>
                    </View>

                  </View> :  
                  <View style={StyleSheet.flatten([])}>
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
              <View >
                    {this.props.item.map(object=> this.renderListRow(object,originalQuantityValue))} 
                    </View>
        )
    }
}

