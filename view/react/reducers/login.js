import {
    AUTHENTICATION_REQUEST,
    AUTHENTICATION_ERROR,
    AUTHENTICATION_SUCCESS
} from '../consts'


const initialState = {
    isSend: false,
    hasError: false,
    success: false,
    errors: [],
    isAuthenticated: false
};

export default function login(state = initialState, action) {
    switch (action.type) {
        case AUTHENTICATION_REQUEST:
            return Object.assign({}, state, {
                isSend: true,
                hasError: false,
                success: false,
                errors: [],
                isAuthenticated: false
            });
        case AUTHENTICATION_ERROR:
            return Object.assign({}, state, {
                isSend: false,
                hasError: true,
                success: false,
                errors: action.data.errors,
                isAuthenticated: false
            });
        case AUTHENTICATION_SUCCESS:
            return Object.assign({}, state, {
                isSend: false,
                hasError: false,
                success: true,
                errors: [],
                isAuthenticated: true
            });
        default:
            return state;
    }
}