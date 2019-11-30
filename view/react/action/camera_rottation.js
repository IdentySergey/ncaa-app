import {
    CAMERA_ROTATION_REQUEST,
    CAMERA_ROTATION_SUCCESS,
    CAMERA_ROTATION_ERROR,
} from '../consts'



export function platform_rotation(direction) {

    let endpoint = "";

    switch(direction){
        case "left":
            endpoint = "/api/hardware/platform/left/";
            break;

        case "right":
            endpoint = "/api/hardware/platform/right/";
            break;
        case "top":
            endpoint = "/api/hardware/platform/top/";
            break;

        case "bottom":
            endpoint = "/api/hardware/platform/bottom/";
            break;

        case "stop":
            endpoint = "/api/hardware/platform/stop/";
            break;
    }

    return function (dispatch) {
        dispatch({
            type: CAMERA_ROTATION_REQUEST,
        });
        try {
            return fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.status === 200) {
                    dispatch({
                        type: CAMERA_ROTATION_SUCCESS,
                    });
                } else {
                    dispatch({
                        type: CAMERA_ROTATION_ERROR,
                    });
                }
            });
        } catch (e) {
            dispatch({
                type: CAMERA_ROTATION_ERROR,
            });
        }
    }
}