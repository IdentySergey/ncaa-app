import React from 'react'
import {Modal, Form, Grid, Header, Button, Dimmer, Loader, Label} from 'semantic-ui-react'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as action from '../action/access_number'


export class ModalUpdateAccessNumber extends React.Component {

    constructor(props) {
        super(props);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.close = this.close.bind(this);
        this.handle_submin = this.handle_submin.bind(this);
        this.handle_change = this.handle_change.bind(this);
        this.initialState = this.initialState.bind(this);
        this.handle_delete = this.handle_delete.bind(this);
        this.initialState();
    }

    initialState() {
        this.state = {
            modal: false,
            isLoading: false,
            isUpdate: false,
            isDelete: false,
            hasError: false,
            errors: [],
            id: {
                value: '',
                hasError: false,
                error: ''
            },
            number: {
                value: '',
                hasError: false,
                error: ''
            },
            mark: {
                value: '',
                hasError: false,
                error: ''
            },
            ownerName: {
                value: '',
                hasError: false,
                error: ''
            },
            non_field_errors: {
                hasError: false,
                error: ''
            }
        };
    }


    close() {
        console.log("TEST");
        this.props.actions.close_update_modal();
    }


    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        this.setState({
            modal: nextProps.modal_update.open,
            success: nextProps.update.success,
            isSend: nextProps.update.isSend,
            isLoading: nextProps.access_number.isSend,
            isDelete: nextProps.remove.isSend
        });

        if (nextProps.update.hasError) {
            this.handle_errors(nextProps.create.errors)
        }

        // if (!nextProps.modal_update.open) {
        //     this.initialState();
        // }

        if (nextProps.access_number.success) {
            this.setState({
                id: {
                    value: nextProps.access_number.data.id,
                    hasError: false,
                    error: ''
                },
                number: {
                    value: nextProps.access_number.data.number,
                    hasError: false,
                    error: ''
                },
                mark: {
                    value: nextProps.access_number.data.mark,
                    hasError: false,
                    error: ''
                },
                ownerName: {
                    value: nextProps.access_number.data.ownerName,
                    hasError: false,
                    error: ''
                },
            })
        }
        this.forceUpdate();
    }


    handle_errors(errors) {
        this.state.hasError = true;
        let msg = "";
        for (let key in errors) {
            switch (key) {
                case "number":
                    this.state.number.hasError = true;
                    switch (errors[key][0]) {
                        case "This field may not be blank.":
                            msg = "Необходимо указать номер машины";
                            break;
                        case "access list with this number already exists.":
                            msg = "Указанный номер машины уже добавлен";
                            break;
                    }
                    this.state.number.error = msg;
                    this.state.errors.push(msg);
                    break;

                case "mark":
                    this.state.mark.hasError = true;
                    switch (errors[key][0]) {
                        case "This field may not be blank.":
                            msg = "Необходимо указать марку машины";
                            break;
                    }
                    this.state.mark.error = msg;
                    this.state.errors.push(msg);
                    break;

                case "ownerName":
                    this.state.ownerName.hasError = true;
                    switch (errors[key][0]) {
                        case "This field may not be blank.":
                            msg = "Необходимо указать владельца";
                            break;
                    }
                    this.state.ownerName.error = msg;
                    this.state.errors.push(msg);
                    break;

            }
        }
        this.forceUpdate();
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

    handle_submin() {
        this.props.actions.patch(this.state.id.value, this.state.number.value,
            this.state.mark.value,
            this.state.ownerName.value);
    }


    handle_delete() {
        this.props.actions.remove(this.state.id.value);
    }


    render() {

        const showError = (field) => {
            if (field.hasError) {
                return <Label pointing='below' basic color="red">{field.error}</Label>
            }
        };

        if (this.state.isLoading) {
            return (<Dimmer active>
                <Loader>Загрузка допуска</Loader>
            </Dimmer>)
        }

        return (
            <Modal size='tiny' onClose={this.close} dimmer={"blurring"} open={this.state.modal}>
                <Modal.Content>
                    <Grid centered>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Header size="large" textAlign="center">Допуск</Header>
                                <Form widths="equal">

                                    {showError(this.state.number)}
                                    <Form.Input defaultValue={this.state.number.value} label="Регистрационный номер"
                                                id="number" type="text"
                                                error={this.state.number.hasError}
                                                onChange={this.handle_change}
                                                placeholder="Регистрационный номер"/>

                                    {showError(this.state.mark)}
                                    <Form.Input defaultValue={this.state.mark.value} label="Марка автомобиля" id="mark"
                                                type="text"
                                                error={this.state.mark.hasError}
                                                onChange={this.handle_change}
                                                placeholder="Марка автомобиля"/>

                                    {showError(this.state.ownerName)}
                                    <Form.Input defaultValue={this.state.ownerName.value} label="Владелец автомобиля"
                                                id="ownerName" type="text"
                                                error={this.state.ownerName.hasError}
                                                onChange={this.handle_change}
                                                placeholder="Владелец автомобиля"/>

                                    <Button loading={this.state.isDelete}
                                            disabled={this.state.isDelete} onClick={this.handle_delete}>Удалить</Button>

                                    <Button floated="right" loading={this.state.isUpdate}
                                            disabled={this.state.isUpdate} onClick={this.handle_submin}
                                            primary>Редактировать</Button>
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
    modal_update: state.modal_update_access_number,
    update: state.update_access_number,
    remove: state.delete_access_number,
    access_number: state.get_access_number
});


const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(action, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(ModalUpdateAccessNumber)