import React from 'react'
import FormLogin from '../components/form_login'
import {Container, Menu, Segment, Header} from 'semantic-ui-react'

import {connect} from 'react-redux'
import * as login from '../action/login'
import {bindActionCreators} from 'redux'


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {width: '0', height: '0'};
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }


    render() {
        return (
            <div className="app-login" style={{'minHeight': this.state.height}}>
                <Container>
                    <div className="login-box">
                        <Header textAlign="center" size='huge' inverted>Access Control
                            System</Header>
                        <FormLogin action={this.props.login_action} model={this.props.login_model}/>
                    </div>
                </Container>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    login_model: state.login,
});


const mapDispatchToProps = (dispatch) => ({
    login_action: bindActionCreators(login, dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(Login)