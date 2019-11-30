import {
    MODAL_DETECTION_OPEN,
    MODAL_DETECTION_CLOSE,

    GET_DETECTION_REQUEST,
    GET_DETECTION_ERROR,
    GET_DETECTION_SUCCESS,

    UPDATE_DETECTION_REQUEST,
    UPDATE_DETECTION_ERROR,
    UPDATE_DETECTION_SUCCESS,

    DELETE_DETECTION_REQUEST,
    DELETE_DETECTION_ERROR,
    DELETE_DETECTION_SUCCESS,

    LIST_DETECTION_REQUEST,
    LIST_DETECTION_ERROR,
    LIST_DETECTION_SUCCESS

} from '../consts'

const modal_detected_initialState = {
    open: false
};

export function modal_detected(state = modal_detected_initialState, action) {
    switch (action.type) {
        case MODAL_DETECTION_OPEN:
            return Object.assign({}, state, {
                open: true,
            });
        case MODAL_DETECTION_CLOSE:
            return Object.assign({}, state, {
                open: false,
            });
        case GET_DETECTION_SUCCESS:
            return Object.assign({}, state, {
                open: true,
            });

        default:
            return state;
    }
}


const get_detected_initialState = {
    isSend: false,
    hasError: false,
    success: false,
    errors: [],
    data: null
};


export function get_detected(state = get_detected_initialState, action) {
    switch (action.type) {
        case GET_DETECTION_REQUEST:
            return Object.assign({}, state, {
                isSend: true,
                hasError: false,
                success: false,
                errors: [],
                data: null
            });
        case GET_DETECTION_ERROR:
            return Object.assign({}, state, {
                isSend: false,
                hasError: true,
                success: false,
                errors: [],
                data: null
            });
        case GET_DETECTION_SUCCESS:
            return Object.assign({}, state, {
                isSend: false,
                hasError: false,
                success: true,
                errors: [],
                data: action.data,
            });
        default:
            return state;
    }
}

const delete_detected_initialState = {
    isSend: false,
    hasError: false,
    success: false,
    errors: [],
    data: null
};

export function delete_detected(state = delete_detected_initialState, action) {
    switch (action.type) {

        case DELETE_DETECTION_REQUEST:
            return Object.assign({}, state, {
                isSend: true,
                hasError: false,
                success: false,
                errors: [],
            });
        case DELETE_DETECTION_ERROR:
            return Object.assign({}, state, {
                isSend: false,
                hasError: true,
                success: false,
                errors: action.data,
            });
        case DELETE_DETECTION_SUCCESS:
            return Object.assign({}, state, {
                isSend: false,
                hasError: false,
                success: true,
                errors: [],
            });
        default:
            return state;
    }
}

const update_detected_initialState = {
    isSend: false,
    hasError: false,
    success: false,
    errors: []
};

export function update_detected(state = update_detected_initialState, action) {
    switch (action.type) {
        case UPDATE_DETECTION_REQUEST:
            return Object.assign({}, state, {
                isSend: true,
                hasError: false,
                success: false,
                errors: []
            });
        case UPDATE_DETECTION_ERROR:
            return Object.assign({}, state, {
                isSend: false,
                hasError: true,
                success: false,
                errors: []
            });
        case UPDATE_DETECTION_SUCCESS:
            return Object.assign({}, state, {
                isSend: false,
                hasError: false,
                success: true,
                errors: []
            });
        default:
            return state;
    }
}


const detections_initialState = {
    isSend: false,
    hasError: false,
    success: false,
    errors: [],
    data: null
};

export function detections(state = detections_initialState, action) {
    switch (action.type) {

        case LIST_DETECTION_REQUEST:
            return Object.assign({}, state, {
                isSend: true,
                hasError: false,
                success: false,
                errors: [],
                data: null
            });
        case LIST_DETECTION_ERROR:
            return Object.assign({}, state, {
                isSend: false,
                hasError: true,
                success: false,
                errors: action.data,
                data: null
            });
        case LIST_DETECTION_SUCCESS:

            return Object.assign({}, state, {
                isSend: false,
                hasError: false,
                success: true,
                errors: [],
                data: action.data
            });
        default:
            return state;
    }
}