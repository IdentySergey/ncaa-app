import React from 'react'
import {Container, Segment, Menu, Grid, Header} from 'semantic-ui-react'


export default class NavbarApp extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        this.forceUpdate();
    }

    render() {
        let logout = () => {
            setTimeout(() => {
                window.location = "/logout/";
            }, 1)
        };

        return (
            <Segment inverted style={{'borderRadius':0}}>
                <Container>
                    <Menu secondary inverted>
                        <Menu.Item><Header inverted as="a" href={'/camera'}>Access Control System</Header></Menu.Item>
                        <Menu.Item name='Видеокамера' as="a" href={'/camera'}/>
                        <Menu.Item name='События' as="a" href={'/detection'}/>
                        <Menu.Item name='Допуск' as="a" href={'/access-list'}/>
                        <Menu.Item name='Пользователи' as="a" href={'/users'}/>
                        <Menu.Item name="Выйти" position='right' as="a" href={'/logout'}/>
                    </Menu>
                </Container>
            </Segment>
        )
    }
}