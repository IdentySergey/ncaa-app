import React from 'react'
import {Table, Icon, Grid, Button} from 'semantic-ui-react'
import Moment from 'react-moment'

export default class TableUsers extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {


        let pagination = () => {
            let left = () => {
                if (this.props.data.page.previous != null) {
                    return (<Button content='Назад' onClick={()=>{
                        this.props.pagination(this.props.data.page.previous)
                    }} icon='left arrow' labelPosition='left'/>)
                }
            };

            let right = () => {
                if (this.props.data.page.next != null) {
                    return (<Button content='Вперед'  onClick={()=>{
                        this.props.pagination(this.props.data.page.next)
                    }} icon='right arrow' labelPosition='right'/>)
                }
            };

            return (
                <Grid>
                    <Grid.Row>
                        <Grid.Column floated='left' textAlign="left" width={5}>

                            {left()}

                        </Grid.Column>
                        <Grid.Column floated='right' textAlign="right" width={5}>

                            {right()}

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        };


        let last_login = (item) => {

            if(item !== null){
                return <Moment format="DD.MM.YYYY HH:mm">{item}</Moment>
            }else{
                return "Не входил";
            }
        };

        let table_row = () => {
            return this.props.data.results.map((item) =>
                <Table.Row key={item.id}>
                    <Table.Cell>
                        {item.username}
                    </Table.Cell>
                    <Table.Cell>
                        {item.last_name} {item.first_name}
                    </Table.Cell>
                    <Table.Cell>
                        {item.email}
                    </Table.Cell>
                    <Table.Cell>
                        {last_login(item.last_login)}
                    </Table.Cell>
                    <Table.Cell selectable textAlign="center" width="1">
                        <a href="#" onClick={() => {
                            this.props.edit(item.id);
                        }}><Icon name="edit"/></a>
                    </Table.Cell>
                </Table.Row>);
        };

        let table = () => {
            if (this.props.data !== null) {
                return (
                    <div>
                        <Table striped>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell selectable>
                                        <a href="#" onClick={() => {
                                            this.props.ordering("username")
                                        }}><b>Логин</b></a>
                                    </Table.Cell>
                                    <Table.Cell selectable>
                                        <a href="#" onClick={() => {
                                            this.props.ordering("last_name")
                                        }}><b>Пользователь</b></a>
                                    </Table.Cell>
                                    <Table.Cell selectable>
                                        <a href="#" onClick={() => {
                                            this.props.ordering("email")
                                        }}><b>Эл. Почта</b></a>
                                    </Table.Cell>
                                    <Table.Cell selectable colSpan='2'>
                                        <a href="#" onClick={() => {
                                            this.props.ordering("last_login")
                                        }}><b>Последний вход</b></a>
                                    </Table.Cell>
                                </Table.Row>
                                {table_row()}
                            </Table.Body>
                        </Table>
                        {pagination()}
                    </div>)
            } else {

            }
        };


        return table()
    }

}