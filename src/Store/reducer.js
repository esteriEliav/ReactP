import UserObject from '../Models-Object/UserObject'

const initialState = {
    user: new UserObject()
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
