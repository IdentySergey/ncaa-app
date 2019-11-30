import {
    GET_CURRENT_USER_REQUEST,
    GET_CURRENT_USER_ERROR,
    GET_CURRENT_USER_SUCCESS
} from '../consts'


const initialState = {
    hasError: false,
    success: false,
    errors: [],
    data: null
};

export default function current_user(state = initialState, action) {
    switch (action.type) {

        case GET_CURRENT_USER_REQUEST:
            return Object.assign({}, state, {
                hasError: false,
                success: false,
                errors: [],
                data: null
            });

        case GET_CURRENT_USER_ERROR:
            return Object.assign({}, state, {
                hasError: true,
                success: false,
                errors: action.data,
                data: null
            });

        case GET_CURRENT_USER_SUCCESS:
            return Object.assign({}, state, {
                hasError: false,
                success: true,
                errors: [],
                data: action.data
            });

        default:
            return state;
    }
}