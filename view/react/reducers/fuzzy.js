import {
    GET_FUZZY_REQUEST,
    GET_FUZZY_SUCCESS,
    GET_FUZZY_ERROR
} from '../consts'


const initialState = {
    isSend: false,
    hasError: false,
    success: false,
    errors: [],
    data: null
};

export function fuzzy(state = initialState, action) {
    switch (action.type) {
        case GET_FUZZY_REQUEST:
            return Object.assign({}, state, {
                isSend: true,
                hasError: false,
                success: false,
                errors: [],
                data: null
            });

        case GET_FUZZY_SUCCESS:
            return Object.assign({}, state, {
                isSend: false,
                hasError: false,
                success: true,
                errors: [],
                data: action.data
            });

        case GET_FUZZY_ERROR:
            return Object.assign({}, state, {
                isSend: false,
                hasError: true,
                success: false,
                data: null
            });
        default:
            return state;
    }
}