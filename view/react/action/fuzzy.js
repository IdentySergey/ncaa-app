import {
    GET_FUZZY_REQUEST,
    GET_FUZZY_SUCCESS,
    GET_FUZZY_ERROR
} from '../consts'


export function get() {
    return function (dispatch) {
        dispatch({
            type: GET_FUZZY_REQUEST,
        });
        try {
            return fetch("/api/detections/fuzzy/", {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                response.json().then(json => {
                    if (response.status === 200) {
                        dispatch({
                            type: GET_FUZZY_SUCCESS,
                            data: json
                        });
                    } else {
                        dispatch({
                            type: GET_FUZZY_ERROR
                        });
                    }
                });
            });
        } catch (e) {
            dispatch({
                type: GET_FUZZY_ERROR,
            });
        }
    }
}
