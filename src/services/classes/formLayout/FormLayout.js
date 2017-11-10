import {keyValueDBService} from '../KeyValueDBService.js'

class FormLayout {

    /**
     * It accepts statusId to be captured
     * and returns an object containing {formLayoutObject,nextEditable,latestPositionId}
     * mapped to this statusId
     * 
     * structure of formLayout,nextEditable and latestPositionId is as per the declaration in initial state of formLayout
     * 
     * @param {*} statusId id of status to be captured
     */
    async getSequenceWiseRootFieldAttributes(statusId){
        if(!statusId){
            throw new Error('Missing statusId');
        }
        const fieldAttributes = await keyValueDBService.getValueFromStore('FIELD_ATTRIBUTE');
        const fieldAttributeStatusList = await keyValueDBService.getValueFromStore('FIELD_ATTRIBUTE_STATUS');
        const fieldAttributeMasterValidation = await keyValueDBService.getValueFromStore('FIELD_ATTRIBUTE_VALIDATION');
        const fieldAttributeValidationCondition = await keyValueDBService.getValueFromStore('FIELD_ATTRIBUTE_VALIDATION_CONDITION');

        if(!fieldAttributes || !fieldAttributes.value || !fieldAttributeStatusList || !fieldAttributeStatusList.value){
            throw new Error('Value of fieldAttributes or fieldAttribute Status missing')
        }
        let filedAttributesMappedToStatus = fieldAttributeStatusList.value.filter(fieldAttributeStatus => fieldAttributeStatus.statusId == statusId) 
        .sort((a,b) => a.sequence - b.sequence)
        .map(fieldAttributeStatus => fieldAttributeStatus.fieldAttributeId); // first find list of fieldAttributeStatus mapped to a status using filter, then sort them on their sequence and then get list of fieldAttributeIds using map
       
        if(!filedAttributesMappedToStatus){
            throw new Error('No field attribute mapped to this status');
        }
        let fieldAttributeMap = {}; //map for root field attributes
        let fieldAttributeValidationMap = {};
        for (const fieldAttribute of fieldAttributes.value) {
            if(!fieldAttributeMap[fieldAttribute.id] && !fieldAttribute.parentId){
                fieldAttributeMap[fieldAttribute.id] = [];
            }
            if(fieldAttributeMap[fieldAttribute.id]){
                fieldAttributeMap[fieldAttribute.id] = fieldAttribute;
            }
        }
        const sequenceWiseSortedFieldAttributesForStatus = filedAttributesMappedToStatus.map(fieldAttributeId => fieldAttributeMap[fieldAttributeId]).filter(fieldAttribute => fieldAttribute); //getting fieldAttribute list
        const fieldAttributeMasterValidationMap = this.getFieldAttributeValidationMap(fieldAttributeMasterValidation);
        const fieldAttrMasterValidationConditionMap = this.getFieldAttributeValidationConditionMap(fieldAttributeValidationCondition,fieldAttributeMasterValidationMap);
        const sequenceWiseFormLayout = this.getFormLayoutSortedObject(sequenceWiseSortedFieldAttributesForStatus,fieldAttributeMasterValidationMap,fieldAttrMasterValidationConditionMap);
        return sequenceWiseFormLayout;
    }

    /**
     * accepts fieldAttributeMasterValidations and
     * returns map of fieldAttributeValidation (id wise fieldAttributeValidation)
     * @param {*} fieldAttributeMasterValidations array of fieldAttributeMasterValidations
     */
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

    /**
     * accepts fieldAttributeValidationConditions,fieldAttributeMasterValidationMap
     * and returns fieldAttributeValidationConditionMap
     * 
     * @param {*} fieldAttributeValidationConditions array of fieldAttributeValidationCondition
     * @param {*} fieldAttributeMasterValidationMap fieldAttributeMasterValidationMap
     */
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
    
    /**
     * constructs formLayoutDto in sorted order and nextEditable object and latest positionId 
     * also sets editable and focusable to true for first required element
     * @param {*} sequenceWiseSortedFieldAttributesForStatus sequence wise sorted fieldAttribute for status
     * @param {*} fieldAttributeMasterValidationMap fieldAttributeMaster validation map
     * @param {*} fieldAttrMasterValidationConditionMap validation condition map
     */
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
            if(fieldAttribute.required){
                // find next editable and focusable elements of the required attribute
                this.getNextEditableAndFocusableElements(fieldAttribute.id,i,sequenceWiseSortedFieldAttributesForStatus,nextEditable);
            }
            formLayoutObject.set(fieldAttribute.id,this.getFieldAttributeObject(fieldAttribute,validationArr,i+1));
        }
        let latestPositionId = sequenceWiseSortedFieldAttributesForStatus.length-1;
        return {formLayoutObject,nextEditable,latestPositionId};
    }

    /**
     * creates nextEditable object, which contains attributeMasterId wise required and non required elements
     * @param {*fieldAttributeMasterId} attributeMasterId 
     * @param {*currentSequence of calling method} currentSequence 
     * @param {*formLayout array} formLayoutArr 
     * @param {*nextEditable object} nextEditable 
     */
    getNextEditableAndFocusableElements(attributeMasterId, currentSequence, formLayoutArr,nextEditable){
        if(!formLayoutArr || formLayoutArr.length == 0){
            return;
        }
        for(let i = 0; i< formLayoutArr.length ; i++){
            if(!nextEditable[attributeMasterId]){
                nextEditable[attributeMasterId] = [];
            }
            const fieldAttribute = formLayoutArr[i];
            if(i < currentSequence || (i == currentSequence && (attributeMasterId == fieldAttribute.id || attributeMasterId == fieldAttribute.fieldAttributeMasterId))){
                continue; // if parent iteration is less than child iteration then continue
            }
            if(fieldAttribute.required && !fieldAttribute.value){
                nextEditable[attributeMasterId].push('required$$'+(fieldAttribute.id ? fieldAttribute.id : fieldAttribute.fieldAttributeMasterId)); //this is not necessary that required is always the last element in array, ex - if there are all non required. So instead of adding a new data structure, used a separator to know that this element is the required element
               break; // as soon as next required attribute is found without value then break the loop
            }
            nextEditable[attributeMasterId].push(fieldAttribute.id ? fieldAttribute.id : fieldAttribute.fieldAttributeMasterId);
        }
    }

    /**
     * creates fieldAttributeDto
     * @param {*fieldAttribute} fieldAttribute 
     * @param {*validationArray} validationArray 
     * @param {*positionId} positionId 
     */
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
            editable : !(fieldAttribute.editable) || (fieldAttribute.attributeTypeId == 62)? false: fieldAttribute.editable,
            focus : fieldAttribute.focus ? fieldAttribute.focus : false,
            validation : (validationArray && validationArray.length > 0) ? validationArray : null,
            sequenceMasterId: fieldAttribute.sequenceMasterId,
        };
    }

    
}

export let formLayoutService = new FormLayout()
