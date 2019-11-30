import React from 'react'
import {Modal, Form, Grid, Header, Button, Loader, Label, Dimmer} from 'semantic-ui-react'


import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as action from '../action/users'


export class ModalUserUpdate extends React.Component {

    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
        this.handle_submit = this.handle_submit.bind(this);
        this.handle_change = this.handle_change.bind(this);
        this.handle_errors = this.handle_errors.bind(this);
        this.handle_delete = this.handle_delete.bind(this);
    }


    componentWillMount() {
        this.state = {
            user_loading: false,
            modal: false,
            success: false,
            isSend: false,
            isDelete: false,
            id: {
                value: '',
            },
            username: {
                value: '',
                hasError: false,
                error: ''
            },
            first_name: {
                value: '',
                hasError: false,
                error: ''
            },
            last_name: {
                value: '',
                hasError: false,
                error: ''
            },
            email: {
                value: '',
                hasError: false,
                error: ''
            },
            password: {
                value: '',
                hasError: false,
                error: ''
            },
            non_field_errors: {
                hasError: false,
                error: ''
            }
        };

        if (this.props.user.success) {
            this.setState({
                id: {
                    value: this.props.user.data.id,
                },
                username: {
                    value: this.props.user.data.username,
                    hasError: false,
                    error: ''
                },
                first_name: {
                    value: this.props.user.data.first_name,
                    hasError: false,
                    error: ''
                },
                last_name: {
                    value: this.props.user.data.last_name,
                    hasError: false,
                    error: ''
                },
                email: {
                    value: this.props.user.data.email,
                    hasError: false,
                    error: ''
                }
            })
        }
    }

    close() {
        this.setState({modal: false});
        this.props.actions.close_create_modal()
    }


    componentWillReceiveProps(nextProps) {

        this.setState({
            modal: nextProps.modal_update.open,
            success: nextProps.update.success,
            isSend: nextProps.update.isSend,
            user_loading: nextProps.user.isSend,
            isDelete: nextProps.remove.isSend
        });

        if (nextProps.update.hasError) {
            this.handle_errors(nextProps.create.errors)
        }


        // if (nextProps.remove.success) {
        //     this.setState({modal: false});
        //     this.props.actions.close_update_modal();
        // }
        //
        // if (nextProps.update.success) {
        //     this.setState({modal: false});
        //     this.props.actions.close_update_modal();
        // }

        if (nextProps.user.success === true && nextProps.update.isSend === false) {

            this.state = {
                id: {
                    value: nextProps.user.data.id,
                },
                username: {
                    value: nextProps.user.data.username,
                    hasError: false,
                    error: ''
                },
                first_name: {
                    value: nextProps.user.data.first_name,
                    hasError: false,
                    error: ''
                },
                last_name: {
                    value: nextProps.user.data.last_name,
                    hasError: false,
                    error: ''
                },
                email: {
                    value: nextProps.user.data.email,
                    hasError: false,
                    error: ''
                },
                password: {
                    value: '',
                    hasError: false,
                    error: ''
                }
            };
        }

        this.forceUpdate();
    }


    handle_errors(errors) {
        this.state.hasError = true;
        let msg = "";
        for (let key in errors) {
            switch (key) {
                case "username":
                    this.state.username.hasError = true;
                    switch (errors[key][0]) {
                        case "This field may not be blank.":
                            msg = "Необходимо указать имя для входа";
                            break;
                        case "access list with this number already exists.":
                            msg = "Указанный пользователь уже добавлен";
                            break;
                        case "user is registered":
                            msg = "Указанный пользователь уже добавлен";
                            break;
                    }
                    this.state.username.error = msg;
                    this.state.errors.push(msg);
                    break;


                case "first_name":
                    this.state.first_name.hasError = true;
                    switch (errors[key][0]) {
                        case "This field may not be blank.":
                            msg = "Необходимо указать имя пользователя";
                            break;
                    }
                    this.state.first_name.error = msg;
                    this.state.errors.push(msg);
                    break;


                case "last_name":
                    this.state.last_name.hasError = true;
                    switch (errors[key][0]) {
                        case "This field may not be blank.":
                            msg = "Необходимо указать фамилию пользователя";
                            break;
                    }
                    this.state.last_name.error = msg;
                    this.state.errors.push(msg);
                    break;

                case "email":
                    this.state.email.hasError = true;
                    switch (errors[key][0]) {
                        case "This field may not be blank.":
                            msg = "Необходимо указать адрес эл.почты";
                            break;
                        case "Enter a valid email address.":
                            msg = "Необходимо указать корректный адрес эл.почты";
                            break;
                    }
                    this.state.email.error = msg;
                    this.state.errors.push(msg);
                    break;

                case "password":
                    this.state.password.hasError = true;
                    switch (errors[key][0]) {
                        case "This field may not be blank.":
                            msg = "Необходимо указать пароль пользователя";
                            break;
                        case "Not a valid string.":
                            msg = "Необходимо указать пароль";
                            break;
                        case "Ensure this field has at least 6 characters.":
                            msg = "Минимальная длина пароля 6 символов";
                            break;
                    }
                    this.state.password.error = msg;
                    this.state.errors.push(msg);
                    break;

                default:
                    this.state.errors.push(msg);
                    msg = "";
            }
        }
    }

    handle_submit() {
        this.props.actions.patch(
            this.state.id.value,
            this.state.username.value,
            this.state.first_name.value,
            this.state.last_name.value,
            this.state.email.value,
            this.state.password.value);
    }

    handle_delete() {
        this.props.actions.remove(this.state.id.value);
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
            },
            hasError: false,
            errors: []
        });
    }

    render() {

        const showError = (field) => {
            if (field.hasError) {
                return <Label pointing='below' basic color="red">{field.error}</Label>
            }
        };

        if (this.state.user_loading) {
            return (<Dimmer active>
                <Loader>Загрузка пользователя</Loader>
            </Dimmer>)
        }

        return (
            <Modal size='tiny' onClose={this.close} dimmer={"blurring"} open={this.state.modal}>
                <Modal.Content>
                    <Grid centered>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Header size="large"
                                        textAlign="center">{this.state.last_name.value} {this.state.first_name.value}</Header>
                                <Form widths="equal">
                                    {showError(this.state.username)}
                                    <Form.Input defaultValue={this.state.username.value}
                                                label="Логин для входа" id="username" type="text"
                                                error={this.state.username.hasError}
                                                onChange={this.handle_change}
                                                placeholder="Логин для входа"/>
                                    {showError(this.state.last_name)}
                                    <Form.Input defaultValue={this.state.last_name.value}
                                                label="Фамилия пользователя" id="last_name" type="text"
                                                error={this.state.last_name.hasError}
                                                onChange={this.handle_change}
                                                placeholder="Фамилия пользователя"/>
                                    {showError(this.state.first_name)}
                                    <Form.Input defaultValue={this.state.first_name.value}
                                                label="Имя пользователя" id="first_name" type="text"
                                                error={this.state.first_name.hasError}
                                                onChange={this.handle_change}
                                                placeholder="Имя пользователя"/>
                                    {showError(this.state.email)}
                                    <Form.Input defaultValue={this.state.email.value}
                                                label="Адрес эл.почты" id="email" type="email"
                                                error={this.state.email.hasError}
                                                onChange={this.handle_change}
                                                placeholder="Адрес эл.почты"/>
                                    {showError(this.state.password)}
                                    <Form.Input defaultValue={this.state.password.value}
                                                label="Новый пароль" id="password" type="password"
                                                error={this.state.password.hasError}
                                                onChange={this.handle_change}
                                                placeholder="Новый пароль"/>

                                    <Button loading={this.state.isDelete}
                                            disabled={this.state.isDelete} onClick={this.handle_delete}>Удалить</Button>

                                    <Button loading={this.state.isSend} floated="right"
                                            disabled={this.state.isSend} onClick={this.handle_submit}
                                            primary>Сохранить</Button>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    modal_update: state.modal_update_user,
    update: state.update_user,
    remove: state.delete_user,
    user: state.get_user
});


const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(action, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(ModalUserUpdate)