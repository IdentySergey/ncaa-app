import React from 'react'
import {Modal, Form, Grid, Header, Button, Segment, Label} from 'semantic-ui-react'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as action from '../action/access_number'


export class ModalCreateAccessNumber extends React.Component {

    constructor(props) {
        super(props);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.close = this.close.bind(this);
        this.handle_submin = this.handle_submin.bind(this);
        this.handle_change = this.handle_change.bind(this);
        this.initialState = this.initialState.bind(this);
    }

    componentWillMount() {
        this.initialState();
    }

    initialState() {
        this.state = {
            modal: false,

            isLoading: false,
            isCreate: false,
            isSend: false,
            isDeleting: false,

            hasError: false,
            errors: [],
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
        this.setState({modal: false});
        this.props.actions.close_create_modal();
    }


    componentWillReceiveProps(nextProps) {

        this.setState({
            modal: nextProps.modal_create.open,
            success: nextProps.create.success,
            isSend: nextProps.create.isSend,
        });


        if (nextProps.create.hasError) {
            this.handle_errors(nextProps.create.errors)
        }

        // if (nextProps.create.success) {
        //     this.setState({modal: false});
        //     this.props.actions.close_create_modal();
        // }

        if(!nextProps.modal_create.open){
            this.initialState();
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
        this.props.actions.create(this.state.number.value,
            this.state.mark.value,
            this.state.ownerName.value);
    }


    render() {

        const showError = (field) => {
            if (field.hasError) {
                return <Label pointing='below' basic color="red">{field.error}</Label>
            }
        };

        return (
            <Modal size='tiny' onClose={this.close} dimmer={"blurring"} open={this.state.modal}>
                <Modal.Content>
                    <Grid centered>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Header size="large" textAlign="center">Новый допуск</Header>
                                <Form widths="equal">

                                    {showError(this.state.number)}
                                    <Form.Input label="Регистрационный номер" id="number" type="text"
                                                error={this.state.number.hasError}
                                                onChange={this.handle_change}
                                                placeholder="Регистрационный номер"/>

                                    {showError(this.state.mark)}
                                    <Form.Input label="Марка автомобиля" id="mark" type="text"
                                                error={this.state.mark.hasError}
                                                onChange={this.handle_change}
                                                placeholder="Марка автомобиля"/>

                                    {showError(this.state.ownerName)}
                                    <Form.Input label="Владелец автомобиля" id="ownerName" type="text"
                                                error={this.state.ownerName.hasError}
                                                onChange={this.handle_change}
                                                placeholder="Владелец автомобиля"/>

                                    <Button fluid loading={this.state.isSend}
                                            disabled={this.state.isSend} onClick={this.handle_submin}
                                            primary>Добавить</Button>
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
    modal_create: state.modal_create_access_number,
    create: state.create_access_number,
});


const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(action, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateAccessNumber)