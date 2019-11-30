import React from 'react'

import {browserHistory} from 'react-router';
import {Form, Button, Grid, Segment, Header, Label} from 'semantic-ui-react'

export default class FormLogin extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            username: {
                value: '',
                hasError: false,
                errorMsg: ''
            },
            password: {
                value: '',
                hasError: false,
                errorMsg: ''
            },
            non_field_errors: {
                hasError: false,
                errorMsg: ''
            },
            isSend: false
        };

        this.handle_submin = this.handle_submin.bind(this);
        this.handle_change = this.handle_change.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    }


    handleValidation(errors) {
        for (let key in errors) {
            let msg = "";
            if (key === "username") {
                this.state.username.hasError = true;
                switch (errors[key]) {
                    case "required":
                        msg = "Необходимо указать имя пользователя";
                        break;
                    case "not_registration":
                        msg = "Указанный пользователь не зарегистрирован";
                        break;
                    case "min_length":
                        msg = "Адрес эл. почты или Номер телефона должны быть больше 1 символа";
                        break;
                    case "This field may not be blank.":
                        msg = "Необходимо указать имя пользователя";
                        break;
                }
                this.state.username.errorMsg = msg;
            } else if (key === "password") {
                this.state.password.hasError = true;
                switch (errors[key]) {
                    case "required":
                        msg = "Необходимо указать пароль";
                        break;
                    case "min_length":
                        msg = "Пароль должен быть больше 6 символов";
                        break;
                    case "This field may not be blank.":
                        msg = "Необходимо указать пароль";
                        break;
                    case "Ensure this field has at least 6 characters.":
                        msg = "Пароль должен быть больше 6 символов";
                        break;
                }
                this.state.password.errorMsg = msg;
            } else if (key === "non_field_errors") {
                this.state.password.hasError = true;
                switch (errors[key]) {
                    case "bad_password":
                        msg = "Неправильный пароль";
                        break;
                }
                this.state.password.errorMsg = msg;
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        this.state.isSend = nextProps.model.isSend;
        if (nextProps.model.hasError) {
            this.handleValidation(nextProps.model.errors);
        }

        if (nextProps.model.isAuthenticated) {
            setTimeout(() => {
                browserHistory.push('/camera');
            }, 1);
        }
        this.forceUpdate();
    }


    handle_submin() {
        this.setState({isSend: true});
        this.props.action.authentication(this.state.username.value, this.state.password.value);
    }

    handle_change(e) {
        this.setState({
            [e.target.id]: {
                value: e.target.value,
                hasError: false,
                errorMsg: ''
            },
            non_field_errors: {
                hasError: false,
                errorMsg: ''
            }
        });
    }


    render() {

        const showError = (field) => {
            if (field.hasError) {
                return <Label pointing='below' basic color="red">{field.errorMsg}</Label>
            }
        };

        return (
            <Grid centered>
                <Grid.Row>
                    <Grid.Column largeScreen="5">

                            <Form>
                                <Form.Field>
                                    {showError(this.state.username)}
                                    <Form.Input type="text" error={this.state.username.hasError} id="username"
                                                placeholder='Имя' onChange={this.handle_change}/>
                                </Form.Field>
                                <Form.Field>
                                    {showError(this.state.password)}
                                    <Form.Input type="password" error={this.state.password.hasError} id="password"
                                                placeholder='Пароль' onChange={this.handle_change}/>
                                </Form.Field>
                                {showError(this.state.non_field_errors)}
                                <Button fluid type='submit' loading={this.state.isSend} disabled={this.state.isSend}
                                        size="large" primary onClick={this.handle_submin}>Войти</Button>
                            </Form>

                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}