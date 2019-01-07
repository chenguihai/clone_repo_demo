import React from 'react'
import {Form, Input, Button, Spin, Table, message, Tabs} from 'antd'
import axiosHttp from "../../utils/ajax";
import Util from '../../utils/utils'
import GoodsModal from './goodsModal'

import './index.less'

const FormItem = Form.Item;
const {TextArea} = Input;
const TabPane = Tabs.TabPane;


class GoodsPutaway extends React.Component {
    state = {
        listData: [],
        count: 0,
        loading: false,
        goodsModalFlag: false,
        skuId: '',
        type: 3
    };
    params = {
        page: 0,
        limit: 20,
        skus: []
    };
    scrollY= 0;

    componentDidMount() {
        this.saleskuListCommonFun();
        this.scrollY = window.innerHeight-60-56-98*2
    }

    saleskuListCommonFun = () => {
        this.setState({
            loading: true
        });
        axiosHttp('salesku/list', this.params).then((res) => {
            if (res.code === 200) {
                this.setState({
                    listData: res.data.saleskus,
                    count: res.data.count,
                    loading: false
                })
            } else {
                this.setState({
                    loading: false
                });
                message.error(res.msg)
            }
        })
    }
    showGoodsModalPopup = (skuId, type) => {
        this.setState({
            goodsModalFlag: true,
            skuId: skuId,
            type: type,
        })
    }
    cancelGoodsModalPopup = (flag) => {
        this.setState({
            goodsModalFlag: false
        })
        if (flag) {
            this.saleskuListCommonFun();
        }
    }

    columns() {
        return [
            {
                title: '商品图片',
                dataIndex: 'icon',
                key: 'icon',
                width: '20%',
                fiexed: 'center',
                render: (text, record, index) => {
                    return <a className="c-39A0AB" href={record.goods_url}
                              target="_blank"><img className='thumbnail' src={record.icon} alt='商品图片'/></a>;
                }
            },
            {
                title: '商品详情',
                dataIndex: 'goods_name',
                key: 'goods_name',
                width: '40%',
                render: (text, record, index) => {
                    const {prdId, sku, prdName, goods_url, orders, createDateTime, color, size} = record;
                    return (<div className="table-desc-box tl">
                            <p className="table-desc">
                                <span className="key">proID</span>
                                <span className="value">{prdId}</span>
                            </p>
                            <p className="table-desc">
                                <span className="key">SKU</span>
                                <span className="value">{sku}</span>
                            </p>
                            <p className="table-desc">
                                <span className="key">商品名称</span>
                                <span className="value">{prdName}</span>
                            </p>
                            {
                                color ? <p className="table-desc">
                                    <span className="key">颜色</span>
                                    <span className="value">{color}</span>
                                </p> : ""
                            }
                            {
                                size ? <p className="table-desc">
                                    <span className="key">尺寸</span>
                                    <span className="value">{size}</span>
                                </p> : ""
                            }
                            <p className="table-desc">
                                <span className="key">商品链接</span>
                                <span className="value"><a className="c-39A0AB" href={goods_url}
                                                           target="_blank">{goods_url}</a></span>
                            </p>
                            <p className="table-desc">
                                <span className="key">商品数</span>
                                <span className="value">{orders}</span>
                            </p>
                            <p className="table-desc">
                                <span className="key">更新时间</span>
                                <span className="value">{Util.timeFormat(createDateTime * 1000)}</span>
                            </p>
                        </div>
                    )
                }
            },
            {
                title: '同款货源',
                dataIndex: 'updatedDateTime',
                key: 'updatedDateTime',
                width: '20%',
                render: (text, record, index) => {
                    const {sourceCount, updatedDateTime} = record;
                    return (
                        <div className="table-desc-box tl">
                            <p className="table-desc">
                                <span className="key">货源数</span>
                                <span className="value pointer c-39A0AB"
                                      onClick={this.showGoodsModalPopup.bind(this, record._id, 3)}>{sourceCount}</span>
                            </p>
                            <p className="table-desc">
                                <span className="key">更新时间</span>
                                <span className="value">{Util.timeFormat(updatedDateTime * 1000)}</span>
                            </p>
                        </div>
                    )
                }
            },
            {
                title: '同款货源匹配度',
                dataIndex: 'goods_sn1',
                key: 'goods_sn1',
                width: '20%',
                render: (text, record, index) => {
                    const mathRound = (value) => {
                        return Math.round(value * 10000) / 100
                    }
                    const {point, hash100, hash90, errCount, sourceCount} = record;
                    return (
                        <div className="table-desc-box tl">
                            <p className="table-desc">
                                <span className="key last">点阵匹配</span>
                                <span onClick={this.showGoodsModalPopup.bind(this, record._id, 2)}
                                      className="value pointer c-39A0AB">{!!point ? `${point}(${mathRound(point / sourceCount)}%)` : ""}</span>
                            </p>
                            <p className="table-desc">
                                <span className="key last">绝对匹配</span>
                                <span onClick={this.showGoodsModalPopup.bind(this, record._id, 0)}
                                      className="value pointer c-39A0AB">{!!hash100 ? `${hash100}(${mathRound(hash100 / sourceCount)}%)` : ""}</span>
                            </p>
                            <p className="table-desc">
                                <span className="key last">90%以上哈希匹配</span>
                                <span onClick={this.showGoodsModalPopup.bind(this, record._id, 1)}
                                      className="value pointer c-39A0AB">{!!hash90 ? `${hash90}(${mathRound(hash90 / sourceCount)}%)` : ""}</span>
                            </p>
                            <p className="table-desc">
                                <span className="key last">非同款标识</span>
                                <span onClick={this.showGoodsModalPopup.bind(this, record._id, 4)}
                                      className="value pointer c-39A0AB">{!!errCount ? `${errCount}(${mathRound(errCount / sourceCount)}%)` : ""}</span>
                            </p>
                        </div>
                    )
                }
            },
        ]
    }

