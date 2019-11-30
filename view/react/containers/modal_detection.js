import React from 'react'
import {Modal, Form, Grid, Header, Button, Segment, Label, Dimmer, Loader, Image} from 'semantic-ui-react'
import Moment from 'react-moment'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as action from '../action/detector'


export class ModalDetections extends React.Component {

    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
        this.handle_submit = this.handle_submit.bind(this);
        this.handle_change = this.handle_change.bind(this);
        this.handle_errors = this.handle_errors.bind(this);
        this.initialState = this.initialState.bind(this);
    }

    close() {
        this.props.actions.close_modal();
    }

    initialState() {
        this.setState({
            modal: false,
            hasError: false,
            isLoading: false,

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
        });
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

    componentWillMount() {
        this.initialState();
    }


    componentWillReceiveProps(nextProps) {
        console.log(nextProps);

        this.state.isLoading = nextProps.detected.isSend;
        this.state.modal = nextProps.modal.open;

        if (nextProps.detected.success) {
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

    handle_submit() {
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

    render() {
        if (this.state.isLoading) {
            return (<Dimmer active>
                <Loader>Загрузка допуска</Loader>
            </Dimmer>)
        }

        return (
            <Modal size='large' onClose={this.close} dimmer={"blurring"} open={this.state.modal}>
                <Modal.Content style={{"background": "#000"}}>
                    <Grid centered>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Image src={"/static/detected/" + this.state.photo.value}/>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column floated='left' textAlign="left"  width={5}>
                                            <div style={{"color":"#fff", "fontSize":18,'marginTop':15}}>
                                                <Moment format="DD.MM.YYYY HH:mm">{this.state.detected.value}</Moment>

                                                </div>
                                        </Grid.Column>
                                        <Grid.Column floated='right' textAlign="right"  width={5}>
                                            <div  style={{"color":"#fff", "fontSize":18,'marginTop':15}}>{this.state.number.value}</div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    detected: state.get_detected,
    modal: state.modal_detected
});


const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(action, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(ModalDetections)