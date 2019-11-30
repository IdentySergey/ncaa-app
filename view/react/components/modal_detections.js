import React from 'react'
import {Row, Col, Button, Modal, FormGroup, FormControl, Alert, Image} from 'react-bootstrap'
import Moment from 'react-moment';

export default class ModalDetection extends React.Component {

    constructor(props) {
        super(props);

        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.base_state = this.base_state.bind(this);
        this.handle_submin = this.handle_submin.bind(this);
        this.handle_change = this.handle_change.bind(this);
        this.handle_delete = this.handle_delete.bind(this);
        this.handle_errors = this.handle_errors.bind(this);

        this.base_state();
        this.action_update = this.action_update.bind(this);
    }

    base_state() {
        this.state = {
            modal: false,
            hasError: false,

            isLoading: false,
            isSend: false,
            isDeleting: false,

            errors: [],
            photo: {
                value: ''
            },
            id: {
                value: ''
            },
            number: {
                value: '',
                hasError: false,
                error: ''
            },
            detected: {
                value: ''
            }
        };
    }

    close() {
        this.setState({modal: false});
        this.base_state();
        this.props.actions.reset_state();
    }

    open() {
        this.setState({modal: true});
    }


    action_update() {

    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        this.setState({
            modal: nextProps.detected.modal,
            isLoading: nextProps.detected.isLoading,
            isSend: nextProps.detected.isSend,
            isDeleting: nextProps.detected.isDeleting
        });

        if (nextProps.detected.data !== null) {
            this.state.id.value = nextProps.detected.data.id;
            this.state.number.value = nextProps.detected.data.number;
            this.state.photo.value = nextProps.detected.data.photoFileName;
            this.state.detected.value = nextProps.detected.data.detected;
        }

        if (nextProps.detected.hasError) {
            this.handle_errors(nextProps.detected.errors)
        }

        this.forceUpdate();
    }

    handle_errors(errors) {
        this.state.hasError = true;
        let msg = "";
        console.log(errors);
        console.log("handle_errors modal access list");
        for (let key in errors) {
            switch (key) {
                case "number":
                    console.log("handle_errors modal access list number");
                    this.state.number.hasError = true;
                    switch (errors[key][0]) {
                        case "This field may not be blank.":
                            msg = "Необходимо указать номер машины";
                            break;
                    }
                    this.state.number.error = msg;
                    this.state.errors.push(msg);
                    break;
            }
        }
        this.forceUpdate();
    }

    handle_submin() {
        this.props.actions.patch(this.state.id.value, this.state.number.value);
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

    handle_delete() {
        this.props.actions.remove(this.state.id.value);
    }


    render() {
        let header = () => {

            if (this.state.isLoading) {
                return "Загрузка события";
            } else if (!this.state.modal) {
                return <div>Событие</div>
            } else {
                return <div>Событие <Moment format="DD.MM.YYYY HH:mm">{this.state.detected.value}</Moment></div>
            }

        };


        let content = () => {
            if (this.state.isLoading) {
                return <h3 className="splash-modal">Загрузка пожалуйста подождите</h3>

            } else if (!this.state.modal) {
                return <h3 className="splash-modal">Закрытие</h3>
            } else {

                return <div>
                    <Modal.Body>
                        <form>
                            {alert_errors()}
                            <Row>
                                <Col md={12} className="preview">
                                    <Image className="center-block detected"
                                           src={"/static/" + this.state.photo.value} responsive/>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <FormGroup controlId="number"
                                               validationState={validation_check(this.state.number)}>
                                        <FormControl type="text" value={this.state.number.value}
                                                     onChange={this.handle_change}
                                                     placeholder="Зарегестрированный номер"/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        {delete_button()}
                        {send_button()}
                    </Modal.Footer>
                </div>
            }
        };

        let send_button = () => {
            if (this.state.isSend) {
                return <Button onClick={this.handle_submin} disabled={true}
                               bsStyle="primary">Сохранение...</Button>
            }

            return <Button onClick={this.handle_submin}
                           bsStyle="primary">Сохранить</Button>
        };

        let delete_button = () => {
            if (this.state.isDeleting) {
                return (<Button onClick={this.handle_delete} disabled={true}
                                className="pull-left" bsStyle="default">Удаление...</Button>)
            }

            return (<Button onClick={this.handle_delete}
                            className="pull-left" bsStyle="default">Удалить</Button>)
        };

        let validation_check = (field) => {
            if (field.hasError === true) {
                return "error";
            } else {
                return "";
            }
        };


        let alert_errors = () => {
            let errors_view = this.state.errors.map((error) => {
                return <p>{error}</p>;
            });

            if (this.state.hasError === true) {
                return <Alert bsStyle="danger" onDismiss={() => {
                    this.setState({hasError: false, errors: []});
                }}>
                    {errors_view}
                </Alert>
            }
        };


        return (
            <Modal show={this.state.modal} onHide={this.close} aria-labelledby="contained-modal-title-lg">
                <div className="modal-item-access">
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-lg">{header()}</Modal.Title>
                    </Modal.Header>
                    {content()}
                </div>
            </Modal>

        );
    }
}