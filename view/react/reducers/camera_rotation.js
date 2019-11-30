
import {
    CAMERA_ROTATION_REQUEST,
    CAMERA_ROTATION_SUCCESS,
    CAMERA_ROTATION_ERROR,
} from '../consts'



const initialState = {
    hasError: false,
    success: false,
    isSend: false
};


export function camera_rotation(state = initialState, action) {
    switch (action.type) {
        case CAMERA_ROTATION_REQUEST:
            return Object.assign({}, state, {
                hasError: false,
                isSend: true,
                success: false,
            });
        case CAMERA_ROTATION_ERROR:
            return Object.assign({}, state, {
                hasError: true,
                isSend: false,
                success: false,
            });
        case CAMERA_ROTATION_SUCCESS:
            return Object.assign({}, state, {
                hasError: false,
                isSend: false,
                success: true,
            });

        default:
            return state;
    }
}