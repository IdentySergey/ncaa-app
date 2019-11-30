import {combineReducers} from 'redux'

import login from './reducers/login'
import current_user from './reducers/current_user'

import {fuzzy} from './reducers/fuzzy'

import {
    modal_create_user,
    modal_update_user,
    get_user,
    create_user,
    delete_user,
    update_user,
    users,

} from './reducers/user'

import {
    modal_create_access_number,
    modal_update_access_number,
    create_access_number,
    get_access_number,
    delete_access_number,
    update_access_number,
    access_numbers
} from './reducers/access_number'

import {
    get_detected,
    delete_detected,
    update_detected,
    detections,
    modal_detected
} from './reducers/detected'


import {
    camera_rotation
} from './reducers/camera_rotation'


const rootReducer = combineReducers({
    login,
    current_user,

    //USER
    modal_create_user,
    modal_update_user,
    get_user,
    create_user,
    delete_user,
    update_user,
    users,

    //ACCESS NUMBER
    modal_create_access_number,
    modal_update_access_number,
    create_access_number,
    get_access_number,
    delete_access_number,
    update_access_number,
    access_numbers,

    //DETECTIONS
    get_detected,
    delete_detected,
    update_detected,
    detections,
    modal_detected,

    //Fuzzy
    fuzzy,


    //camera rotation
    camera_rotation
});

export default rootReducer;