import React, {Component} from "react";
import {Button, Card, Col, Icon, Input, Row} from "antd";
import XCarousel from "./XCarousel";
import {countryNo} from "../../../config/advertBaseData";

const {Search} = Input;

class Advert extends Component {

    formatDate = (formatStr, timestamp = 0) => {
        let date = new Date(timestamp || new Date().getTime());
        let M = date.getMonth() + 1;

        let Y = date.getFullYear();

        let D = date.getDate();
        let getHours = date.getHours();
        let getMinutes = date.getMinutes();
        let getSeconds = date.getSeconds();
        let h = getHours < 10 ? "0" + getHours : getHours;
        let m = getMinutes < 10 ? "0" + getMinutes : getMinutes;
        let s = getSeconds < 10 ? "0" + getSeconds : getSeconds;

        return formatStr.replace("M", M).replace("Y", Y).replace("D", D).replace("h", h).replace("m", m).replace("s", s);
    }

    render() {
        const {
            icon = '/assets/u30.png',
            ad_type,
            ads,
            created_time,
            message,
            ondate,
            origin,
            page_name,
            video_url,
            count,
            bapp = false,
            country = [],
            _id
        } = this.props;
        const {
            ondate: count_ondate = 0,
            like = {
                count: 0
            },
            comments = {
                count: 0
            },
            reactions = {
                count: 0
            },
            shares = {
                count: 0
            },
        } = count || {};
        // const countryName = (countryNo.find(ct => ct.country == country[0]) || {name: ""}).name;
        const countryName = countryNo.filter(item => item.country === country[0]);
        const countryAdrr = countryName.length ? countryName[0].name : "";
        return <Card className="water-falls-item">
            <Row className="water-falls-item-head">
                <Col span={4} className="title-icon">
                    <img src={icon}/>
                </Col>
                <Col span={16} className="title-main">
                    <p className="title-name">{page_name}{bapp ? <span className="title-ident">App广告</span> : ""}</p>
                    <p className="title-time">创建时间：{this.formatDate("Y-M-D h:m", created_time)}</p>
                    <div className='c-fff'>{_id}</div>
                </Col>
                <Col span={4} className="title-btns">
                    <Icon type="heart" className="title-btn"/>
                    {/*dangerouslySetInnerHTML={{__html: transmitIcon}}*/}
                    <a href={origin} target="_blank" className="title-btn"
                       title="访问原帖链接">
                        {/*<img src="/assets/transmit.svg" alt="跳转"/>*/}
                        <span className='anticon_pickgoods anticon-jump'></span>
                    </a>
                </Col>
            </Row>
            <div className="water-falls-item-content">
                <Row className="item-content-desc">
                    <Col span={24}>
                        <p className="item-content-desc-text">{message}</p>
                    </Col>
                    {/* <Col span={6} style={{ position: "absolute", bottom: "10px", left: "75%" }}>
                        <a className="item-content-desc-btn">S ee More</a>
                    </Col> */}
                </Row>
                <div className="item-content-main">
                    {ad_type === "image" && (ads[0].images[0].url ? <div className='single-wrap'>
                        <img className='single-img' src={ads[0].images[0].url} alt="图片"/>
                        <div className={`single-content  ${ads[0].url ? 'db' : 'dn'}`}>
                            {/*<span className="single-wrap-title">查看商品</span>*/}
                            <a href={ads[0].url} target="_blank">
                                <Button size='small' type='primary'>Shop Now</Button>
                            </a>
                        </div>
                    </div> : <p className="no-data-text">未加载到数据！</p>)}
                    {ad_type === "carousel" && <XCarousel key={_id} imgs={ads}/>}
                    {(ad_type === "video" || ad_type === 'story') && (video_url ?
                        <Card className="carouse-card" style={{border: 'none'}}>
                            <video controls muted="1" preload="auto" src={video_url}>你的浏览器不支持 <code>video</code> 标签.
                            </video>
                            {ads[0].url ? <div className="video-btn-box">
                                {/*<p className="carousel-card-title" title={imgObj.title}><a href={imgObj.src} target="_blank">{imgObj.title}</a></p>*/}
                                {/*href={imgObj.src}*/}
                                <a href={ads[0].url} target="_blank">
                                    <Button size='small' type='primary'>Shop Now</Button>
                                </a>
                            </div> : null}
                        </Card> : <p className="no-data-text">未加载到数据！</p>)}
                    {ad_type !== "image" && ad_type !== 'carousel' && ad_type !== "video" && ad_type !== 'story' ?
                        <p className="no-data-text">未加载到数据！</p> : null}
                </div>
            </div>
            <Row className="water-falls-item-foot">
                <Col span={3} title={`点赞数, 更新时间：${this.formatDate("Y-M-D h:m", count_ondate)}`}>
                    <Icon type="like"/>
                    {like.count}
                </Col>
                <Col span={3} title={`评论数, 更新时间：${this.formatDate("Y-M-D h:m", count_ondate)}`}>
                    <Icon type="message"/>
                    {comments.count}
                </Col>
                <Col span={3} title={`用户参与数, 更新时间：${this.formatDate("Y-M-D h:m", count_ondate)}`}>
                    <Icon type="user"/>
                    {reactions.count}
                </Col>
                <Col span={3} title={`转发数, 更新时间：${this.formatDate("Y-M-D h:m", count_ondate)}`}>
                    <Icon type='share-alt'/>
                    {shares.count}
                </Col>
                <Col span={6} className="water-falls-item-foot-text" title={countryAdrr}
                     style={{textAlign: "right", padding: "0 5px"}}>
                    <Icon type="environment"/>{countryAdrr}
                </Col>
                <Col span={6} className="water-falls-item-foot-text" title={this.formatDate("Y-M-D h:m", ondate)}>|
                    更新时间：{this.formatDate("Y-M-D h:m", ondate)}</Col>
            </Row>
        </Card>
    }
}

export default class AdvertFalls extends Component {
    /**
     * @type {{heightSkip: number, contentHeight: number, clientHeight: number, clientHeightData: Array, scrollTop: number, selfFlag: boolean, scrollType: string, count: number}}
     * 1. heightSkip   相当于页数，用于判断是否点击更多
     * 2.contentHeight 整个滚动容器的高度
     * 3.clientHeight 显示滚动视图的高度
     * 4. clientHeightData 保存所有页面的高度的数组
     * 5.scrollTop  用于判断是滚动的方向
     * 6.selfFlag 用于只执行一次
     * 7.scrollType 用于判断执行那个操作内容
     * 8.count   用于记录当前页面的下标
     */
    advertObj = {
        heightSkip: 0,
        contentHeight: 0,
        clientHeight: 0,
        clientHeightData: [],
        scrollTop: 0,
        selfFlag: false,
        scrollType: 'down',
        count: 1,
    };

    componentDidUpdate() {
        const {adverts,changeFilterType,skip} = this.props;
        if (adverts[0].length) {
            if (changeFilterType === 'change') {
                this.advertObj = {
                    heightSkip: 0,
                    contentHeight: 0,
                    clientHeight: 0,
                    clientHeightData: [],
                    scrollTop: 0,
                    selfFlag: false,
                    scrollType: 'down',
                    count: 1,
                };
                this.refs.emptyWrap.style.height = '0px';
                this.refs.scrollWrap.scrollTop = 0;
                this.refs.emptFooteryWrap.style.height = '0px';
            } else {
                let that = this.advertObj;
                if (that.clientHeightData.length) {
                    if (that.scrollType === 'down') {
                        if (skip > that.heightSkip) { //点击更多
                            let emptyWrap = this.sum(that.clientHeightData);
                            this.refs.emptyWrap.style.height = emptyWrap + 'px';
                            this.refs.scrollWrap.scrollTop = emptyWrap;
                            if (skip > that.heightSkip) {
                                that.heightSkip = skip;
                            }
                            that.selfFlag = false;
                        } else {  //向下滚动
                            let emptyWrap = this.sum(that.clientHeightData.filter((item, index) => index < that.count - 1));
                            let emptyFooterWrap = this.sum(that.clientHeightData.filter((item, index) => index > that.count - 1));
                            this.refs.emptyWrap.style.height = emptyWrap + 'px';
                            this.refs.scrollWrap.scrollTop = emptyWrap;
                            this.refs.emptFooteryWrap.style.height = emptyFooterWrap + 'px';
                            that.selfFlag = false;
                        }
                    } else { //向上滚动
                        let emptyWrap = this.sum(that.clientHeightData.filter((item, index) => index < that.count - 1));
                        let emptyFooterWrap = this.sum(that.clientHeightData.filter((item, index) => index > that.count - 1));
                        this.refs.emptyWrap.style.height = emptyWrap + 'px';
                        this.refs.scrollWrap.scrollTop = that.contentHeight - emptyFooterWrap - that.clientHeight;
                        this.refs.emptFooteryWrap.style.height = emptyFooterWrap + 'px';
                        that.selfFlag = false;
                    }
                }
            }
        }
    }

    sum = (arr) => {
        var len = arr.length;
        if (len === 0) {
            return 0;
        } else if (len === 1) {
            return arr[0];
        } else {
            return arr[0] + this.sum(arr.slice(1));
        }
    }
    /**
     * clientHeight：包括padding但不包括border、水平滚动条、margin的元素的高度。对于inline的元素这个属性一直是0，单位px，只读元素。
     * offsetHeight：包括padding、border、水平滚动条，但不包括margin的元素的高度。对于inline的元素这个属性一直是0，单位px，只读元素。
     * offsetTop: 当前元素顶部距离最近父元素顶部的距离,和有没有滚动条没有关系。单位px，只读元素。
     * scrollTop: 代表在有滚动条时，滚动条向下滚动的距离也就是元素顶部被遮住部分的高度。在没有滚动条时scrollTop==0恒成立。单位px，可读可设置。
     * offsetTop: 当前元素顶部距离最近父元素顶部的距离,和有没有滚动条没有关系。单位px，只读元素。
     */
    handleScroll = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        let that = this.advertObj;
        const {adverts,skip} = this.props;
        if (adverts[0].length && that.selfFlag === false) {
            const {scrollTop, scrollHeight, clientHeight} = evt.target;
            let waterFalls = this.refs.waterFalls;
            if (that.scrollTop > scrollTop) { //向上滚动
                if (!that.selfFlag && that.count > 1 && scrollTop < waterFalls.offsetTop) {
                    that.selfFlag = true;
                    that.clientHeight = clientHeight;
                    if (skip > 0) {
                        that.scrollType = 'up';
                        that.count -= 1;
                        this.props.previousPageFun();
                    }
                }
            } else { //向下滚动
                if (scrollHeight > that.contentHeight) {
                    that.clientHeightData.push(waterFalls.clientHeight);
                    that.contentHeight = this.sum(that.clientHeightData);
                }
                if (that.contentHeight > scrollTop + clientHeight && scrollTop + clientHeight > waterFalls.offsetTop + waterFalls.clientHeight) {
                    if (skip < that.heightSkip) {
                        that.selfFlag = true;
                        this.handleFChangePage();
                    }
                }
            }
            that.scrollTop = scrollTop;
        }
    }
    handleFChangePage = () => {
        let that = this.advertObj;
        that.scrollType = 'down';
        that.count += 1;
        this.props.changePage();
    }

    render() {
        const {
            sort = {
                like: 0,
                comment: 0,
                share: 0,
                reaction: 0,
                created_time: 0,
                ondate: 0,
            }, isMax, advertsPage, adverts, skip
        } = this.props;
        // console.log('render =========AdvertFall========',this.props.skip);

        return <div className="water-falls-wrapper">
            <div className="water-falls-tool">
                <Row>
                    <Col lg={24} xl={14} xxl={13}>
                        <ul className="water-falls-sort ">
                            <li className={`water-falls-sort-item ${sort.like == 1 ? "order-asc" : (sort.like == -1 ? "order-desc" : "")}`}
                                onClick={() => this.props.changSort("like")}>
                                点赞数
                            </li>
                            <li className={`water-falls-sort-item ${sort.comment == 1 ? "order-asc" : (sort.comment == -1 ? "order-desc" : "")}`}
                                onClick={() => this.props.changSort("comment")}>
                                评论数
                            </li>
                            <li className={`water-falls-sort-item ${sort.share == 1 ? "order-asc" : (sort.share == -1 ? "order-desc" : "")}`}
                                onClick={() => this.props.changSort("share")}>
                                分享数
                            </li>
                            <li className={`water-falls-sort-item ${sort.reaction == 1 ? "order-asc" : (sort.reaction == -1 ? "order-desc" : "")}`}
                                onClick={() => this.props.changSort("reaction")}>
                                参与用户
                            </li>
                            <li className={`water-falls-sort-item ${sort.created_time == 1 ? "order-asc" : (sort.created_time == -1 ? "order-desc" : "")}`}
                                onClick={() => this.props.changSort("created_time")}>
                                创建时间
                            </li>
                            <li className={`water-falls-sort-item ${sort.ondate == 1 ? "order-asc" : (sort.ondate == -1 ? "order-desc" : "")}`}
                                onClick={() => this.props.changSort("ondate")}>
                                更新时间
                            </li>
                        </ul>
                    </Col>
                    <Col lg={24} xl={10} xxl={11} className='tr'>
                        <Search className="water-falls-search" placeholder="内容关键词/url"
                                onSearch={value => this.props.changeFilter({
                                    keysWords: value
                                })}/>
                        <span className='mr30'>共{advertsPage.count || 0}则广告</span>
                    </Col>
                </Row>
            </div>

            <div className="water-falls-scroll" id='scrollWrap' ref='scrollWrap' onScroll={this.handleScroll}>
                <div ref='emptyWrap'></div>
                <div ref='waterFalls'>
                    {adverts[0].length ?
                        <div className="water-falls" id='waterFalls'>
                            {adverts[0].length ? <div style={{minWidth: 454}} className="water-falls-line">
                                {
                                    adverts[0].map(advert => <Advert key={advert._id} {...advert} />)
                                }
                            </div> : null
                            }
                            {adverts[1].length ? <div style={{minWidth: 454}} className="water-falls-line">
                                {
                                    adverts[1].map(advert => <Advert key={advert._id} {...advert} />)
                                }
                            </div> : null
                            }
                            {adverts[2].length ? <div style={{minWidth: 454}} className="water-falls-line">
                                {
                                    adverts[2].map(advert => <Advert key={advert._id} {...advert} />)
                                }
                            </div> : null
                            }
                        </div>
                        : <p className="no-data-text">未加载到数据！</p>
                    }
                    {
                        adverts[0].length && skip + 20 < advertsPage.count && !isMax ? <div className="water-falls-btn">
                            {/*<Button onClick={this.props.changePage}>加载更多</Button>*/}
                            <Button onClick={this.handleFChangePage}>加载更多</Button>
                        </div> : ""
                    }
                    {/*{*/}
                    {/*adverts[0].length && skip + 20 < advertsPage.count && !isMax ? <div className="water-falls-btn">*/}
                    {/*/!*<Button onClick={this.props.changePage}>加载更多</Button>*!/*/}
                    {/*<Button onClick={this.handleFChangePage}>加载更多</Button>*/}
                    {/*</div> : ""*/}
                    {/*}*/}
                </div>
                <div id='emptFooteryWrap' ref='emptFooteryWrap'></div>
            </div>
        </div>
    }
}