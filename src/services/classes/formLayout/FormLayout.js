import {keyValueDBService} from '../KeyValueDBService.js'

class FormLayout {

    /**
     * This will accept statusId to be captured
     * and returns sequence wise sorted formLayout attributes
     * mapped to this statusId
     * @param {*id of status to be captured} statusId 
     */



     //TODO add positionId and parentId in dto and set latestPositionId in state
     //parentId is 0, positionId is incremental and latest positionId is the last element 
     //in the sorted list
    async getSequenceWiseRootFieldAttributes(statusId){
        if(!statusId){
            console.log('missing statusId to be captured');
            throw new Error('Missing statusId');
        }
        const fieldAttributes = await keyValueDBService.getValueFromStore('FIELD_ATTRIBUTE');
        const fieldAttributeStatusList = await keyValueDBService.getValueFromStore('FIELD_ATTRIBUTE_STATUS');
        const fieldAttributeMasterValidation = await keyValueDBService.getValueFromStore('FIELD_ATTRIBUTE_VALIDATION');
        const fieldAttributeValidationCondition = await keyValueDBService.getValueFromStore('FIELD_ATTRIBUTE_VALIDATION_CONDITION');

        if(!fieldAttributes || !fieldAttributes.value || !fieldAttributeStatusList || !fieldAttributeStatusList.value){
            throw new Error('Value of fieldAttributes or fieldAttribute Status missing')
        }
        let filedAttributesMappedToStatus = fieldAttributeStatusList.value.filter(fieldAttributeStatus => fieldAttributeStatus.statusId == statusId).sort((a,b) => a.sequence - b.sequence).map(fieldAttributeStatus => fieldAttributeStatus.fieldAttributeId);
        if(!filedAttributesMappedToStatus){
            throw new Error('No field attribute mapped to this status');
        }
        let fieldAttributeMap = {};
        let fieldAttributeValidationMap = {};
        for (const fieldAttribute of fieldAttributes.value) {
            if(!fieldAttributeMap[fieldAttribute.id] && !fieldAttribute.parentId){
                fieldAttributeMap[fieldAttribute.id] = [];
            }
            if(fieldAttributeMap[fieldAttribute.id]){
                fieldAttributeMap[fieldAttribute.id] = fieldAttribute;
            }
        }
        const sequenceWiseSortedFieldAttributesForStatus = filedAttributesMappedToStatus.map(fieldAttributeId => fieldAttributeMap[fieldAttributeId]).filter(fieldAttribute => fieldAttribute);
        const fieldAttributeMasterValidationMap = this.getFieldAttributeValidationMap(fieldAttributeMasterValidation);
        const fieldAttrMasterValidationConditionMap = this.getFieldAttributeValidationConditionMap(fieldAttributeValidationCondition,fieldAttributeMasterValidationMap);
        const sequenceWiseFormLayout = this.getFormLayoutSortedObject(sequenceWiseSortedFieldAttributesForStatus,fieldAttributeMasterValidationMap,fieldAttrMasterValidationConditionMap);
        return sequenceWiseFormLayout;
    }

    getFieldAttributeValidationMap(fieldAttributeMasterValidations){
        if(!fieldAttributeMasterValidations){
            return;
        }
        let fieldAttributeValidationMap = {};
        for(const fieldAttributeMasterValidation of fieldAttributeMasterValidations.value){
            if(!fieldAttributeMasterValidation || !fieldAttributeMasterValidation.fieldAttributeMasterId){
                continue;
            }
            let fieldAttributeId = fieldAttributeMasterValidation.fieldAttributeMasterId;
            if(!fieldAttributeValidationMap[fieldAttributeId]){
                fieldAttributeValidationMap[fieldAttributeId] = [];
            }
            fieldAttributeValidationMap[fieldAttributeId].push(fieldAttributeMasterValidation);
        }
        return fieldAttributeValidationMap;
    }

