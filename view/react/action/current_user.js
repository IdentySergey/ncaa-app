import {
    GET_CURRENT_USER_REQUEST,
    GET_CURRENT_USER_SUCCESS,
    GET_CURRENT_USER_ERROR
} from '../consts'

const USER_URL = "/api/users/current";

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function get() {

    return function (dispatch) {
        dispatch({
            type: GET_CURRENT_USER_REQUEST,
        });
        try {
            return fetch(USER_URL, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie("csrftoken")
                }
            }).then(response => {
                response.json().then(json => {
                    if (response.status === 200) {
                        dispatch({
                            type: GET_CURRENT_USER_SUCCESS,
                            data: json
                        });
                    } else {
                        dispatch({
                            type: GET_CURRENT_USER_ERROR,
                            data: json
                        });
                    }
                });

            });
        } catch (e) {
            dispatch({
                type: GET_CURRENT_USER_ERROR,
            });
        }
    }
}