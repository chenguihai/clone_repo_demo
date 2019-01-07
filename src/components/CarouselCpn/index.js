import React from 'react'
import {Button, Card, Tooltip} from "antd";
import './index.less'

export default class Carouse extends React.Component {
    state = {
        count: 0,
    }
    time = null;

    componentDidMount() {
        this.time = setInterval(this.setIntervalCommonFun, 2000)
    }

    setIntervalCommonFun = () => {
        const {count} = this.state;
        if (count >= this.props.images.length - 1) {
            this.setState({
                count: 0
            })
        } else {
            this.setState({
                count: count + 1
            })
        }
    }
    handleMouseOver = (e) => {
        if (this.time) {
            clearInterval(this.time);
        }
    }
    handleMouseOut = (e) => {
        this.time = setInterval(this.setIntervalCommonFun, 2000)
    }

    componentWillUnmount() {
        clearInterval(this.time);
    }

    render() {
        const {url = "", images = "", title = ""} = this.props;
        // console.log('轮播render ========');
        return (
            <div className='carouse-wrap'>
                <Card className="carouse-card">
                    <div className="carousel-card-content" ref='carouseEle' onMouseOver={this.handleMouseOver}
                         onMouseLeave={this.handleMouseOut}
                    >
                        {
                            images[this.state.count].url ?  <a href={url} target="_blank">
                                <img src={images[this.state.count].url} className="carouse-card-img" alt="图片无法加载"/>
                            </a> :<p className="no-data-text">未加载到数据！</p>
                        }

                    </div>
                    <div className="carousel-card-foot">
                        <p className="carousel-card-title">
                            <Tooltip title={title}>
                                <a href={url} target="_blank">{title}</a>
                            </Tooltip>
                        </p>
                        <a className='mt8' href={url} target="_blank">
                            <Button size='small' type='primary'>Shop Now</Button></a>
                    </div>
                </Card>
            </div>
        )
    }
}