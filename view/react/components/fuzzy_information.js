import React from 'react'
import {Table, Icon, Grid, Header} from 'semantic-ui-react'
import Moment from 'react-moment'

export default class FuzzyInformation extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {


        let interpritation = {

            'noise': (value) => {
                if (value < 0.6) {
                    return "low"
                } else if (value < 1.4) {
                    return "medium"
                } else {
                    return "high"
                }
            },


            'dn': (value) => {
                if (value < 0.5) {
                    return "day"
                } else {
                    return "night"
                }
            },

            'lightning': (value) => {
                if (value < 0.5) {
                    return "0"
                } else if (value < 1.5) {
                    return "1"
                } else if (value < 2.5) {
                    return "2"
                } else {
                    return "3"
                }
            },

            'focus': (value) => {
                if (value < 0.45){
                    return "0"
                }else{
                    return "1"
                }
            },

            'cleaning': (value) => {
                if (value < 0.45){
                    return "0"
                }else{
                     return "1"
                }
            },

            'heating': (value) => {
                if (value < 0.5) {
                    return "0"
                } else if (value < 1.5) {
                    return "1"
                } else if (value < 2.5) {
                    return "2"
                } else if (value < 3.5) {
                    return "3"
                } else {
                    return "4"
                }
            },
        };

        let fuzzy_information = () => {
            if (this.props.fuzzy.isFuzzySuccess) {
                return (
                    <Grid>
                        <Grid.Row columns="6" textAlign="center">
                            <Grid.Column>
                                <Header as="h4">Зашумлённость</Header>
                                <p>{interpritation["noise"](this.props.fuzzy.data.noise)}</p>
                                <p>{this.props.fuzzy.data.noise}</p>
                            </Grid.Column>
                            <Grid.Column>
                                <Header as="h4">Режим д\н</Header>
                                <p>{interpritation["dn"](this.props.fuzzy.data.dn)}</p>
                                <p>{this.props.fuzzy.data.dn}</p>
                            </Grid.Column>
                            <Grid.Column>
                                <Header as="h4">Внешняя подсветка</Header>
                                <p>{interpritation["lightning"](this.props.fuzzy.data.lightning)}</p>
                                <p>{this.props.fuzzy.data.lightning}</p>
                            </Grid.Column>
                            <Grid.Column>
                                <Header as="h4">Автофокус</Header>
                                <p>{interpritation["focus"](this.props.fuzzy.data.focus)}</p>
                                <p>{this.props.fuzzy.data.focus}</p>
                            </Grid.Column>
                            <Grid.Column>
                                <Header as="h4">Очистка от шумов</Header>
                                <p>{interpritation["cleaning"](this.props.fuzzy.data.cleaning)}</p>
                                <p>{this.props.fuzzy.data.cleaning}</p>
                            </Grid.Column>
                            <Grid.Column>
                                <Header as="h4">Обогрев</Header>
                                <p>{interpritation["heating"](this.props.fuzzy.data.heating)}</p>
                                <p>{this.props.fuzzy.data.heating}</p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
            }else{

            }
        };


        return <div>
            {fuzzy_information()}
        </div>
    }
}