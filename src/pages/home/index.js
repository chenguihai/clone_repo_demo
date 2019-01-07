import React, {Component} from "react";
import {Layout, message, Spin} from "antd";
import AdvertUtils from "./subPage/AdvertUtils";
import AdvertFalls from "./subPage/AdvertFalls";
// import AdvertFalls from "./subPage/AdvertFalls1";
// import AdvertFalls from "./subPage/AdvertFalls2";
import moment from "moment";
import Header from "../../components/Header";
import axiosHttp from "../../utils/ajax";
import '../../style/common.less'
import "./index.less";

// const {Header, Sider, Content} = Layout;
const {Sider, Content} = Layout;

export default class Advert extends Component {
    state = {
        adverts: [],
        advertsPage: {},
        skip: 0,
        source: "fb_ads",
        pageNames: [],
        createTimeStart: moment().subtract(2, 'months').unix() * 1000,
        createTimeEnd: moment().unix() * 1000,
        updateTimeStart: moment().subtract(1, 'months').unix() * 1000,
        updateTimeEnd: moment().unix() * 1000,
        countryNos: [],
        adsTypes: [],
        bapp: 0,
        adsHasUrl: 0,
        keysWords: "",
        loading: false,
        isMax: false,

        FBAdsRange: {
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
        FBAdsStatus: [],
        FBAdsTypes: [],
        FBAdsPageNames: [],
        countryNo: [],
        limit: 100,
        // sort: {}
        leftWidth: 320,
        showAdvertsArr: [[], [], []],
        collapsed: true,
        changeFilterType:'change'
    }
    showAdverts = [];// 列表中显示的数据

    componentDidMount() {
        this.getAdverts();
        this.getConfigData();
        this.screenChange();
    }

    screenChange() {
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    resize = (type = 'collapsed') => { //屏幕大小改变的时候调用
        let offsetWidth = document.querySelector('body').offsetWidth;
        if (type === 'click') {
            this.showAdvertsCommonFun()
        } else {
            const flag = offsetWidth < 1317;
            this.setState({
                collapsed: !flag,
                leftWidth: flag ? 46 : 320,//1317屏幕的宽度
            }, () => {
                this.showAdvertsCommonFun();
            })
        }
    }
    showAdvertsCommonFun = () => { //获取列表展示的数据
        let offsetWidth = document.querySelector('body').offsetWidth;
        const {leftWidth} = this.state;
        var arr1 = [], arr2 = [], arr3 = [];
        let showAdverts = this.showAdverts;
        if (offsetWidth >= 454 * 3 + 90 + leftWidth) { //454*3+40+50
            arr1 = showAdverts.filter((ad, i) => i % 3 === 0);
            arr2 = showAdverts.filter((ad, i) => i % 3 === 1);
            arr3 = showAdverts.filter((ad, i) => i % 3 === 2);
        } else if (offsetWidth >= 454 * 2 + 90 + leftWidth) {
            arr1 = showAdverts.filter((ad, i) => i % 2 === 0);
            arr2 = showAdverts.filter((ad, i) => i % 2 === 1);
        } else {
            arr1 = showAdverts;
        }
        this.setState({
            showAdvertsArr: [arr1, arr2, arr3]
        })
    }

    filterDataFun = () => { //下一页的函数
        const {adverts, skip} = this.state;
        console.log('skip==', skip);
        this.showAdverts = adverts.filter((item, index) => {
            return index > skip - 1 && index < skip + 20;
        });
        // this.resize();
        this.showAdvertsCommonFun();
    }
    previousPageFun = () => { //上一页的函数
        const {skip} = this.state;
        this.setState({
            skip: skip > 0 ? skip - 20 : 0,
            showAdvertsArr: [[], [], []],
        }, () => {
            this.filterDataFun();
        })
    }

    changePage = () => { //加载更多
        this.setState({
            skip: this.state.skip + 20,
            showAdvertsArr: [[], [], []],
            changeFilterType:''
        }, () => {
            if (this.state.skip === this.state.adverts.length) {
                this.getAdverts();
            } else {
                this.filterDataFun();
            }
        });
    }
    getAdverts = () => { //获取列表内容
        const {isMax, loading} = this.state;
        if (!isMax && !loading) {
            this.setState({
                loading: true,
            });
            this.httpCommonFun();
        }
    }
    httpCommonFun = () => { //http发送请求
        const {like, comment, share, reaction} = this.state.FBAdsRange;

        const {
            source, createTimeStart, createTimeEnd, updateTimeStart, updateTimeEnd, pageNames, countryNos, adsTypes, likeCountStart, likeCountEnd
            , commentCountStart, commentCountEnd, shareCountStart, shareCountEnd, reactionCountStart, reactionCountEnd, bapp, sort, skip, keysWords, adsHasUrl, limit
        } = this.state;
        let params = {
            source: source,
            createTimeStart: createTimeStart,
            createTimeEnd: createTimeEnd,
            updateTimeStart: updateTimeStart,
            updateTimeEnd: updateTimeEnd,
            pageNames: pageNames.length ? pageNames : undefined,
            countryNos: countryNos.length ? countryNos : undefined,
            adsTypes: adsTypes.length ? adsTypes : undefined,
            likeCountStart: likeCountStart,
            likeCountEnd: likeCountEnd === like.end ? undefined : likeCountEnd,
            commentCountStart: commentCountStart,
            commentCountEnd: commentCountEnd === comment.end ? undefined : commentCountEnd,
            shareCountStart: shareCountStart,
            shareCountEnd: shareCountEnd === share.end ? undefined : shareCountEnd,
            reactionCountStart: reactionCountStart ? reactionCountStart : undefined,
            reactionCountEnd: reactionCountEnd === reaction.end ? undefined : reactionCountEnd,
            bapp: bapp,
            adsHasUrl: adsHasUrl,
            sort: sort || {},
            limit: limit,
            skip: skip,
            keysWords: keysWords.length ? keysWords : undefined,
        };
        axiosHttp('bsku_fbpost/list', params).then(this.getDataCommonFun);
    }
    getDataCommonFun = (res) => { //发送请求的回掉函数
        // alert('我运行了')
        if (res.code === 200) {
            const {result, page} = res.data;
            if (result.length !== 0) {
                this.setState({
                    // adverts: [...adverts, ...result],
                    adverts: this.state.adverts.concat(result),
                    advertsPage: page,
                    loading: false,
                }, () => {
                    this.filterDataFun();
                });
            } else {
                this.setState({
                    isMax: true,
                    loading: false,
                    adverts: [],
                    showAdvertsArr: [[], [], []],
                });
            }
        } else {
            this.setState({
                loading: false
            });
            message.error(res.msg);
        }
    }

    getConfigData = () => {
        axiosHttp('diction', '', 'GET').then(res => {
            if (res.code === 200) {
                let {FBAdsRange, FBAdsStatus, FBAdsTypes, FBAdsPageNames, countryNo, FBAdsHasUrl} = res.data;
                this.setState({
                    FBAdsRange: FBAdsRange.data,
                    FBAdsStatus: FBAdsStatus.data,
                    FBAdsTypes: FBAdsTypes.data,
                    FBAdsPageNames: FBAdsPageNames.data,
                    countryNo: countryNo.data,
                    FBAdsHasUrl: FBAdsHasUrl.data,
                });
            } else {
                message.error(res.msg);
            }
        });
    }

    changeFilter = (values) => {
        if (values) {
            this.setState({
                ...values,
                adverts: [],
                skip: 0,
                advertsPage: {},
                showAdvertsArr: [[], [], []],
                isMax: false,
                changeFilterType:'change'
            }, () => {
                this.getAdverts();
            });
        }
    }

    changSort = (sortStr) => {
        if (sortStr) {
            this.setState({
                sort: {
                    [sortStr]: (this.state.sort || {})[sortStr] != -1 ? -1 : 1
                },
                adverts: [],
                skip: 0,
                advertsPage: {},
                showAdvertsArr: [[], [], []],
                isMax: false,
                changeFilterType:'change'
            }, () => {
                this.getAdverts();
            });
        }
    }
    toggleCollapsed = (flag) => {
        this.setState({
            leftWidth: flag ? 46 : 320,
            collapsed: !flag
        }, () => {
            this.resize('click');
        })
    }

    render() {

        const {
            loading, FBAdsRange, FBAdsStatus, FBAdsTypes, FBAdsPageNames, countryNo, advertsPage, sort, isMax,
            FBAdsHasUrl, skip, leftWidth, showAdvertsArr, collapsed,adverts,changeFilterType
        } = this.state;
        // console.log('render =======home==========', showAdvertsArr);

        return <Layout className="content-wrapper">
            <Header/>
            <Spin spinning={loading}>
                <Layout className="content-main-wrapper">
                    <Sider className="content-main-side" width={leftWidth}>
                        <AdvertUtils changeFilter={this.changeFilter}
                                     toggleCollapsed={this.toggleCollapsed}
                                     collapsed={collapsed}
                                     FBAdsRange={FBAdsRange}
                                     FBAdsStatus={FBAdsStatus}
                                     FBAdsTypes={FBAdsTypes}
                                     FBAdsPageNames={FBAdsPageNames}
                                     countryNo={countryNo} FBAdsHasUrl={FBAdsHasUrl}/>
                    </Sider>
                    <Content className="content-main">
                        <AdvertFalls changePage={this.changePage}
                                     changSort={this.changSort}
                                     changeFilter={this.changeFilter}
                                     previousPageFun={this.previousPageFun}
                                     adverts={showAdvertsArr}
                                     length={adverts.length}
                                     skip={skip}
                                     changeFilterType={changeFilterType}
                                     advertsPage={advertsPage}
                                     sort={sort}
                                     isMax={isMax}
                        />
                    </Content>
                </Layout>
            </Spin>
        </Layout>
    }
}