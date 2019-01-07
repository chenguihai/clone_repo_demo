import React, {Component} from "react";
import {Row, Col, Select, Slider, Button, Icon} from "antd";
import moment from "moment";
import RangePickerDemo from '../../../components/RangePicker'

const Option = Select.Option;

const platData = [{
    key: "fb_ads",
    name: 'facebook'
}];

const isAppData = [{
    key: 0,
    name: "全部",
}, {
    key: 1,
    name: "是",
}, {
    key: 2,
    name: "不是",
}];

// const adStatusData = [{
//     key: 0,
//     name: "全部"
// }, {
//     key: 1,
//     name: "活动中"
// }, {
//     key: 2,
//     name: "关闭"
// }];

export default class AdvertUtils extends Component {
    state = {
        source: "fb_ads",
        pageNames: [],
        createTimeStart: moment().subtract(6, 'months'),
        createTimeEnd: moment(),
        updateTimeStart: moment().subtract(2, 'months'),
        updateTimeEnd: moment(),
        countryNos: [],
        adsTypes: [],
        bapp: 0,
        adsHasUrl: 0,
        adStatus: 0,
        like: [0, 10],
        share: [0, 10],
        comment: [0, 10],
        reaction: [0, 10],
        collapsed: true
    };
    key = '';
    value = [];
    count= 0;
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.FBAdsRange) !== JSON.stringify(this.props.FBAdsRange)) {
            this.updateRange(nextProps.FBAdsRange);
        }
    }

    updateRange = (rangeData) => {
        const {
            like = {
                start: 0,
                end: 100
            },
            comment = {
                start: 0,
                end: 100
            },
            share = {
                start: 0,
                end: 100
            },
            reaction = {
                start: 0,
                end: 100
            }
        } = rangeData || {};
        this.setState({
            like: [like.start, like.end],
            share: [share.start, share.end],
            comment: [comment.start, comment.end],
            reaction: [reaction.start, reaction.end]
        });
    }

    platChange = (value) => {
        this.setState({
            source: value
        }, () => {
            this.props.changeFilter({source: value});
        });
    }

    otherChange = (str, value) => {
        this.setState({
            [str]: value
        }, () => {
            this.props.changeFilter({[str]: value});
        });
    }

    sliderAfterChange = (value, key) => {
        if(this.count === 0){
            this.props.changeFilter({
                [`${key}CountStart`]: value[0],
                [`${key}CountEnd`]: value[1]
            });
            this.count =1;
        }
    }
    _handleBlur = () => {
        this.count = 1;
    }

    sliderChange = (value, key) => {
        this.key = key;
        this.value = value;
        this.count =0;
        this.setState({
            [key]: value
        });
    }

    // rangeDateChange = (str, dates = []) => {
    //     // let {updateTimeStart, updateTimeEnd} = this.state;
    //     if (dates.length === 0) {
    //         dates = [moment().subtract(7, 'days'), moment()];
    //     }
    //     this.setState({
    //         [`${str}TimeStart`]: dates[0],
    //         [`${str}TimeEnd`]: dates[1]
    //     }, () => {
    //         this.props.changeFilter({
    //             [`${str}TimeStart`]: dates[0].hour(0).minutes(0).second(0).unix() * 1000,
    //             [`${str}TimeEnd`]: dates[1].hour(23).minutes(59).second(59).unix() * 1000
    //         });
    //     });
    // }
    handleSubmitFun = (str,dates)=>{ //提交时间
        // console.log(str,dates);
        this.props.changeFilter({
            [`${str}TimeStart`]: dates[0].hour(0).minutes(0).second(0).unix() * 1000,
            [`${str}TimeEnd`]: dates[1].hour(23).minutes(59).second(59).unix() * 1000
        });
    }
    searchOther = (input, option) => {
        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    handleOptionFun = (FBAdsHasUrl) => {
        let adsHasUrlArr = [];
        try {
            for (let key in FBAdsHasUrl) {
                adsHasUrlArr.push(<Option key={FBAdsHasUrl[key].code}
                                          value={FBAdsHasUrl[key].code}>{FBAdsHasUrl[key].name}</Option>)

            }
            return adsHasUrlArr
        } finally {
            adsHasUrlArr = null;
        }

    }
    toggleCollapsed = () => {
        this.props.toggleCollapsed(this.props.collapsed);
    }

    render() {
        const {
            FBAdsRange = {
                like: {
                    start: 0,
                    end: 100
                },
                comment: {
                    start: 0,
                    end: 100
                },
                share: {
                    start: 0,
                    end: 100
                },
                reaction: {
                    start: 0,
                    end: 100
                }
            },
            FBAdsTypes = [],
            FBAdsPageNames = [],
            FBAdsHasUrl = [],
            countryNo = []
        } = this.props;

        const {like, share, comment, reaction, source, pageNames, createTimeStart, createTimeEnd, updateTimeStart, updateTimeEnd, countryNos, adsTypes, bapp, adsHasUrl} = this.state;
        const {collapsed} = this.props;
        return <div className="advert-filter-wrapper">
            <Button onClick={this.toggleCollapsed} style={{marginBottom: 16,fontSize:20,padding:'0 10px',marginLeft:10}}>
                <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'}/>
            </Button>
            {collapsed ? <div className='advert-utils-wrap' dir="rtl">
                <div dir="ltr">
                    <div className="advert-plat-filter">
                        <Select onChange={this.platChange} value={source}>
                            {
                                platData.map(item => <Option key={item.key} value={item.key}>平台：{item.name}</Option>)
                            }
                        </Select>
                    </div>
                    <p className="advert-other-title">广告筛选</p>
                    <div className="advert-other-filter">
                        <Row className="advert-other-item">
                            <Col span={5}>
                                <label>广告主</label>
                            </Col>
                            <Col offset={1} span={18} className='select-wrap'>
                                <Select mode="multiple" allowClear filterOption={this.searchOther} value={pageNames}
                                        placeholder='全部'
                                        onChange={value => this.otherChange("pageNames", value)}>
                                    {
                                        FBAdsPageNames.map(item => <Option key={item} value={item}>{item}</Option>)
                                    }
                                </Select>
                            </Col>
                        </Row>
                        <Row className="advert-other-item">
                            <Col span={5}>
                                <label>创建时间</label>
                            </Col>
                            <Col offset={1} span={18}>
                                {/*<RangePicker value={[createTimeStart, createTimeEnd]}*/}
                                             {/*onChange={dates => this.rangeDateChange("create", dates)}/>*/}
                                <RangePickerDemo interval={6} type='create' handleSubmit={this.handleSubmitFun}/>
                            </Col>
                        </Row>
                        <Row className="advert-other-item">
                            <Col span={5}>
                                <label>更新时间</label>
                            </Col>
                            <Col offset={1} span={18}>
                                {/*<RangePicker value={[updateTimeStart, updateTimeEnd]}*/}
                                             {/*onChange={dates => this.rangeDateChange("update", dates)}/>*/}
                                <RangePickerDemo interval={2} type='update' handleSubmit={this.handleSubmitFun}/>
                            </Col>
                        </Row>
                        {/* <Row className="advert-other-item">
                    <Col span={5}>
                        <label>广告状态</label>
                    </Col>
                    <Col offset={1} span={18}>
                        <Select value={adStatus} onChange={value => this.otherChange("adStatus", value)}>
                            {
                                adStatusData.map(item => <Option value={item.key}>{item.name}</Option>)
                            }
                        </Select>
                    </Col>
                </Row> */}
                        <Row className="advert-other-item">
                            <Col span={5}>
                                <label>国家</label>
                            </Col>
                            <Col offset={1} span={18} className='select-wrap'>
                                <Select mode="multiple" allowClear filterOption={this.searchOther}
                                        value={countryNos} onChange={value => this.otherChange("countryNos", value)}
                                        placeholder='全部'>
                                    {
                                        countryNo.map(item => <Option key={item.name}
                                                                      value={item.country}>{item.name}</Option>)
                                    }
                                </Select>
                            </Col>
                        </Row>
                        <Row className="advert-other-item">
                            <Col span={5}>
                                <label>点赞数</label>
                            </Col>
                            <Col offset={1} span={18}>
                                <Slider range
                                        min={FBAdsRange.like.start}
                                        max={FBAdsRange.like.end}
                                        value={like}
                                        tipFormatter={(value) => value === FBAdsRange.like.end ? `${FBAdsRange.like.end}+` : `${value}`}
                                        onAfterChange={value => this.sliderAfterChange(value, "like")}
                                        onBlur={this._handleBlur}
                                        onChange={value => this.sliderChange(value, "like")}
                                />
                                {/*<p className="slider-value">{like[1] === FBAdsRange.like.end ? (like[0] !== FBAdsRange.like.start ? `>= ${like[0]}` : `${like[0]} ~ ${like[1]}`) : `${like[0]} ~ ${like[1]}`}</p>*/}
                                <p className="slider-value">{`${like[0]} ~ ${like[1]}`}</p>
                            </Col>
                        </Row>
                        <Row className="advert-other-item">
                            <Col span={5}>
                                <label>总评论</label>
                            </Col>
                            <Col offset={1} span={18}>
                                <Slider range
                                        min={FBAdsRange.comment.start}
                                        max={FBAdsRange.comment.end}
                                        value={comment}
                                        tipFormatter={(value) => value === FBAdsRange.comment.end ? `${FBAdsRange.comment.end}+` : `${value}`}
                                        onAfterChange={value => this.sliderAfterChange(value, "comment")}
                                        onBlur={this._handleBlur}
                                        onChange={value => this.sliderChange(value, "comment")}/>
                                {/*<p className="slider-value">{comment[1] === FBAdsRange.comment.end ? (comment[0] !== FBAdsRange.comment.start ? `>= ${comment[0]}` : `${comment[0]} ~ ${comment[1]}`) : `${comment[0]} ~ ${comment[1]}`}</p>*/}
                                <p className="slider-value">{`${comment[0]} ~ ${comment[1]}`}</p>
                            </Col>
                        </Row>
                        <Row className="advert-other-item">
                            <Col span={5}>
                                <label>总分享</label>
                            </Col>
                            <Col offset={1} span={18}>
                                <Slider range
                                        min={FBAdsRange.share.start}
                                        max={FBAdsRange.share.end}
                                        value={share}
                                        tipFormatter={(value) => value === FBAdsRange.share.end ? `${FBAdsRange.share.end}+` : `${value}`}
                                        onAfterChange={value => this.sliderAfterChange(value, "share")}
                                        onBlur={this._handleBlur}
                                        onChange={value => this.sliderChange(value, "share")}/>
                                {/*<p className="slider-value">{share[1] === FBAdsRange.share.end ? (share[0] !== FBAdsRange.share.start ? `>= ${share[0]}` : `${share[0]} ~ ${share[1]}`) : `${share[0]} ~ ${share[1]}`}</p>*/}
                                <p className="slider-value">{`${share[0]} ~ ${share[1]}`}</p>
                            </Col>
                        </Row>
                        <Row className="advert-other-item" style={{marginBottom: '30px'}}>
                            <Col span={5}>
                                <label>参与用户</label>
                            </Col>
                            <Col offset={1} span={18}>
                                <Slider range
                                        min={FBAdsRange.reaction.start}
                                        max={FBAdsRange.reaction.end}
                                        value={reaction}
                                        tipFormatter={(value) => value === FBAdsRange.reaction.end ? `${FBAdsRange.reaction.end}+` : `${value}`}
                                        onAfterChange={value => this.sliderAfterChange(value, "reaction")}
                                        onBlur={this._handleBlur}
                                        onChange={value => this.sliderChange(value, "reaction")}/>
                                {/*<p className="slider-value">{reaction[1] === FBAdsRange.reaction.end ? (reaction[0] !== FBAdsRange.reaction.start ? `>= ${reaction[0]}` : `${reaction[0]} ~ ${reaction[1]}`) : `${reaction[0]} ~ ${reaction[1]}`}</p>*/}
                                <p className="slider-value">{`${reaction[0]} ~ ${reaction[1]}`}</p>
                            </Col>
                        </Row>
                        <Row className="advert-other-item">
                            <Col span={5}>
                                <label>广告类型</label>
                            </Col>
                            <Col offset={1} span={18} className='select-wrap'>
                                <Select mode="multiple" allowClear filterOption={this.searchOther} value={adsTypes}
                                        placeholder='全部'
                                        onChange={value => this.otherChange("adsTypes", value)}>
                                    {
                                        FBAdsTypes.map(item => <Option key={item} value={item}>{item}</Option>)
                                    }
                                </Select>
                            </Col>
                        </Row>
                        <Row className="advert-other-item">
                            <Col span={5}>
                                <label>App广告</label>
                            </Col>
                            <Col offset={1} span={18}>
                                <Select Select value={bapp} filterOption={this.searchOther}
                                        onChange={value => this.otherChange("bapp", value)}>
                                    {
                                        isAppData.map(item => <Option key={item.key}
                                                                      value={item.key}>{item.name}</Option>)
                                    }
                                </Select>
                            </Col>
                        </Row>
                        <Row className="advert-other-item">
                            <Col span={5}>
                                <label>商品链接</label>
                            </Col>
                            <Col offset={1} span={18}>
                                <Select Select value={adsHasUrl} filterOption={this.searchOther}
                                        onChange={value => this.otherChange("adsHasUrl", value)}>
                                    {
                                        this.handleOptionFun(FBAdsHasUrl)
                                    }
                                </Select>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div> : null}
        </div>
    }
}