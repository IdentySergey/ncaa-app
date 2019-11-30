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
    LIST_DETECTION_SUCCESS,
} from '../consts'


const DETECTION_URL = "/api/detections/";
const DETECTION_URL_ID = (id) => {
    return DETECTION_URL + id + "/"
};


export function open_modal() {
    return function (dispatch) {
        dispatch({
            type: MODAL_DETECTION_OPEN,
        });
    }
}

export function close_modal() {
    return function (dispatch) {
        dispatch({
            type: MODAL_DETECTION_CLOSE,
        });
    }
}


export function get(id) {
    return function (dispatch) {
        dispatch({
            type: GET_DETECTION_REQUEST,
        });
        try {
            return fetch(DETECTION_URL_ID(id), {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                response.json().then(json => {
                    console.log(json);
                    if (response.status === 200) {
                        dispatch({
                            type: GET_DETECTION_SUCCESS,
                            data: json
                        });
                    } else {
                        dispatch({
                            type: GET_DETECTION_ERROR,
                            data: json
                        });
                    }
                });
            });
        } catch (e) {
            dispatch({
                type: GET_DETECTION_ERROR,
            });
        }
    }
}

export function patch(id, number) {
    return function (dispatch) {
        dispatch({
            type: UPDATE_DETECTION_REQUEST,
        });
        try {
            return fetch(DETECTION_URL_ID(id), {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    number: number,
                })
            }).then(response => {
                response.json().then(json => {
                    if (response.status === 200) {
                        dispatch({
                            type: UPDATE_DETECTION_SUCCESS,
                            data: json
                        });
                    } else {
                        dispatch({
                            type: UPDATE_DETECTION_ERROR,
                            data: json
                        });
                    }
                });
            });
        } catch (e) {
            dispatch({
                type: UPDATE_DETECTION_ERROR,
            });
        }
    }
}

export function remove(id) {
    return function (dispatch) {
        dispatch({
            type: DELETE_DETECTION_REQUEST,
        });
        try {
            return fetch(DETECTION_URL_ID(id), {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.status === 200) {
                    dispatch({
                        type: DELETE_DETECTION_SUCCESS,
                        data: id
                    });
                } else {
                    dispatch({
                        type: DELETE_DETECTION_ERROR,
                    });
                }
            });
        } catch (e) {
            dispatch({
                type: DELETE_DETECTION_ERROR,
            });
        }
    }
}


function generation_list_uri(number, ordering, search) {
    let base_uri = DETECTION_URL + "list/";
    base_uri += "?page=" + number;
    base_uri += "&ordering=" + ordering;
    base_uri += "&search=" + search;
    return base_uri;
}

export function list(page, ordering, search) {
    let uri = generation_list_uri(page, ordering, search);
    return function (dispatch) {
        dispatch({
            type: LIST_DETECTION_REQUEST,
        });
        try {
            return fetch(uri, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                response.json().then(json => {
                    if (response.status === 200) {
                        console.log(json);
                        dispatch({
                            type: LIST_DETECTION_SUCCESS,
                            data: json
                        });
                    } else {
                        dispatch({
                            type: LIST_DETECTION_ERROR,
                        });
                    }
                });
            });
        } catch (e) {
            dispatch({
                type: LIST_DETECTION_ERROR,
            });
        }
    }
}

function generation_day_uri(number) {
    let base_uri = DETECTION_URL + "now/";
    base_uri += "?page=" + number;
    return base_uri;
}

export function day_list(page) {
    let uri = generation_day_uri(page);
    console.log(uri);
    return function (dispatch) {
        dispatch({
            type: LIST_DETECTION_REQUEST,
        });
        try {
            return fetch(uri, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                response.json().then(json => {
                    if (response.status === 200) {
                        console.log(json);
                        dispatch({
                            type: LIST_DETECTION_SUCCESS,
                            data: json
                        });
                    } else {
                        dispatch({
                            type: LIST_DETECTION_ERROR,
                        });
                    }
                });
            });
        } catch (e) {
            dispatch({
                type: LIST_DETECTION_ERROR,
            });
        }
    }
}
