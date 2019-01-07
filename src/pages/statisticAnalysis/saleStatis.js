import React from 'react'
import {Button, Form, Select, message, Spin, Tabs} from 'antd';
import moment from 'moment';
import {websites} from "../../config/datas";
import './index.less'
import ReactEcharts from "echarts-for-react";
// 引入饼图和折线图
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import axiosHttp from "../../utils/ajax";
import RangePickerDemo from "../../components/RangePicker";

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class SaleStatis extends React.Component {
    state = {
        loading: false,
        saleChart: {},
        resData: {},
    }
    pageInfo = {
        actionid: "1002",
        type: 0,
        wid: -1,
        date_start: moment().subtract(1, 'months'),
        date_stop: moment(),
    }

    componentDidMount() {
        this.getSaleStatisList()
    }

    _handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.pageInfo.type = values.type;
                this.pageInfo.wid = values.wid;
                this.getSaleStatisList();
            }
        });
    }
    handleSubmitFun = (type, dates) => { //提交时间
        this.pageInfo.date_start = dates[0];
        this.pageInfo.date_stop = dates[1]
    }
    getSaleStatisList = () => {
        let {date_start,date_stop,wid} = this.pageInfo;
        this.setState({
            loading: true
        })
        if (wid < 1) {
            delete this.pageInfo.wid
        }
        const data = new FormData();
        this.pageInfo.date_start = date_start.format('YYYY-MM-DD');
        this.pageInfo.date_stop = date_stop.format('YYYY-MM-DD');
        data.append("json", JSON.stringify(this.pageInfo));
        axiosHttp('salesku/Function', data).then((res) => {
            let saleDate = [], allCount = [], paiedCount = [], allValue = [], paiedValue = [];
            if (res.code === 200) {
                const resData = res.data.result[0] || {};
                // const {days = [], all_count = 0, paied_count = 0, all_value = 0, paied_value = 0} = resData;
                const {days = []} = resData;
                saleDate = days.map(item => item.sales_date);
                allCount = days.map(item => item.all_count);
                paiedCount = days.map(item => item.paied_count);
                allValue = days.map(item => item.all_value);
                paiedValue = days.map(item => item.paied_value);
                const goods = this.pageInfo.type == '0';
                let saleChart = {
                    xAxis: {
                        data: saleDate
                    },
                    legend: {
                        data: goods ? ["商品量", "付款商品量", "商品总额", "付款商品总额"] : ["订单量", "付款订单量", "订单总额", "付款订单总额"],
                        bottom: "0px"
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#283b56'
                            }
                        }
                    },
                    color: ['#41b7c3', '#96d7de', '#cf7f85', '#adb9ca'],
                    yAxis: [{
                        type: 'value',
                        name: goods ? '商品量' : "订单量",
                        max: 'dataMax',
                        min: 0
                    },
                        {
                            type: 'value',
                            name: goods ? '商品金额($)' : "订单金额($)",
                            max: 'dataMax',
                            min: 0
                        }],
                    series: [
                        {
                            name: goods ? '商品量' : '订单量',
                            type: 'bar',
                            data: allCount
                        }, {
                            name: goods ? '付款商品量' : '付款订单量',
                            type: 'bar',
                            data: paiedCount
                        }, {
                            name: goods ? '商品总额' : '订单总额',
                            type: 'line',
                            yAxisIndex: 1,
                            data: allValue
                        }, {
                            name: goods ? '付款商品总额' : '付款订单总额',
                            type: 'line',
                            yAxisIndex: 1,
                            data: paiedValue
                        }
                    ]
                };
                this.setState({
                    saleChart,
                    loading: false,
                    resData: res.data.result[0] || {}
                })
            } else {
                this.setState({
                    loading: false
                })
                message.error(res.msg)
            }
        })
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const {saleChart, resData, loading} = this.state;
        const {all_count = 0, paied_count = 0, all_value = 0, paied_value = 0} = resData;
        const goods = this.pageInfo.type == "0";
        const style = {
            width_120: {width: 120},
            height_500: {height: 500},
        }
        return (
            <Tabs type="card" className='h_percent100 calc_150'>
                <TabPane tab="总体销量统计" key="1" className='ant-tabs-top-content'>
                    <div className="h_percent100">
                        <div className='mb20'>
                            <Form layout="inline" onSubmit={this._handleSubmit}>
                                <FormItem label="时间">
                                    {getFieldDecorator('rangePicker', {})(
                                        <RangePickerDemo interval={1} type='start' handleSubmit={this.handleSubmitFun}/>
                                    )}
                                </FormItem>
                                <FormItem label="网站">
                                    {getFieldDecorator('wid', {
                                        initialValue: '-1',
                                    })(
                                        <Select style={style.width_120}>
                                            <Option key='全部' value="-1">全部</Option>
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
                                <FormItem label="统计类型">
                                    {
                                        getFieldDecorator('type', {
                                            initialValue: '0',
                                        })(
                                            <Select style={style.width_120}>
                                                <Option value="0">商品</Option>
                                                <Option value="1">订单</Option>
                                            </Select>
                                        )
                                    }
                                </FormItem>
                                <FormItem>
                                    <Button htmlType="submit">查询</Button>
                                </FormItem>
                            </Form>
                        </div>
                        <div className='tc mb10'>
                            <span className="statis-total-title">{goods ? "商品" : "订单"}量</span> <span
                            className="statis-total-value">{all_count}</span> &nbsp;
                            <span className="statis-total-title">付款{goods ? "商品" : "订单"}</span> <span
                            className="statis-total-value">{paied_count}</span> &nbsp;
                            <span className="statis-total-title ml40">{goods ? "商品" : "订单"}总额</span>
                            <span
                                className="statis-total-value">${all_value}</span> &nbsp;
                            <span className="statis-total-title">付款总额</span> <span
                            className="statis-total-value">${paied_value}</span>
                        </div>
                        <Spin spinning={loading} className='h_percent100'>
                            <ReactEcharts option={saleChart} theme="Imooc"
                                          className='h_percent100' notMerge={true}
                                          lazyUpdate={true}
                                          style={style.height_500}/>
                        </Spin>
                    </div>
                </TabPane>
                {/*<TabPane tab="广告采集" key="2"></TabPane>*/}
            </Tabs>
        );
    }
}

export default Form.create()(SaleStatis)
