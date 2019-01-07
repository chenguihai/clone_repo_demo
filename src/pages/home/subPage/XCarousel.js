import React, {Component} from "react";
import {Button, Card, Tooltip} from "antd";
import Carouse from '../../../components/CarouselCpn'

export default class XCarousel extends Component {

    state = {
        this_index: 0
    }

    handlePrev = () => {
        const {this_index} = this.state;
        if (this_index !== 0) {
            this.setState({
                this_index: this_index - 1
            });
        }
    }
    handleNext = () => {
        const {this_index} = this.state;
        if (this_index !== this.props.imgs.length - 1) {
            this.setState({
                this_index: this_index + 1
            });
        }
    }

    render() {
        // console.log('render =====xCarousel=====');
        const {imgs = []} = this.props;
        const {this_index} = this.state;
        let marginLeft = this_index === 0 ? 5 : this_index === 1 ? 5 - (this_index * 218) : 5 - (this_index - 1) * 306 - 218;
        const CarouselImg = (props) => {
            const {imgObj = {src: "", img: "", title: "", description: ""}} = props;
            return <Card className="carouse-card">
                <div className="carousel-card-content">
                    {imgObj.img ?<a href={imgObj.src} target="_blank">
                        <img src={imgObj.img} className="carouse-card-img" alt="图片无法加载"/>
                    </a>:<p className="no-data-text">未加载到数据！</p>}
                </div>
                <div className="carousel-card-foot">
                    <p className="carousel-card-title">
                        <Tooltip title={imgObj.title}>
                        <a href={imgObj.src} target="_blank">{imgObj.title}</a>
                        </Tooltip>
                    </p>
                    {/*<p className="carousel-card-desc" title={imgObj.description}>{imgObj.description}</p>*/}
                    <a className='mt8' href={imgObj.src} target="_blank">
                        <Button size='small' type='primary'>Shop Now</Button></a>
                </div>
            </Card>
        }
        return <div className="carousel-wrap">
            <div className="carousel-imgs-wrap">
                <span className={`carousel-prev-btn ${this_index === 0 ? "dn" : "db"}`}
                      onClick={this.handlePrev}></span>
                <ul className="carousel-imgs"
                    style={{width: `${imgs.length * 306 + 5}px`, marginLeft: `${marginLeft}px`}}>
                    {
                        imgs ? imgs.map((img, index) => {
                            if (img.images.length === 1) {
                                return <li key={img.url}
                                           className={`carousel-img-item ${index < this_index ? "carousel-img-item-left" : (index === this_index ? "" : "carousel-img-item-right")}`}
                                >
                                    <CarouselImg imgObj={{
                                        src: img.url,
                                        img: img.images[0].url,
                                        title: img.title,
                                        description: img.description
                                    }}/>
                                </li>
                            } else {
                                return <li key={img.url}
                                           className={`carousel-img-item ${index < this_index ? "carousel-img-item-left" : (index === this_index ? "" : "carousel-img-item-right")}`}
                                >
                                    <Carouse {...img} />
                                </li>
                            }
                        }) : null
                    }
                </ul>
                <span className={`carousel-next-btn ${this_index === imgs.length - 1 ? "dn" : "db"}`}
                      onClick={this.handleNext}></span>
            </div>
        </div>
    }
}