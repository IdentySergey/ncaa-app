import React from 'react'

import {Container} from 'semantic-ui-react'
import {Grid, Menu, Input, Button, Header, Table, Icon, Segment} from 'semantic-ui-react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as action from '../action/users'


import ModalUserCreate from './modal_user_create'
import ModalUserUpdate from './modal_user_update'
import TableUsers from '../components/table_users'


export class Users extends React.Component {

    constructor(props) {
        super(props);

        this.handle_create = this.handle_create.bind(this);
        this.handle_change = this.handle_change.bind(this);
        this.handle_change_page = this.handle_change_page.bind(this);
        this.handle_update_page = this.handle_update_page.bind(this);
        this.handle_ordering = this.handle_ordering.bind(this);

        this.state = {
            data: [],
            isSend: false,
            page: 1,
            success: false,
            search: {
                value: ''
            },
            ordering: {
                value: ''
            }
        };

        this.props.actions.list(1, "", "");
    }

    handle_create() {
        this.props.actions.open_create_modal();
    }


    componentWillReceiveProps(nextProps) {

        this.setState({
            data: nextProps.users.data,
            isSend: nextProps.users.isSend,
            hasError: nextProps.users.hasError,
            success: nextProps.users.success
        });


        if (nextProps.create_user.success) {
            this.handle_update_page();
        }

        if (nextProps.delete_user.success) {
            this.handle_update_page();
        }

        if (nextProps.users.success &&
            this.state.page > 1 &&
            nextProps.users.data.results.length <= 0) {
            this.handle_change_page(this.state.page - 1);
        }

        this.forceUpdate();
    }

    handle_change(e) {
        this.setState({
            [e.target.id]: {
                value: e.target.value,
            }
        });
        this.props.actions.list(1, this.state.ordering.value, e.target.value);
    }

    handle_change_page(page) {
        this.props.actions.list(page, this.state.ordering.value, this.state.search.value);
        this.setState({page: page});
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

                return <TableUsers pagination={this.handle_change_page}
                                   ordering={this.handle_ordering}
                                   edit={this.props.actions.get}
                                   data={this.state.data}/>;
            }
        };

        return (<Container>
            <ModalUserCreate/>
            <ModalUserUpdate/>
            <Segment>
                <Grid>
                    <Grid.Row style={{'paddingBottom': 0}}>
                        <Grid.Column width="16">
                            <Menu secondary>
                                <Menu.Item><Header as="h3">Список пользователей</Header></Menu.Item>
                                <Menu.Menu position='right'>
                                    <Menu.Item>
                                        <Input className='icon' icon='search' placeholder='Поиск'
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
        </Container>)
    }
}


const mapStateToProps = (state) => ({
    users: state.users,
    create_user: state.create_user,
    delete_user: state.delete_user,
});


const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(action, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(Users)