import React from 'react'

import {Container} from 'semantic-ui-react'
import {Grid, Button, Menu, Segment, Header, Input} from 'semantic-ui-react'


import {connect} from 'react-redux'
import * as action from '../action/access_number'
import {bindActionCreators} from 'redux'
import ModalCreateAccessNumber from './modal_access_number_create'
import ModalUpdateAccessNumber from './modal_access_number_update'
import TableAccessList from '../components/table_access_list'


export class AccessList extends React.Component {

    constructor(props) {
        super(props);

        this.handle_create = this.handle_create.bind(this);

        this.handle_change = this.handle_change.bind(this);

        this.handle_ordering = this.handle_ordering.bind(this);

        this.handle_change_page = this.handle_change_page.bind(this);

        this.handle_update_page = this.handle_update_page.bind(this);

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
                value: '',
            }
        };
    }

    handle_create() {
        this.props.actions.open_create_modal();
    }

    componentWillMount() {
        this.props.actions.list(1, '', '');
    }


    componentWillReceiveProps(nextProps) {

        this.setState({
            data: nextProps.access_numbers.data,
            isSend: nextProps.access_numbers.isSend,
            success: nextProps.access_numbers.success,
            hasError: nextProps.access_numbers.hasError
        });


        if (nextProps.create.success) {
            this.handle_update_page()
        }

        if (nextProps.delete.success) {
            this.handle_update_page();
        }


        if (this.state.page > 1 &&
            nextProps.access_numbers.data.results.length <= 0) {
            this.handle_change_page(this.state.page - 1);
        }

        this.forceUpdate();
    }

    handle_change(e) {
        this.props.actions.list(1, this.state.ordering.value, e.target.value);
        this.setState({
            [e.target.id]: {
                value: e.target.value,
            }
        });
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


    handle_change_page(page) {
        this.props.actions.list(page, this.state.ordering.value, this.state.search.value);
        this.setState({page: page});
    }


    handle_update_page() {
        this.props.actions.list(this.state.page, this.state.ordering.value, this.state.search.value);
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
                return (<TableAccessList data={this.state.data}
                                         ordering={this.handle_ordering}
                                         pagination={this.handle_change_page}
                                         open={this.props.actions.get}/>)
            }
        };


        return (<div>
            <ModalCreateAccessNumber/>
            <ModalUpdateAccessNumber/>
            <Container>
                <Segment>
                    <Grid>
                        <Grid.Row style={{'paddingBottom': 0}}>
                            <Grid.Column width="16">
                                <Menu secondary>
                                    <Menu.Item><Header as="h3">Список доступа</Header></Menu.Item>
                                    <Menu.Menu position='right'>
                                        <Menu.Item>
                                            <Input className='icon' icon='search' placeholder='Поиск...'
                                                   onChange={this.handle_change}/>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <Button onClick={this.handle_create} primary>Добавить</Button>
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
    access_numbers: state.access_numbers,
    delete: state.delete_access_number,
    create: state.create_access_number,
});


const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(action, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(AccessList)