import React from 'react'

import {Container} from 'semantic-ui-react'
import {Grid, Menu, Input, Segment, Header, Table, Icon, Dimmer} from 'semantic-ui-react'

import {connect} from 'react-redux'
import * as action from '../action/detector'
import {bindActionCreators} from 'redux'
import TableDetections from '../components/table_detections'
import ModalDetections from '../containers/modal_detection'

export class Detections extends React.Component {

    constructor(props) {
        super(props);

        this.handle_search = this.handle_search.bind(this);
        this.handle_ordering = this.handle_ordering.bind(this);
        this.handle_change_page = this.handle_change_page.bind(this);

        this.state = {
            data: [],
            isSend: false,
            success: false,
            page: 1,
            hasError: '',
            search: {
                value: ''
            },
            ordering: {
                value: ''
            }
        };
    }


    componentDidMount() {
        this.props.actions.list(1, "", "");
    }


    componentWillReceiveProps(nextProps) {

        this.setState({
            data: nextProps.detections.data,
            isSend: nextProps.detections.isSend,
            success: nextProps.detections.success,
            hasError: nextProps.detections.hasError
        });


        if (nextProps.delete.success) {
            this.handle_update_page();
        }


        if (this.state.page > 1 &&
            nextProps.access_numbers.data.results.length <= 0) {
            this.handle_change_page(this.state.page - 1);
        }

        this.forceUpdate();
    }

    handle_search(e) {
        this.setState({
            [e.target.id]: {
                value: e.target.value,
            }
        });
        this.props.actions.list(1, "", e.target.value);
    }

    handle_change_page(e) {
        this.props.actions.list(e, "", "");
    }


    handle_ordering(field) {
        let value = field;
        if (this.state.ordering.value === field) {
            this.setState({ordering: {value: "-" + field}});
            value = "-" + field;
        } else {
            this.setState({ordering: {value: field}});
        }

        this.props.actions.list(this.state.page, value, this.state.search.value);
    }


    render() {

        let content = () => {
            if (this.state.isSend) {
                return (<Header disabled textAlign="center">Пожалуйста подождите загрузка</Header>)
            }

            if (this.state.hasError) {
                return (<Header disabled textAlign="center">Ошибка при получении данных</Header>)
            }

            if (this.state.success) {
                if (this.state.data.results.length <= 0) {
                    return (<Header disabled textAlign="center">Нет информации для отображения</Header>)
                }
                return (<TableDetections data={this.state.data}
                                         ordering={this.handle_ordering}
                                         pagination={this.handle_change_page}
                                         open={this.props.actions.get}/>)
            }

            return <div></div>;
        };


        return (
            <div>
                <ModalDetections/>
                <Container style={{marginBottom:20}}>
                    <Segment>
                        <Grid>
                            <Grid.Row style={{'paddingBottom': 0}}>
                                <Grid.Column width="16">
                                    <Menu secondary>
                                        <Menu.Item>
                                            <Header as="h3">Список событий</Header>
                                        </Menu.Item>
                                        <Menu.Menu position='right'>
                                            <Menu.Item>
                                                <Input className='icon' icon='search' placeholder='Поиск...'
                                                       onChange={this.handle_search}/>
                                            </Menu.Item>
                                        </Menu.Menu>
                                    </Menu>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    {content()}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                </Container>
            </div>)
    }

}


const mapStateToProps = (state) => ({
    detected: state.detected,
    detections: state.detections,

    get: state.get_detected,
    delete: state.delete_detected,
    update: state.update_detected
});


const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(action, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(Detections)