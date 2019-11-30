import {
    MODAL_CREATE_OPEN_ACCESS_NUMBER,
    MODAL_CREATE_CLOSE_ACCESS_NUMBER,
    MODAL_UPDATE_OPEN_ACCESS_NUMBER,
    MODAL_UPDATE_CLOSE_ACCESS_NUMBER,

    GET_ACCESS_NUMBER_REQUEST,
    GET_ACCESS_NUMBER_ERROR,
    GET_ACCESS_NUMBER_SUCCESS,

    CREATE_ACCESS_NUMBER_REQUEST,
    CREATE_ACCESS_NUMBER_ERROR,
    CREATE_ACCESS_NUMBER_SUCCESS,

    DELETE_ACCESS_NUMBER_REQUEST,
    DELETE_ACCESS_NUMBER_ERROR,
    DELETE_ACCESS_NUMBER_SUCCESS,

    UPDATE_ACCESS_NUMBER_REQUEST,
    UPDATE_ACCESS_NUMBER_ERROR,
    UPDATE_ACCESS_NUMBER_SUCCESS,

    LIST_ACCESS_NUMBER_REQUEST,
    LIST_ACCESS_NUMBER_ERROR,
    LIST_ACCESS_NUMBER_SUCCESS,
} from '../consts'

const modal_access_number = {
    open: false
};

export function modal_create_access_number(state = modal_access_number, action) {
    switch (action.type) {
        case MODAL_CREATE_OPEN_ACCESS_NUMBER:
            return Object.assign({}, state, {
                open: true,
            });
        case MODAL_CREATE_CLOSE_ACCESS_NUMBER:
            return Object.assign({}, state, {
                open: false,
            });

        case CREATE_ACCESS_NUMBER_SUCCESS:
            return Object.assign({}, state, {
                open: false,
            });

        default:
            return state;
    }
}

export function modal_update_access_number(state = modal_access_number, action) {
    switch (action.type) {
        case GET_ACCESS_NUMBER_REQUEST:
            console.log("GET_ACCESS_NUMBER_REQUEST");
            return Object.assign({}, state, {
                open: true
            });

        case MODAL_UPDATE_OPEN_ACCESS_NUMBER:
            console.log("MODAL_UPDATE_OPEN_ACCESS_NUMBER");
            return Object.assign({}, state, {
                open: true,
            });
        case MODAL_UPDATE_CLOSE_ACCESS_NUMBER:
            console.log("MODAL_UPDATE_CLOSE_ACCESS_NUMBER");
            return Object.assign({}, state, {
                open: false,
            });

        case UPDATE_ACCESS_NUMBER_SUCCESS:
            console.log("UPDATE_ACCESS_NUMBER_SUCCESS");
            return Object.assign({}, state, {
                open: false,
            });

        case DELETE_ACCESS_NUMBER_SUCCESS:
            console.log("DELETE_ACCESS_NUMBER_SUCCESS");
            return Object.assign({}, state, {
                open: false,
            });

        default:
            return state;
    }
}


const create_access_number_initialState = {
    hasError: false,
    success: false,
    errors: [],
    data: null,
    isSend: false
};


export function create_access_number(state = create_access_number_initialState, action) {
    switch (action.type) {
        case CREATE_ACCESS_NUMBER_REQUEST:
            return Object.assign({}, state, {
                hasError: false,
                isSend: true,
                success: false,
                errors: [],
                data: [],
            });
        case CREATE_ACCESS_NUMBER_ERROR:
            return Object.assign({}, state, {
                hasError: true,
                isSend: false,
                success: false,
                errors: action.data,
                data: [],
            });
        case CREATE_ACCESS_NUMBER_SUCCESS:
            return Object.assign({}, state, {
                hasError: false,
                isSend: false,
                success: true,
                errors: [],
                data: action.data,
            });

        case LIST_ACCESS_NUMBER_REQUEST:
            return Object.assign({}, state, {
                hasError: false,
                isSend: false,
                success: false,
                errors: [],
                data: [],
            });
        default:
            return state;
    }
}


const get_access_number_initialState = {
    hasError: false,
    success: false,
    errors: [],
    data: null,
    isSend: false
};

export function get_access_number(state = get_access_number_initialState, action) {
    switch (action.type) {
        case GET_ACCESS_NUMBER_REQUEST:
            return Object.assign({}, state, {
                hasError: false,
                isSend: true,
                success: false,
                errors: [],
                data: null,
            });
        case GET_ACCESS_NUMBER_ERROR:
            return Object.assign({}, state, {
                hasError: true,
                success: false,
                isSend: false,
                errors: action.data,
                data: null,
            });

        case GET_ACCESS_NUMBER_SUCCESS:
            return Object.assign({}, state, {
                hasError: false,
                success: true,
                isSend: false,
                errors: [],
                data: action.data,
            });

        default:
            return state;
    }
}

