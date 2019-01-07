import React from 'react'
import {Form, Select, Input, Button, Spin, Table, message, Tabs, Tooltip} from 'antd'
import moment from 'moment'
import DeleteModal from '../../components/DeleteModal'
import NewCollection from "./newCollection";
import axiosHttp from "../../utils/ajax";
import './index.less'
import RangePickerDemo from "../../components/RangePicker";


const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class GoodsCollection extends React.Component {
    state = {
        loading: false,
        dataList: [],
        deleteAdFlag: false,
        newCollectionFlag: false,
        selectData: {},
        deleteId: 0,
        count: 0
    }
    pageInfo = {
        "timeStart": moment().subtract(1, 'months'),
        "timeEnd": moment(),
        "plateform": undefined,
        // "catfrom": undefined,
        "pdmCatId": undefined,
        "root_cat": undefined,
        "catOrCatchName": undefined,
        "limit": 15,
        "page": 1,
        "status": '-1'
    }
    scrollY = 0;

    componentDidMount() {
        this.getSelectPopupData(() => {
            this.getPdmurlListCommonFun();
        });
        // console.log(window.innerWidth, window.innerHeight);
        this.scrollY = window.innerHeight - 60*3 - 56 - 98
    }

    getSelectPopupData = (callback) => {
        axiosHttp('diction', null, 'get').then((res) => {
            if (res.code === 200) {
                this.pageInfo.plateform = res.data.catchPlatforms.data[0];
                // this.pageInfo.catFroms = res.data.catFroms.data[0];
                this.setState({
                    selectData: res.data,
                }, () => {
                    callback()
                })

            } else {
                message.error(res.msg)
            }
        })
    }
    getPdmurlListCommonFun = () => {
        this.setState({
            loading: true
        });
        const {page,timeStart,timeEnd} = this.pageInfo;
        let pages = page > 0 ? this.pageInfo.page - 1 : 0;
        axiosHttp('pdmurl/list', {
            ...this.pageInfo,
            'timeStart': timeStart.hour(0).minutes(0).second(0).unix(),
            'timeEnd': timeEnd.hour(23).minutes(59).second(59).unix(),
            page: pages
        }).then((res) => {
            if (res.code === 200) {
                this.setState({
                    loading: false,
                    dataList: res.data.list,
                    count: res.data.count,
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
                title: '平台',
                dataIndex: 'plateform',
                key: 'plateform',
                width: '5%',
            },
            {
                title: '分类ID',
                dataIndex: 'pdmCatId',
                key: 'pdmCatId',
                width: '8%',
            },
            {
                title: '分类名称',
                dataIndex: 'pdmCatName',
                key: 'pdmCatName',
                width: '10%',
                render: (pdmCatName) => {
                    return (
                        <div className='word-break'>{pdmCatName}</div>
                    )
                }
            },
            {
                title: '采品名称',
                dataIndex: 'catName1688',
                key: 'catName1688',
                width: '10%',
                render: (catUrl1688) => {
                    return (
                        <div className='word-break'>{catUrl1688}</div>
                    )
                }
            },
            {
                title: '采品链接',
                dataIndex: 'catUrl1688',
                key: 'catUrl1688',
                width: '10%',
                render: (catUrl1688) => {
                    return (
                        <Tooltip title={catUrl1688}>
                            <a className='pointer singleRowEllipses' target='_blank' href={catUrl1688}>{catUrl1688}</a>
                        </Tooltip>
                    )
                }
            },
            {
                title: '预计数据量',
                dataIndex: 'catPrdCount',
                key: 'catPrdCount',
                width: '11%',
                render: (catPrdCount) => {
                    return catPrdCount > 0 ? catPrdCount : 0
                }
            },
            {
                title: '当前状态',
                dataIndex: 'status',
                key: 'status',
                width: '8%',
                render: (text, record, index) => {
                    switch (text) {
                        case -1:
                            return '全部';
                        case 1:
                            return '未获取';
                        case 2:
                            return '获取中';
                        case 3:
                            return '已获取';
                    }
                }
            },
            {
                title: '最近更新时间',
                dataIndex: 'lastCaughtTime',
                key: 'lastCaughtTime',
                width: '10%',
                render: (text, record, index) => {
                    if (text > 0) {
                        return moment(text * 1000).format('YYYY-MM-DD HH:mm')
                    }
                    return ''
                }
            },
            {
                title: '获取数据量',
                dataIndex: 'caughtCount',
                key: 'caughtCount',
                width: '11%',
            },
            {
                title: '创建时间',
                dataIndex: 'createDateTime',
                key: 'createDateTime',
                width: '10%',
                render: (text, record, index) => {
                    if (text > 0) {
                        return moment(text * 1000).format('YYYY-MM-DD HH:mm')
                    }
                    return ''
                }
            },
            {
                title: '操作',
                dataIndex: 'paied_value',
                key: 'paied_value',
                width: '7%',
                render: (text, record, index) => {
                    return (record.status === 1 ? <span className='pointer c-39A0AB'
                                                        onClick={this.showDeletePopup.bind(this, record._id)}>删除</span> : '—'
                    )
                }
            }
        ]
    }

    _handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                this.pageInfo.plateform = values.plateform;
                this.pageInfo.catOrCatchName = values.pdmCatId !== '' ? values.pdmCatId : undefined;
                this.pageInfo.root_cat = values.root_cat !== '全部' ? values.root_cat : undefined;
                this.pageInfo.pdmCatId = parseInt(values.pdmCatId) > 0 ? values.pdmCatId : undefined;
                this.pageInfo.status = values.status !== '' ? values.status : undefined;
                this.pageInfo.page = 1;
                this.getPdmurlListCommonFun();
            }
        });

    }
    handleSubmitFun = (type, dates) => { //提交时间
        this.pageInfo.timeStart = dates[0];
        this.pageInfo.timeEnd = dates[1]
    }

    comfirmUpload = () => {
        this.setState({
            newCollectionFlag: false
        })
        this.getPdmurlListCommonFun();
    }
    newAddCollection = () => {
        this.setState({
            newCollectionFlag: true
        })
    }
    // 显示删除弹框
    showDeletePopup = (id) => {
        this.setState({
            deleteAdFlag: true,
            deleteId: id
        })
    }
    // 关闭弹框
    cancelPopup = () => {
        this.setState({
            deleteAdFlag: false,
            newCollectionFlag: false
        })
    }
    // 确定删除
    _handleSureDelete = () => {
        axiosHttp('pdmurl/del', {"_id": this.state.deleteId}).then((res) => {
            if (res.code === 200) {
                this.setState({
                    deleteAdFlag: false,
                })
                this.getPdmurlListCommonFun();
            } else {
                message.error(res.msg)
            }
        })
    }
    turnPage = (page, pageSize) => {
        this.pageInfo.page = page;
        this.getPdmurlListCommonFun();
    }
    onShowSizeChange = (current, pageSize) => {
        this.pageInfo.page = current;
        this.pageInfo.limit = pageSize;
        this.getPdmurlListCommonFun();
    }
    showTotal = (total) => {
        return `共 ${total} 个记录`;
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {dataList, loading, deleteAdFlag, newCollectionFlag, selectData, count} = this.state;
        const {catFroms = {data: []}, catchPlatforms = {data: []}, catchStatus = {data: {}}} = selectData;
        const style = {
            width_120: {width: 120},
            width_190: {width: 190},
            scroll: {y: this.scrollY, x: 1200}
        }
        return (
            <div className='h_percent100'>
                <Tabs type="card" className='h_percent100'>
                    <TabPane tab="产品采集" key="1" className='ant-tabs-top-content'>
                        <div className='mb10'>
                            <Form layout="inline">
                                <FormItem label="时间">
                                    {getFieldDecorator('rangePicker', {})(
                                        <RangePickerDemo interval={1} type='start' handleSubmit={this.handleSubmitFun}/>
                                    )}
                                </FormItem>
                                <FormItem label="平台">
                                    {getFieldDecorator('plateform', {
                                        initialValue: catchPlatforms.data[0],
                                    })(
                                        <Select style={style.width_120}>
                                            {
                                                catchPlatforms.data.map((item) => {
                                                    return (
                                                        <Option key={item} value={item}>{item}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label="当前状态">
                                    {
                                        getFieldDecorator('status', {
                                            initialValue: '-1',
                                        })(
                                            <Select style={style.width_120}>
                                                <Option key='全部' value="-1">全部</Option>
                                                {
                                                    Object.keys(catchStatus.data).map(key => {
                                                        let obj = catchStatus.data[key];
                                                        if (obj.name !== '全部') {
                                                            return (
                                                                <Option key={obj.name}
                                                                        value={obj.code}>{obj.name}</Option>
                                                            )
                                                        }
                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                                <FormItem label="分类来源">
                                    {
                                        getFieldDecorator('root_cat', {
                                            initialValue: '全部',
                                        })(
                                            <Select style={style.width_120}>
                                                {
                                                    catFroms.data.map((item) => {
                                                        return (
                                                            <Option key={item} value={item}>{item}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                                <FormItem>
                                    {
                                        getFieldDecorator('pdmCatId')(
                                            <Input style={style.width_190} type="text"
                                                   placeholder='分类ID/分类名称/采品名称'/>
                                        )
                                    }
                                </FormItem>
                                <FormItem>
                                    <Button onClick={this._handleSubmit}>查询</Button>
                                </FormItem>
                                <FormItem style={{float: 'right'}}>
                                    <Button type="primary" onClick={this.newAddCollection}>新增采集</Button>
                                </FormItem>
                            </Form>
                        </div>
                        <Spin spinning={loading}>
                            <Table rowKey="_id" className='table-wrap'
                                   dataSource={dataList}
                                   columns={this.columns()}
                                   pagination={dataList.length > 0 && {
                                       hideOnSinglePage: true,
                                       showQuickJumper: true,
                                       total: count,
                                       pageSize: this.pageInfo.limit,
                                       current: this.pageInfo.page,
                                       onChange: this.turnPage,
                                       showSizeChanger: true,
                                       onShowSizeChange: this.onShowSizeChange,
                                       pageSizeOptions: ['15', '30', '50', '100', '200'],
                                       showTotal: this.showTotal
                                   }}
                                   scroll={style.scroll}
                            />
                        </Spin>
                    </TabPane>
                    {/*<TabPane tab="广告采集" key="2"></TabPane>*/}
                </Tabs>
                {/*删除弹框*/}
                {deleteAdFlag ? <DeleteModal title='删除广告' content='删除后，该则采品需求将取消采集数据' hide={this.cancelPopup}
                                             sure={this._handleSureDelete}/> : null}
                {/*新增采集*/}
                {newCollectionFlag ?
                    <NewCollection catFroms={catFroms} catchPlatforms={catchPlatforms} hide={this.cancelPopup}
                                   sure={this.comfirmUpload}/> : null}
            </div>
        );
    }
}

export default Form.create()(GoodsCollection)
