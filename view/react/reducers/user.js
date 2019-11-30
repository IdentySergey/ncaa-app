import {
    GET_USER_REQUEST,
    GET_USER_ERROR,
    GET_USER_SUCCESS,

    CREATE_USER_REQUEST,
    CREATE_USER_ERROR,
    CREATE_USER_SUCCESS,

    DELETE_USER_REQUEST,
    DELETE_USER_ERROR,
    DELETE_USER_SUCCESS,

    UPDATE_USER_REQUEST,
    UPDATE_USER_ERROR,
    UPDATE_USER_SUCCESS,

    LIST_USER_REQUEST,
    LIST_USER_ERROR,
    LIST_USER_SUCCESS,

    MODAL_CREATE_OPEN_USER,
    MODAL_CREATE_CLOSE_USER,
    MODAL_UPDATE_OPEN_USER,
    MODAL_UPDATE_CLOSE_USER
} from '../consts'


const modal_create_user_initialState = {
    open: false
};

export function modal_create_user(state = modal_create_user_initialState, action) {
    switch (action.type) {
        case MODAL_CREATE_OPEN_USER:
            return Object.assign({}, state, {
                open: true,
            });
        case MODAL_CREATE_CLOSE_USER:
            return Object.assign({}, state, {
                open: false,
            });
        case CREATE_USER_SUCCESS:
            return Object.assign({}, state, {
                open: false,
            });

        //default state when list user reload
        case LIST_USER_REQUEST:
            return Object.assign({}, state, {
                open: false,
            });

        default:
            return state;
    }
}

const modal_update_user_initialState = {
    open: false
};

export function modal_update_user(state = modal_update_user_initialState, action) {
    switch (action.type) {
        case MODAL_UPDATE_OPEN_USER:
            return Object.assign({}, state, {
                open: true,
            });
        case MODAL_UPDATE_CLOSE_USER:
            return Object.assign({}, state, {
                open: false,
            });
        case GET_USER_REQUEST:
            return Object.assign({}, state, {
                open: true,
            });

        case UPDATE_USER_SUCCESS:
            return Object.assign({}, state, {
                open: false,
            });
        case DELETE_USER_SUCCESS:
            return Object.assign({}, state, {
                open: false,
            });
        case LIST_USER_REQUEST:
            return Object.assign({}, state, {
                open: false,
            });
        default:
            return state;
    }
}


const get_user_initialState = {
    isSend: false,
    hasError: false,
    success: false,
    errors: [],
    data: null
};


export function get_user(state = get_user_initialState, action) {

    switch (action.type) {
        case GET_USER_REQUEST:
            return Object.assign({}, state, {
                isSend: true,
                hasError: false,
                success: false,
                errors: [],
                data: null
            });
        case GET_USER_ERROR:
            return Object.assign({}, state, {
                isSend: false,
                hasError: true,
                success: false,
                errors: action.data,
                data: null
            });
        case GET_USER_SUCCESS:
            return Object.assign({}, state, {
                isSend: false,
                hasError: false,
                success: true,
                errors: [],
                data: action.data
            });
        case UPDATE_USER_SUCCESS:
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

const create_user_initialState = {
    isSend: false,
    hasError: false,
    success: false,
    errors: [],
    data: null
};

export function create_user(state = create_user_initialState, action) {

    switch (action.type) {
        case CREATE_USER_REQUEST:
            return Object.assign({}, state, {
                isSend: true,
                hasError: false,
                success: false,
                errors: [],
                data: null
            });
        case CREATE_USER_ERROR:
            return Object.assign({}, state, {
                isSend: false,
                hasError: true,
                success: false,
                errors: action.data,
                data: null
            });
        case CREATE_USER_SUCCESS:
            return Object.assign({}, state, {
                isSend: false,
                hasError: false,
                success: true,
                errors: [],
                data: action.data
            });


        case LIST_USER_REQUEST:
            return Object.assign({}, state, {
                isSend: false,
                hasError: false,
                success: false,
                errors: [],
                data: null
            });
        default:
            return state;
    }
}

const delete_user_initialState = {
    isSend: false,
    hasError: false,
    success: false,
    errors: []
};

export function delete_user(state = delete_user_initialState, action) {

    switch (action.type) {


        case DELETE_USER_REQUEST:
            return Object.assign({}, state, {
                isSend: true,
                hasError: false,
                success: false,
                errors: [],
            });

        case DELETE_USER_ERROR:
            return Object.assign({}, state, {
                isSend: false,
                hasError: false,
                success: false,
                errors: action.data,
            });
        case DELETE_USER_SUCCESS:
            return Object.assign({}, state, {
                isSend: false,
                hasError: false,
                success: true,
                errors: [],
            });


        //default state when list user reload
        case LIST_USER_REQUEST:
            return Object.assign({}, state, {
                isSend: false,
                hasError: false,
                success: false,
                errors: [],
            });

        default:
            return state;
    }
}

const update_user_initialState = {
    isSend: false,
    hasError: false,
    success: false,
    errors: [],
    data: null
};

export function update_user(state = update_user_initialState, action) {

    switch (action.type) {
        case UPDATE_USER_REQUEST:
            return Object.assign({}, state, {
                isSend: true,
                hasError: false,
                success: false,
                errors: [],
                data: []
            });


        case UPDATE_USER_ERROR:
            return Object.assign({}, state, {
                isSend: false,
                hasError: true,
                success: false,
                errors: action.data,
                data: []
            });


        case UPDATE_USER_SUCCESS:
            return Object.assign({}, state, {
                isSend: false,
                hasError: false,
                success: true,
                errors: [],
                data: action.data,
            });


        //default state when list user reload
        case LIST_USER_REQUEST:
            return Object.assign({}, state, {
                isSend: false,
                hasError: false,
                success: false,
                errors: [],
                data: []
            });

        default:
            return state;
    }
}


const users_initialState = {
    isSend: false,
    hasError: false,
    success: false,
    errors: [],
    data: [],

    current_page: 0,
    ordering: "",
    search: "",
};

export function users(state = users_initialState, action) {
    switch (action.type) {
        case LIST_USER_REQUEST:
            return Object.assign({}, state, {
                isSend: true,
                hasError: false,
                success: false,
                update_list: false,
                errors: [],
                data: []
            });
        case LIST_USER_ERROR:
            return Object.assign({}, state, {
                isSend: false,
                hasError: true,
                success: false,
                errors: action.data,
                data: [],

                current_page: action.page,
                ordering: action.ordering,
                search: action.search,
            });
        case LIST_USER_SUCCESS:
            return Object.assign({}, state, {
                isSend: false,
                hasError: false,
                success: true,
                errors: [],
                data: action.data,

                current_page: action.page,
                ordering: action.ordering,
                search: action.search,
            });

        case UPDATE_USER_SUCCESS:
            const index = state.data.results.findIndex(obj => obj.id === action.data.id);
            state.data.results[index] = action.data;
            return Object.assign({}, state, {
                isSend: false,
                hasError: false,
                success: true,
                errors: [],
                data: state.data
            });
        default:
            return state;
    }
}