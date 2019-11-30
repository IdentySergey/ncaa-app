import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, Link, browserHistory} from 'react-router'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import rootReducer from './reducers'
import thunkMiddleware from 'redux-thunk'

import Main from './containers/page_main'
import Login from './containers/page_login'
import Camera from './containers/page_camera'
import AccessList from './containers/page_access_list'
import Users from './containers/page_users'
import Detections from './containers/page_detections'

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
    )
);


ReactDOM.render((
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/login" components={Login}/>
            <Route path="/" components={Main}>
                <Route path="/camera" components={Camera}/>
                <Route path="/detection" components={Detections}/>
                <Route path="/access-list" components={AccessList}/>
                <Route path="/users" components={Users}/>
            </Route>
        </Router>
    </Provider>
), document.getElementById('app'));