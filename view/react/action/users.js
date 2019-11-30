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

const USER_URL = "/api/users/";
const USER_URL_ID = (id) => { return USER_URL + id + "/" };


export function open_create_modal(){
    return function (dispatch) {
        dispatch({
            type: MODAL_CREATE_OPEN_USER,
        });
    }
}

export function close_create_modal(){
    return function (dispatch) {
        dispatch({
            type: MODAL_CREATE_CLOSE_USER,
        });
    }
}


export function open_update_modal(){
    return function (dispatch) {
        dispatch({
            type: MODAL_UPDATE_OPEN_USER,
        });
    }
}

export function close_update_modal(){
    return function (dispatch) {
        dispatch({
            type: MODAL_UPDATE_CLOSE_USER,
        });
    }
}

export function create(username, first_name, last_name, email, password) {
    return function (dispatch) {
        dispatch({
            type: CREATE_USER_REQUEST,
        });
        try {
            return fetch(USER_URL, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: password
                })
            }).then(response => {

                response.json().then(json => {
                    if (response.status === 200) {
                        dispatch({
                            type: CREATE_USER_SUCCESS,
                            data: json
                        });
                    } else {
                        dispatch({
                            type: CREATE_USER_ERROR,
                            data: json
                        });
                    }
                });

            });
        } catch (e) {
            dispatch({
                type: CREATE_USER_ERROR,
            });
        }
    }
}

export function patch(id, username, first_name, last_name, email, password) {
    return function (dispatch) {
        dispatch({
            type: UPDATE_USER_REQUEST,
        });
        try {
            return fetch(USER_URL_ID(id), {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: password
                })
            }).then(response => {

                response.json().then(json => {
                    if (response.status === 200) {
                        console.log(json);
                        dispatch({
                            type: UPDATE_USER_SUCCESS,
                            data: json
                        });
                    } else {
                        dispatch({
                            type: UPDATE_USER_ERROR,
                            data: json
                        });
                    }
                });

            });
        } catch (e) {
            dispatch({
                type: UPDATE_USER_ERROR,
            });
        }
    }
}

export function get(id) {
    return function (dispatch) {
        dispatch({
            type: GET_USER_REQUEST,
        });
        try {
            return fetch(USER_URL_ID(id), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {

                response.json().then(json => {
                    if (response.status === 200) {
                        dispatch({
                            type: GET_USER_SUCCESS,
                            data: json
                        });
                    } else {
                        dispatch({
                            type: GET_USER_ERROR,
                            data: json
                        });
                    }
                });

            });
        } catch (e) {
            dispatch({
                type: GET_USER_ERROR,
            });
        }
    }
}

export function remove(id) {
    return function (dispatch) {
        dispatch({
            type: DELETE_USER_REQUEST,
        });
        try {
            return fetch(USER_URL_ID(id), {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {

                if (response.status === 200) {
                    dispatch({
                        type: DELETE_USER_SUCCESS,
                        data: id
                    });
                } else {
                    dispatch({
                        type: DELETE_USER_ERROR,
                        data: json
                    });
                }

            });
        } catch (e) {
            dispatch({
                type: DELETE_USER_ERROR,
            });
        }
    }
}

function generation_uri(number, ordering, search) {
    let base_uri = USER_URL + "list/";
    base_uri += "?page=" + number;
    base_uri += "&ordering=" + ordering;
    base_uri += "&search=" + search;
    return base_uri;
}

export function list(number, ordering, search) {
    let url = generation_uri(number, ordering, search);
    console.log(url);
    return function (dispatch) {
        dispatch({
            type: LIST_USER_REQUEST,
        });
        try {
            return fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                response.json().then(json => {
                    if (response.status === 200) {

                        dispatch({
                            type: LIST_USER_SUCCESS,
                            data: json,
                            current_number: number,
                            ordering: ordering,
                            search: search
                        });

                    } else {
                        dispatch({
                            type: LIST_USER_ERROR,
                            data: json,
                            current_number: number,
                            ordering: ordering,
                            search: search
                        });
                    }
                });

            });
        } catch (e) {
            dispatch({
                type: LIST_USER_ERROR,
            });
        }
    }
}