import React from 'react'
import NavbarApp from '../components/navbar_app'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as action from '../action/current_user'


export class Main extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
            <NavbarApp user={this.props.current_user} action={this.props.actions}/>
            {this.props.children}
        </div>)
    }
}


const mapStateToProps = (state) => ({
    current_user: state.current_user,
});


const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(action, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(Main)