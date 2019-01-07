import React from 'react'
import {Form, DatePicker, Select, Input, Button, Spin, Table, message, Tabs} from 'antd'
import moment from 'moment';
import Util from '../../utils/utils'
import {websites} from "../../config/datas";
import axiosHttp from "../../utils/ajax";

import './index.less'
import RangePickerDemo from "../../components/RangePicker";

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;


class ConverStatis extends React.Component {
    state = {
        loading: false,
        dataListGoods: [],
        dataListTotal: [],
        goodsCategory: [],
        page_count: 0,
    };
    pageInfo = {
        "actionid": "1001",
        "ascend": "0",
        "date_start": moment().subtract(1, 'months'),
        "date_stop": moment(),
        "wid": "14",
        "sku": "",
        "sort": "goods_price", // goods_price,goods_count,paied_count,goods_count_rate,goods_value,paied_value,goods_value_rate
        "category": -1,
        "page_index": 1,
        "page_size": 20,
    };
    scrollY = 0;

    componentDidMount() {
        this.goodsCategoryCommonFun();
        this.getListDataCommonFun();
        this.scrollY = window.innerHeight - 60*3 - 56  - 98
    }

    goodsCategoryCommonFun = () => {
        const data = new FormData();
        data.append("json", JSON.stringify({
            actionid: "1000",
            noat: true
        }));
        axiosHttp('salesku/function', data).then((res) => {
            if (res.code === 200) {
                const dataTree = Util.listToTree(res.data.result);
                this.setState({
                    goodsCategory: dataTree
                })
            } else {
                message.error(res.msg)
            }
        })
    }
    sortCommonFun = (type, isSort) => {
        if (isSort) {
            this.pageInfo.sort = type;
            this.getListDataCommonFun();
        }
    }
    getListDataCommonFun = () => {
        this.setState({
            loading: true
        });
        if (this.pageInfo.category < -1) {
            delete this.pageInfo.category
        }
        const data = new FormData();
        // 1003
        this.pageInfo.date_start = this.pageInfo.date_start.format('YYYY-MM-DD');
        this.pageInfo.date_stop = this.pageInfo.date_stop.format('YYYY-MM-DD');
        data.append("json", JSON.stringify(this.pageInfo));
        const firstList = {
            goods_count: 0,
            goods_count_rate: 0,
            goods_name: "—",
            goods_price: '—',
            goods_sn: "",
            goods_value: 0,
            goods_value_rate: 0,
            category: '—',
            img: "",
            link: "",
            paied_count: 0,
            paied_value: 0
        };

        axiosHttp('salesku/function', data).then((res) => {
            if (res.code === 200) {
                // let {page_index, page_size, total, goods, page_count} = res.data.result && res.data.result[0];
                let {page_index, page_size, total = [], goods = [], page_count} = res.data.result[0];
                this.pageInfo.page_index = page_index;
                this.pageInfo.page_size = page_size;
                const obj = {...firstList, ...total[0]};
                this.setState({
                    loading: false,
                    dataListGoods: [obj].concat(goods),
                    dataListTotal: total,
                    page_count: page_count
                })
            } else {
                this.setState({
                    loading: false
                });
                message.error(res.msg)
            }
        })
    }

