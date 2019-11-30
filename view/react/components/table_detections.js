import React from 'react'
import {Table, Icon, Grid, Button} from 'semantic-ui-react'
import Moment from 'react-moment'

export default class TableDetections extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {


        let allow = (value) => {
            if (value) {
                return <p>Разрешен</p>
            } else {
                return <p>Запрещен</p>
            }
        };

        let pagination = () => {
            let left = () => {
                if (this.props.data.page.previous != null) {
                    return (<Button content='Назад' onClick={() => {
                        this.props.pagination(this.props.data.page.previous)
                    }} icon='left arrow' labelPosition='left'/>)
                }
            };

            let right = () => {
                if (this.props.data.page.next != null) {
                    return (<Button content='Вперед' onClick={() => {
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

        let table_row = () => {
            return this.props.data.results.map((item) =>
                <Table.Row error={!item.allow} key={item.id}>
                    <Table.Cell width="3">
                        <a href="#" onClick={() => {
                            this.props.open(item.id);
                        }}><img src={"/static/detected/" + item.photoFileName} height={64}/></a>
                    </Table.Cell>
                    <Table.Cell>
                        <b>{item.number}</b>
                    </Table.Cell>
                    <Table.Cell>
                        <Moment format="DD.MM.YYYY HH:mm">{item.detected}</Moment>
                    </Table.Cell>
                    <Table.Cell>
                        <b>{allow(item.allow)}</b>
                    </Table.Cell>
                    <Table.Cell selectable textAlign="center" width="1">
                        <a href="#" onClick={() => {
                            this.props.open(item.id);
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
                                        }}><b>Автомобиль</b></a>
                                    </Table.Cell>
                                    <Table.Cell selectable>
                                        <a href="#" onClick={() => {
                                            this.props.ordering("number")
                                        }}><b>Номер</b></a>
                                    </Table.Cell>
                                    <Table.Cell selectable>
                                        <a href="#" onClick={() => {
                                            this.props.ordering("allow")
                                        }}><b>Детектировано</b></a>
                                    </Table.Cell>
                                    <Table.Cell selectable colSpan='2'>
                                        <a href="#" onClick={() => {
                                            this.props.ordering("detected")
                                        }}><b>Доступ</b></a>
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