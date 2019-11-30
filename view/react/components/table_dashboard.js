import React from 'react'
import {Grid, Row, Col, FormGroup, FormControl, Form, Pager} from 'react-bootstrap'
import Moment from 'react-moment';

export default class TableDashboard extends React.Component {

    constructor(props) {
        super(props);

        this.handle_ordering = this.handle_ordering.bind(this);

        this.state = {
            data: [],
            isSend: false,
            success: false,
            page: 1,
            hasError: '',
            ordering: ""
        };
    }


    componentDidMount() {
        this.props.actions.day_list(1);
    }


    componentDidUnmount(){
        this.props.action.clear();
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            data: nextProps.detections.data,
            isSend: nextProps.detections.isSend,
            success: nextProps.detections.success,
            hasError: nextProps.detections.hasError
        });

        if (nextProps.detections.data !== null &&
            this.state.page > 1 &&
            nextProps.detections.data.count >= 1 &&
            nextProps.detections.data.results.length <= 0) {
            this.handle_change_page(this.state.page - 1);
        }

        this.forceUpdate();
    }

    handle_change_page(e) {
        this.props.actions.day_list(e);
    }

    handle_ordering(field) {
        if (this.state.ordering === field) {
            this.setState({ordering: "-" + this.state.ordering});
        } else {
            this.setState({ordering: this.state.ordering});
        }

    }


    render() {

        let page_navigation = () => {

            let showPrev = () => {
                if (this.state.data.page.previous !== null) {
                    return <Pager.Item previous href="#" onClick={
                        () => this.handle_change_page(this.state.data.page.previous)
                    }>&larr;
                        Назад</Pager.Item>
                }
            };

            let showNext = () => {
                if (this.state.data.page.next !== null) {
                    return <Pager.Item next href="#"
                                       onClick={
                                           () => this.handle_change_page(this.state.data.page.next)
                                       }>Вперед &rarr;</Pager.Item>
                }
            };

            return <Pager>
                {showPrev()}
                {showNext()}
            </Pager>

        };

        let content = () => {
            if (this.state.isSend && !this.state.success) {
                return (<h3 className="text-center text-muted">Пожалуйста подождите загрузка</h3>)
            } else if (this.state.hasError) {
                return <div>
                    <h3 className="text-center  text-muted">Ошибка при получении данных</h3>
                    <div className="text-center">

                    </div>
                </div>

            } else if (this.state.data === null) {
                return (
                    <div>
                        <h3 className="text-center  text-muted">Ошибка при получении данных</h3>
                        <div className="text-center">

                        </div>
                    </div>
                )
            } else if (this.state.data.length <= 0 || this.state.data.results.length <= 0) {
                return (
                    <div>
                        <h3 className="text-center  text-muted">Нет информации для отображения</h3>
                    </div>
                )
            } else {
                return show_data();
            }
        };

        let allow = (value) => {
            if (value) {
                return "Разрешен"
            } else {
                return "Запрещен"
            }
        };


        let row_item = () => {
            if (this.state.data !== null) {
                return this.state.data.results.map((item) =>
                    <Row key={item.id} className="item-table-access">
                        <Col md={2}>
                            <a href="#" onClick={() => {
                                this.props.actions.get(item.id);
                            }}><img src={"/static/" + item.photoFileName} height={64}/></a>
                        </Col>
                        <Col md={5}>
                            <div className="detector-item-center">
                                <b>{item.number}</b>
                            </div>
                        </Col>
                        <Col md={2}>
                            <div className="detector-item-center">
                                <b>{allow(item.allow)}</b>
                            </div>
                        </Col>
                        <Col md={2}>
                            <div className="detector-item-center">
                                <Moment format="DD.MM.YYYY HH:mm">{item.detected}</Moment>
                            </div>
                        </Col>
                        <Col md={1}>
                            <div className="detector-item-center">
                                <a href="#" onClick={() => {
                                    this.props.actions.get(item.id);
                                }}><span className="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>
                            </div>
                        </Col>
                    </Row>);
            }
        };

        let show_data = () => {
            return (
                <div>
                    <h3 className="camera-header">Детектировано за день</h3>
                    <div className="table-access">
                        <Row className="header-table-access">
                            <Col md={2}>
                                Машина
                            </Col>
                            <Col md={5}>
                                Номер
                            </Col>
                            <Col md={2}>
                                Доступ
                            </Col>
                            <Col md={2}>
                                Детектировано
                            </Col>
                            <Col md={1}>

                            </Col>
                        </Row>
                        {row_item()}
                    </div>
                    {page_navigation()}
                </div>
            )
        };

        return (<Grid>
            {content()}
        </Grid>)
    }
}

