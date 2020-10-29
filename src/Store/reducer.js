import UserObject from '../Models-Object/UserObject'
import { GetFunction } from '../components/General/CommonFunctions';

const initialState = {
    user: new UserObject(),
    propertiesList: GetFunction('Property/GetAllProperties'),
    ownersList: GetFunction('PropertyOwner/getAllOwners'),
    rentalsList: GetFunction('Rental/GetAllRentals'),
    rentersList: GetFunction('Renter/GetAllRenters'),
    SubPropertiesList: GetFunction('SubProperty/GetAllSubProperties'),
    tasksLists: GetFunction('Task/GetAllTasks'),
    cities: GetFunction('Property/GetAllCities')


};

const reducer = (state= initialState, action) => {
    if (action.type === 'SET_USER')
        return {
            ...state,
            user: action.userObj
        }
        return state
};

export default reducer;
