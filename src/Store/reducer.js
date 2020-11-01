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
    streets: []


};

const reducer = (state= initialState, action) => {
    if (action.type === 'SET_USER')
        return {
            ...state,
            user: action.userObj
        }
    if (action.type === 'SET_PROPERTIES')
        return {
            ...state,
            propertiesList: action.propertiesList
        }
    if (action.type === 'SET_OWNERS')
        return {
            ...state,
            ownersList: action.ownersList
        }
    if (action.type === 'SET_RENTALS')
        return {
            ...state,
            rentalsList: action.rentalsList
        }
    if (action.type === 'SET_RENRERS')
        return {
            ...state,
            rentersList: action.rentersList
        }
    if (action.type === 'SET_SUBPROPERTIES')
        return {
            ...state,
            SubPropertiesList: action.SubPropertiesList
        }
    if (action.type === 'SET_TASKS')
        return {
            ...state,
            tasksList: action.tasksList
        }
    if (action.type === 'SET_CITIES')
        return {
            ...state,
            cities: action.cities
        }
        if (action.type === 'SET_STREETS')
        return {
            ...state,
            streets: action.streets
        }
    return state
};

export default reducer;
