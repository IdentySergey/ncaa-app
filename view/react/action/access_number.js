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

    ACCESS_NUMBER_URL
} from '../consts'

const ACCESS_NUMBER_URL_ID = (id) => { return ACCESS_NUMBER_URL + id + "/" };

export function open_create_modal() {
    return function (dispatch) {
        dispatch({
            type: MODAL_CREATE_OPEN_ACCESS_NUMBER,
        });
    }
}

export function close_create_modal() {
    return function (dispatch) {
        dispatch({
            type: MODAL_CREATE_CLOSE_ACCESS_NUMBER,
        });
    }
}


export function open_update_modal() {
    return function (dispatch) {
        dispatch({
            type: MODAL_UPDATE_OPEN_ACCESS_NUMBER,
        });
    }
}

export function close_update_modal() {
    return function (dispatch) {
        dispatch({
            type: MODAL_UPDATE_CLOSE_ACCESS_NUMBER,
        });
    }
}


export function create(number, mark, ownerName) {
    return function (dispatch) {
        dispatch({
            type: CREATE_ACCESS_NUMBER_REQUEST,
        });
        try {
            return fetch(ACCESS_NUMBER_URL, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    number: number,
                    mark: mark,
                    ownerName: ownerName
                })
            }).then(response => {

                response.json().then(json => {
                    if (response.status === 200) {
                        dispatch({
                            type: CREATE_ACCESS_NUMBER_SUCCESS,
                            data: json
                        });
                    } else {
                        dispatch({
                            type: CREATE_ACCESS_NUMBER_ERROR,
                            data: json
                        });
                    }
                });

            });
        } catch (e) {
            dispatch({
                type: CREATE_ACCESS_NUMBER_ERROR,
            });
        }
    }
}

export function patch(id, number, mark, ownerName) {
    return function (dispatch) {
        dispatch({
            type: UPDATE_ACCESS_NUMBER_REQUEST,
        });
        try {
            return fetch(ACCESS_NUMBER_URL_ID(id), {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    number: number,
                    mark: mark,
                    ownerName: ownerName
                })
            }).then(response => {

                response.json().then(json => {
                    if (response.status === 200) {
                        console.log(json);
                        dispatch({
                            type: UPDATE_ACCESS_NUMBER_SUCCESS,
                            data: json
                        });
                    } else {
                        dispatch({
                            type: UPDATE_ACCESS_NUMBER_ERROR,
                            data: json
                        });
                    }
                });

            });
        } catch (e) {
            dispatch({
                type: UPDATE_ACCESS_NUMBER_ERROR,
            });
        }
    }
}

export function get(id) {
    return function (dispatch) {
        dispatch({
            type: GET_ACCESS_NUMBER_REQUEST,
        });
        try {
            return fetch(ACCESS_NUMBER_URL_ID(id), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {

                response.json().then(json => {
                    if (response.status === 200) {
                        dispatch({
                            type: GET_ACCESS_NUMBER_SUCCESS,
                            data: json
                        });
                    } else {
                        dispatch({
                            type: GET_ACCESS_NUMBER_ERROR,
                            data: json
                        });
                    }
                });

            });
        } catch (e) {
            dispatch({
                type: GET_ACCESS_NUMBER_ERROR,
            });
        }
    }
}

export function remove(id) {
    return function (dispatch) {
        dispatch({
            type: DELETE_ACCESS_NUMBER_REQUEST,
        });
        try {
            return fetch(ACCESS_NUMBER_URL_ID(id), {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {

                if (response.status === 200) {
                    dispatch({
                        type: DELETE_ACCESS_NUMBER_SUCCESS,
                        data: id
                    });
                } else {
                    dispatch({
                        type: DELETE_ACCESS_NUMBER_ERROR,
                        data: json
                    });
                }

            });
        } catch (e) {
            dispatch({
                type: DELETE_ACCESS_NUMBER_ERROR,
            });
        }
    }
}


function generation_uri(number, ordering, search) {
    let base_uri = ACCESS_NUMBER_URL + "list/";
    base_uri += "?page=" + number;
    base_uri += "&ordering=" + ordering;
    base_uri += "&search=" + search;
    return base_uri;
}

export function list(number, ordering, search) {

    let url = generation_uri(number, ordering, search);
    return function (dispatch) {
        dispatch({
            type: LIST_ACCESS_NUMBER_REQUEST,
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
                        console.log(json);
                        dispatch({
                            type: LIST_ACCESS_NUMBER_SUCCESS,
                            data: json,
                            current_page: number,
                            ordering: ordering,
                            search: search
                        });

                    } else {
                        dispatch({
                            type: LIST_ACCESS_NUMBER_ERROR,
                            data: json,
                            current_page: number,
                            ordering: ordering,
                            search: search
                        });
                    }
                });

            });
        } catch (e) {
            dispatch({
                type: LIST_ACCESS_NUMBER_ERROR,
            });
        }
    }
}