    getFieldAttributeValidationConditionMap(fieldAttributeValidationConditions, fieldAttributeMasterValidationMap){
        if(!fieldAttributeMasterValidationMap || !fieldAttributeValidationConditions || !fieldAttributeValidationConditions.value){
            return;
        }
        let fieldAttributeValidationConditionMap = {};
        for(const fieldAttributeValidationCondition of fieldAttributeValidationConditions.value){
            let validationMasterId = fieldAttributeValidationCondition.fieldAttributeMasterValidationId;
            if(!fieldAttributeValidationConditionMap[validationMasterId]){
                fieldAttributeValidationConditionMap[validationMasterId] = [];
            }
            fieldAttributeValidationConditionMap[validationMasterId].push(fieldAttributeValidationCondition);

        }
        return fieldAttributeValidationConditionMap;
    }
    
    getFormLayoutSortedObject(sequenceWiseSortedFieldAttributesForStatus, fieldAttributeMasterValidationMap, fieldAttrMasterValidationConditionMap){
        if(!sequenceWiseSortedFieldAttributesForStatus || sequenceWiseSortedFieldAttributesForStatus.length == 0){
            throw new Error('No field attribute mapped to this status');
        }
        let formLayoutObject = new Map();
        let nextEditable = {};
        let isRequiredAttributeFound = false;
        for(let i=0; i< sequenceWiseSortedFieldAttributesForStatus.length; i++){
            let fieldAttribute = sequenceWiseSortedFieldAttributesForStatus[i];
            if(!isRequiredAttributeFound){
                fieldAttribute.required ? (fieldAttribute.editable = true, fieldAttribute.focus = true, isRequiredAttributeFound = true) : fieldAttribute.editable = true;
            }
            let validationArr = fieldAttributeMasterValidationMap[fieldAttribute.id];
            if(validationArr && validationArr.length > 0 && fieldAttrMasterValidationConditionMap){
                for(var validation of validationArr){
                    validation.conditions = fieldAttrMasterValidationConditionMap[validation.id];
                }
            }
            // formLayoutArr.push(this.getFieldAttributeObject(fieldAttribute,validationArr));
            if(fieldAttribute.required){
                // find next editable and focusable elements of the required attribute
                this.getNextEditableAndFocusableElements(fieldAttribute.id,i,sequenceWiseSortedFieldAttributesForStatus,nextEditable);
            }
            formLayoutObject.set(fieldAttribute.id,this.getFieldAttributeObject(fieldAttribute,validationArr,i));
        }
        let latestPositionId = sequenceWiseSortedFieldAttributesForStatus.length-1;
        return {formLayoutObject,nextEditable,latestPositionId};
    }

    getNextEditableAndFocusableElements(attributeMasterId, currentSequence, formLayoutArr,nextEditable){
        if(!formLayoutArr || formLayoutArr.length == 0){
            return;
        }
        for(let i = 0; i< formLayoutArr.length ; i++){
            if(!nextEditable[attributeMasterId]){
                nextEditable[attributeMasterId] = [];
            }
            const fieldAttribute = formLayoutArr[i];
            if(i < currentSequence || (i == currentSequence && attributeMasterId == fieldAttribute.id)){
                continue; // if parent iteration is less than child iteration then continue
            }
            if(fieldAttribute.required){
                nextEditable[attributeMasterId].push('required$$'+fieldAttribute.id); //this is not necessary that required is always the last element in array, ex - if there are all non required. So instead of adding a new data structure, used a separator to know that this element is the required element
               break; // as soon as next required attribute is found then break the loop
            }
            nextEditable[attributeMasterId].push(fieldAttribute.id);
            
        }
    }

    getFieldAttributeObject(fieldAttribute, validationArray, positionId){
        const {label,subLabel,helpText,key,required,hidden,attributeTypeId} = fieldAttribute
        return {
            label,
            subLabel,
            helpText,
            key,
            required,
            hidden,
            attributeTypeId,
            fieldAttributeMasterId : fieldAttribute.id,
            positionId : positionId,
            parentId : 0,
            showHelpText : false,
            editable : fieldAttribute.editable ? fieldAttribute.editable : false,
            focus : fieldAttribute.focus ? fieldAttribute.focus : false,
            validation : (validationArray && validationArray.length > 0) ? validationArray : null
        };
    }

    
}

export let formLayoutService = new FormLayout()