const delete_access_number_initialState = {
    hasError: false,
    success: false,
    errors: [],
    isSend: false,
};


export function delete_access_number(state = delete_access_number_initialState, action) {

    switch (action.type) {
        case DELETE_ACCESS_NUMBER_REQUEST:
            return Object.assign({}, state, {
                hasError: false,
                success: false,
                errors: [],
                isSend: true
            });
        case DELETE_ACCESS_NUMBER_ERROR:
            return Object.assign({}, state, {
                hasError: true,
                success: false,
                errors: [],
                isSend: false
            });
        case DELETE_ACCESS_NUMBER_SUCCESS:
            return Object.assign({}, state, {
                hasError: false,
                success: true,
                errors: [],
                isSend: true
            });

        case LIST_ACCESS_NUMBER_REQUEST:
            return Object.assign({}, state, {
                hasError: false,
                success: false,
                errors: [],
                isSend: false
            });

        default:
            return state;
    }
}

const update_access_number_initialState = {
    hasError: false,
    success: false,
    errors: [],
    modal: false,
    data: null,
    isSend: false,
};

export function update_access_number(state = update_access_number_initialState, action) {
    switch (action.type) {
        case UPDATE_ACCESS_NUMBER_REQUEST:
            return Object.assign({}, state, {
                hasError: false,
                success: false,
                errors: [],
                modal: false,
                data: null,
                isSend: true,
            });
        case UPDATE_ACCESS_NUMBER_ERROR:
            return Object.assign({}, state, {
                hasError: true,
                success: false,
                errors: [],
                modal: false,
                data: null,
                isSend: false,
            });
        case UPDATE_ACCESS_NUMBER_SUCCESS:
            return Object.assign({}, state, {
                hasError: false,
                success: true,
                errors: [],
                modal: false,
                data: null,
                isSend: false,
            });
        default:
            return state;
    }
}


const access_numbers_initialState = {
    isSend: false,
    hasError: false,
    success: false,
    errors: [],

    current_page: "",
    ordering: "",
    search: "",

    data: null
};

export function access_numbers(state = access_numbers_initialState, action) {
    switch (action.type) {

        //GET LIST

        case LIST_ACCESS_NUMBER_REQUEST:
            return Object.assign({}, state, {
                isSend: true,
                hasError: false,
                success: false,
                errors: [],
                update_list: false,
                //request format
                current_page: action.page,
                ordering: action.ordering,
                search: action.search,

                data: null
            });

        case LIST_ACCESS_NUMBER_ERROR:
            return Object.assign({}, state, {
                isSend: false,
                hasError: true,
                success: false,
                errors: action.data,

                //request format
                current_page: action.page,
                ordering: action.ordering,
                search: action.search,

                data: null
            });

        case LIST_ACCESS_NUMBER_SUCCESS:
            return Object.assign({}, state, {
                isSend: false,
                hasError: false,
                success: true,
                errors: [],

                //request format
                current_page: action.page,
                ordering: action.ordering,
                search: action.search,

                data: action.data
            });

        //Update list item async

        // case CREATE_ACCESS_NUMBER_SUCCESS:
        //     console.warn("WARNING!! CREATE_ACCESS_NUMBER_SUCCESS");
        //
        //     return Object.assign({}, state, {
        //         isSend: false,
        //         hasError: false,
        //         success: true,
        //         errors: [],
        //         data: Object.assign({}, state.data, {
        //             results: [...state.data.results, action.data]
        //         })
        //     });

        case UPDATE_ACCESS_NUMBER_SUCCESS:

            console.warn("WARNING!! UPDATE_ACCESS_NUMBER_SUCCESS");


            const index = state.data.results.findIndex(obj => obj.id === action.data.id);
            state.data.results[index] = action.data;

            return Object.assign({}, state, {
                isSend: false,
                hasError: false,
                success: true,
                errors: [],
                data: state.data
            });

        // case DELETE_ACCESS_NUMBER_SUCCESS:
        //     console.warn("WARNING!! DELETE_ACCESS_NUMBER_SUCCESS");
        //
        //     state.data.results = state.data.results.filter(function (obj) {
        //         return obj.id !== action.data;
        //     });
        //
        //     return Object.assign({}, state, {
        //         isSend: false,
        //         hasError: false,
        //         update_list: true,
        //         success: true,
        //         errors: [],
        //         data: state.data
        //     });
        default:
            return state;
    }
}