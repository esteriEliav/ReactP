import UserObject from '../Models-Object/UserObject'
import { GetFunction } from '../components/General/CommonFunctions';


const initialState = {
    user: new UserObject(),
    propertiesList: [],
    ownersList: [],
    rentalsList: [],
    rentersList: [],
    SubPropertiesList: [],
    tasksList: [],
    cities: [],
    streets: [],
    documents: [],
    taskTypes: [],
    classificationTypes: [],
    paymentTypes: [],
    exclusivityPeople: []


};

const reducer = (state = initialState, action) => {
    if (action.type === 'SET_USER')
        return {
            ...state,
            user: { ...action.userObj }
        }
    if (action.type === 'SET_PROPERTIES')
        return {
            ...state,
            propertiesList: [...action.propertiesList]
        }
    if (action.type === 'SET_OWNERS')
        return {
            ...state,
            ownersList: [...action.ownersList]
        }
    if (action.type === 'SET_RENTALS')
        return {
            ...state,
            rentalsList: [...action.rentalsList]
        }
    if (action.type === 'SET_RENTERS')
        return {
            ...state,
            rentersList: [...action.rentersList]
        }
    if (action.type === 'SET_SUBPROPERTIES')
        return {
            ...state,
            SubPropertiesList: [...action.SubPropertiesList]
        }
    if (action.type === 'SET_TASKS')
        return {
            ...state,
            tasksList: [...action.tasksList]
        }
    if (action.type === 'SET_CITIES') {
        let cities = [...action.cities]
        if (cities)
            cities = cities.map(item => { return { id: item.CityId, name: item.CityName } })
        return {
            ...state,
            cities: cities
        }
    }
    if (action.type === 'SET_STREETS')
        return {
            ...state,
            streets: [...action.streets]
        }
    if (action.type === 'SET_DOCUMENTS')
        return {
            ...state,
            documents: [...action.documents]
        }
    if (action.type === 'SET_TASKTYPES') {
        let taskTypes = [...action.taskTypes]
        if (taskTypes)
            taskTypes = taskTypes.map(item => { return { id: item.TaskTypeId, name: item.TaskTypeName } })
        return {
            ...state,
            taskTypes: taskTypes
        }
    }
    if (action.type === 'SET_CLASSIFICATIONTYPES') {
        let classificationTypes = [...action.classificationTypes]
        if (classificationTypes)
            classificationTypes = classificationTypes.map(item => { return { id: item.ClassificationID, name: item.ClassificationName } })
        return {
            ...state,
            classificationTypes: classificationTypes
        }
    }
    if (action.type === 'SET_PAYMENTTYPES') {
        let paymentTypes = [...action.paymentTypes]
        if (paymentTypes)
            paymentTypes = paymentTypes.map(item => { return { id: item.PaymentTypeID, name: item.PaymentTypeName } })
        return {
            ...state,
            paymentTypes: paymentTypes
        }
    }
    if (action.type === 'SET_EXCLUSIVITYPEOPLE') {
        let exclusivityPeople = [...action.exclusivityPeople]
        if (exclusivityPeople)
            exclusivityPeople = exclusivityPeople.map(item => { return { id: item.ExclusivityID, name: item.ExclusivityName } })
        return {
            ...state,
            exclusivityPeople: exclusivityPeople
        }
    }


    return state
};

export default reducer;
