import {
    AUTHENTICATION_URL,
    AUTHENTICATION_REQUEST,
    AUTHENTICATION_ERROR,
    AUTHENTICATION_SUCCESS
} from '../consts'



export function authentication(username, password) {
    return function (dispatch) {
        dispatch({
            type: AUTHENTICATION_REQUEST
        });
        try {
            return fetch(AUTHENTICATION_URL, {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            }).then(response => {
                if (response.status === 200) {
                    dispatch({
                        type: AUTHENTICATION_SUCCESS
                    });
                } else if (response.status === 400) {
                    response.json().then(json => {
                        console.log(json);
                        let errors = {};
                        for (var key in json) {
                            errors[key] = json[key][0];
                        }
                        dispatch({
                            type: AUTHENTICATION_ERROR,
                            data: {
                                errors: errors
                            }
                        })
                    });
                }
            });
        } catch (e) {

        }
    }
}