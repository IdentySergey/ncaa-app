import React from 'react'
import {connect} from 'react-redux'
import {Container, Segment, Image, Grid, Icon, Statistic, Header} from 'semantic-ui-react'

import {bindActionCreators} from 'redux'

import * as detector_action from '../action/detector'
import * as fuzzy_action from '../action/fuzzy'
import * as platform_rotation from '../action/camera_rottation'

import FuzzyInformation from '../components/fuzzy_information'

class Camera extends React.Component {


    constructor(props) {
        super(props);
        this.props.actions_fuzzy.get();
        this.state = {
            fuzzy: {
                isFuzzySuccess: false,
                data: null
            }
        };
        this.auto_update_fuzzy = this.auto_update_fuzzy.bind(this);
        this.auto_update_fuzzy();
    }


    auto_update_fuzzy() {
        setInterval(() => {
            this.props.actions_fuzzy.get();
        }, 10000)
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.fuzzy.success) {
            this.setState({
                fuzzy: {
                    data: nextProps.fuzzy.data,
                    isFuzzySuccess: nextProps.fuzzy.success
                }
            });
        }
        this.forceUpdate();
    }


    render() {

        let left_action = {

            "mouse_up": () => {
                setTimeout(() => {
                    this.props.action_rotation.platform_rotation("stop");
                }, 1000);
                console.log("left up")
            },

            "mouse_down": () => {
                this.props.action_rotation.platform_rotation("left");
                console.log("left down")
            }

        };

        let right_action = {

            "mouse_up": () => {
                setTimeout(() => {
                    this.props.action_rotation.platform_rotation("stop");
                }, 1000);
                console.log("right up")
            },

            "mouse_down": () => {
                this.props.action_rotation.platform_rotation("right");
                console.log("right down")
            }

        };

        let top_action = {

            "mouse_up": () => {
                setTimeout(() => {
                    this.props.action_rotation.platform_rotation("stop");
                }, 1000);
                console.log("top up")
            },

            "mouse_down": () => {
                this.props.action_rotation.platform_rotation("top");
                console.log("top down")
            }

        };

        let down_action = {

            "mouse_up": () => {
                setTimeout(() => {
                    this.props.action_rotation.platform_rotation("stop");
                }, 1000);
                console.log("down up")
            },

            "mouse_down": () => {
                this.props.action_rotation.platform_rotation("bottom");
                console.log("down down")
            }

        };


        return (
            <div>
                <Segment inverted style={{'marginTop': -15, 'borderRadius': 0}}>
                    <Container>
                        <div className="camera-wrapper">
                            <a href="#" onMouseDown={left_action["mouse_down"]} onMouseUp={left_action["mouse_up"]}
                               className="camera-left">
                                <Icon name='chevron left'/>
                            </a>
                            <a href="#" onMouseDown={right_action["mouse_down"]} onMouseUp={right_action["mouse_up"]}
                               className="camera-right">
                                <Icon name='chevron right'/>
                            </a>

                            <div className="ir-center">
                                <Grid textAlign="center" stretched>
                                    <Grid.Row>
                                        <Grid.Column>
                                            ИК-прожектор
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <a href="#"><Icon name='power' size="big"/></a>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <input type="range" min="0" max="100" step="1"/>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </div>



                            <a href="#" onMouseDown={top_action["mouse_down"]} onMouseUp={top_action["mouse_up"]}
                               className="camera-top">
                                <Icon name='chevron up'/>
                            </a>
                            <a href="#" onMouseDown={down_action["mouse_down"]} onMouseUp={down_action["mouse_up"]}
                               className="camera-bottom">
                                <Icon name='chevron down'/>
                            </a>
                            <Image src="/camera/view/" style={{margin:"0 auto"}} className="center-block"/>
                        </div>
                    </Container>
                </Segment>
                <Container>
                    <Segment>
                        <FuzzyInformation fuzzy={this.state.fuzzy}/>
                    </Segment>
                </Container>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    detected: state.detected,
    detections: state.detections,
    fuzzy: state.fuzzy,
    camera_rotation: state.camera_rotation
});


const mapDispatchToProps = (dispatch) => ({
    actions_detector: bindActionCreators(detector_action, dispatch),
    actions_fuzzy: bindActionCreators(fuzzy_action, dispatch),
    action_rotation: bindActionCreators(platform_rotation, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(Camera)