    columns() {
        return [
            {
                title: '商品图片',
                dataIndex: 'img',
                key: 'img',
                width: '8%',
                render: (text, record, index) => {
                    const {img, link} = record;
                    return (img ? <a href={link} target='_blank'><img className='thumbnailImg' src={img}
                                                                      alt='商品图片'/></a> : '总计'
                    )
                }
            },
            {
                title: '商品名称',
                dataIndex: 'goods_name',
                key: 'goods_name',
                width: '8%',
            },
            {
                title: 'SKU',
                dataIndex: 'goods_sn',
                key: 'goods_sn',
                width: '8%',
                render: (goods_sn) => goods_sn ? goods_sn : '—'
            },
            {
                title: 'SPU',
                dataIndex: 'goods_sn1',
                key: 'goods_sn1',
                width: '8%',
                render: (text, record, index) => record.goods_sn ? record.goods_sn.substring(0, record.goods_sn.length - 2) : '—'
            },
            {
                title: '分类名称',
                dataIndex: 'category',
                key: 'category',
                width: '8%',
            },
            {
                title: `单价($)`,
                dataIndex: 'goods_price',
                key: 'goods_price',
                width: '9%',
                filteredValue: this.pageInfo.sort === 'goods_price' ? ['goods_price'] : [],
                filterDropdownVisible: false,
                filters: [
                    {text: '', value: ''},
                ],
                onFilterDropdownVisibleChange: (visible) => {
                    this.sortCommonFun('goods_price', visible);
                },
            },
            {
                title: '商品总销量',
                dataIndex: 'goods_count',
                key: 'goods_count',
                width: '8%',
                filterDropdownVisible: false,
                filteredValue: this.pageInfo.sort === 'goods_count' ? ['goods_count'] : [],

                filters: [
                    {text: 'Joe', value: 'Joe'},
                ],
                onFilterDropdownVisibleChange: (visible) => {
                    this.sortCommonFun('goods_count', visible);
                },
            },
            {
                title: '付款商品量',
                dataIndex: 'paied_count',
                key: 'paied_count',
                width: '9%',
                filteredValue: this.pageInfo.sort === 'paied_count' ? ['paied_count'] : [],
                filterDropdownVisible: false,
                filters: [
                    {text: '', value: ''},
                ],
                onFilterDropdownVisibleChange: (visible) => {
                    this.sortCommonFun('paied_count', visible);
                },
            },
            {
                title: '付款率',
                dataIndex: 'goods_count_rate',
                key: 'goods_count_rate',
                width: '9%',
                filteredValue: this.pageInfo.sort === 'goods_count_rate' ? ['goods_count_rate'] : [],
                filterDropdownVisible: false,
                render: (text, record, index) => {
                    return text * 100 + '%'
                },
                filters: [
                    {text: '', value: ''},
                ],
                onFilterDropdownVisibleChange: (visible) => {
                    this.sortCommonFun('goods_count_rate', visible);
                },
            },
            {
                title: '商品总金额',
                dataIndex: 'goods_value',
                key: 'goods_value',
                width: '9%',
                filterDropdownVisible: false,
                filteredValue: this.pageInfo.sort === 'goods_value' ? ['goods_value'] : [],
                filters: [
                    {text: '', value: ''},
                ],
                onFilterDropdownVisibleChange: (visible) => {
                    this.sortCommonFun('goods_value', visible);
                },
            },
            {
                title: '付款商品金额',
                dataIndex: 'paied_value',
                key: 'paied_value',
                width: '9%',
                filterDropdownVisible: false,
                filteredValue: this.pageInfo.sort === 'paied_value' ? ['paied_value'] : [],
                filters: [
                    {text: '', value: ''},
                ],
                onFilterDropdownVisibleChange: (visible) => {
                    this.sortCommonFun('paied_value', visible);
                },
            },
            {
                title: '商品金额付款率',
                dataIndex: 'goods_value_rate',
                key: 'goods_value_rate',
                width: '9%',
                filteredValue: this.pageInfo.sort === 'goods_value_rate' ? ['goods_value_rate'] : [],
                filterDropdownVisible: false,
                render: (text, record, index) => {
                    return text > 0 ? text * 100 + '%' : 0
                },
                filters: [
                    {text: '', value: ''},
                ],
                onFilterDropdownVisibleChange: (visible) => {
                    this.sortCommonFun('goods_value_rate', visible);
                },
            },
        ]
    }

    turnPage = (page, pageSize) => {
        this.pageInfo.page_index = page;
        this.getListDataCommonFun();

    }
    handleSubmitFun = (type, dates) => { //提交时间
        this.pageInfo.date_start = dates[0];
        this.pageInfo.date_stop = dates[1]
    }
    _handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.pageInfo.sku = values.sku;
                this.pageInfo.wid = values.wid;
                this.pageInfo.category = values.category;
                this.getListDataCommonFun();
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {dataListGoods, goodsCategory, loading, page_count} = this.state;
        const {page_size, page_index} = this.pageInfo;
        const style = {
            width_120: {width: 120},
            scroll: {y: this.scrollY, x: 1340}
        }
        return (
            <div className="">
                <Tabs type="card">
                    <TabPane tab="SKU转化统计" key="1">
                        <div className='mb10'>
                            <Form layout="inline" onSubmit={this._handleSubmit}>
                                <FormItem label="时间">
                                    {getFieldDecorator('rangePicker', {})(
                                        <RangePickerDemo interval={1} type='start' handleSubmit={this.handleSubmitFun}/>
                                    )}
                                </FormItem>
                                <FormItem label="网站">
                                    {getFieldDecorator('wid', {
                                        initialValue: websites[0].id,
                                    })(
                                        <Select style={style.width_120}>
                                            {
                                                websites.map((item) => {
                                                    return (
                                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                {/*label="关键字"*/}
                                <FormItem label="商品分类">
                                    {
                                        getFieldDecorator('category', {
                                            initialValue: '-2',
                                        })(
                                            <Select style={style.width_120}>
                                                <Option key='全部' value='-2'>全部</Option>
                                                {
                                                    goodsCategory.map((item) => {
                                                        return (
                                                            <Option key={item.cat_id}
                                                                    value={item.cat_id}>{item.cat_name}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                                <FormItem>
                                    {
                                        getFieldDecorator('sku', {
                                            initialValue: '',
                                        })(
                                            <Input type="text" placeholder='输入SKU/SPU'/>
                                        )
                                    }
                                </FormItem>
                                <FormItem>
                                    <Button htmlType='submit'>查询</Button>
                                </FormItem>
                            </Form>
                        </div>
                        <div>
                            <Spin spinning={loading}>
                                <Table rowKey="link" className='table-wrap'
                                       dataSource={dataListGoods}
                                       columns={this.columns()}
                                       pagination={dataListGoods.length > 0 && {
                                           showQuickJumper: true,
                                           total: page_count * page_size,
                                           pageSize: page_size + 1,
                                           current: page_index,
                                           onChange: this.turnPage,
                                       }}
                                    scroll={style.scroll}
                                       // scroll={{y: 650, x: 1340}}
                                />
                            </Spin>
                        </div>
                    </TabPane>
                    {/*<TabPane tab="广告采集" key="2"></TabPane>*/}
                </Tabs>
            </div>
        );
    }
}

export default Form.create()(ConverStatis)