    _handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values && values.sku.length > 0) {
                    this.params.skus = values.sku.match(/\d+/g);
                } else {
                    this.params.skus = [];
                }
                this.params.page = 0;
                this.saleskuListCommonFun();

            }
        });
    };
    turnPage = (page, pageSize) => {
        this.params.page = page - 1;
        this.saleskuListCommonFun();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {listData, count, loading, goodsModalFlag, skuId, type} = this.state;
        const  style = {
            width_400: {width: 400},
            scroll: {x: 1400, y: this.scrollY}
        }
        return (
            <div className='h_percent100' id='goodsPutawayId'>
                <Tabs type="card" className='h_percent100'>
                    <TabPane tab="已出单" key="1" className='ant-tabs-top-content'>
                        <div className='mb10'>
                            <Form layout="inline">
                                <FormItem label="导入SKU">
                                    {getFieldDecorator('sku', {})(
                                        <TextArea placeholder="输入格式：以逗号、分号、空格或换行分隔SKU" style={style.width_400}/>
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button onClick={this._handleSubmit}>查询</Button>
                                </FormItem>
                            </Form>
                        </div>
                        <Spin spinning={loading}>
                            <Table rowKey="_id" className='table-wrap text-align'
                                   dataSource={listData}
                                   columns={this.columns()}
                                   pagination={listData.length > 0 && {
                                       showQuickJumper: true,
                                       total: count,
                                       pageSize: this.params.limit,
                                       current: this.params.page + 1,
                                       onChange: this.turnPage,
                                   }}
                                   // scroll={{x: 1400, y: 650}}
                                   scroll={{x: 1400,y:this.scrollY}}
                            />
                        </Spin>
                    </TabPane>
                    {/*<TabPane tab="广告采集" key="2"></TabPane>*/}
                </Tabs>
                {goodsModalFlag ?
                    <GoodsModal skuId={skuId} type={type} cancelPopup={this.cancelGoodsModalPopup}/> : null}
            </div>
        );
    }
}

export default Form.create()(GoodsPutaway)
