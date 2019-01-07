import React, {Component} from 'react'
import {Row, Col, Form, Select, Button, Icon, Modal, Upload, message} from 'antd'
import axiosHttp from "../../utils/ajax";

const FormItem = Form.Item;
const Option = Select.Option;

/**
 *这个组件需要 以下参数和方法
 * @param title 标题
 * @param content 内容
 * @function hide 关闭弹框
 * @function sure 提交内容
 */
class NewCollection extends Component {
    // 初始化页面常量 绑定事件方法
    state = {
        loading: false,
        fileList: [],
        uploading: false,
        hasErrorUpload: false,
        catFroms: []
    }

    componentDidMount() {
        let data = JSON.parse(JSON.stringify(this.props.catFroms));
        data.data.shift();
        this.setState({
            catFroms: data
        })

    }

    cancelPopup = () => { //取消编辑
        this.props.hide();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.hasErrorUpload === false) {
                    this.pdmurlUploadCommonFun(values);
                }
            }
        });
    }
    pdmurlUploadCommonFun = (params) => {
        const formData = new FormData();
        this.state.fileList.forEach((file) => {
            formData.append('file', file);
        });
        formData.append('plateform', params.plateform);
        formData.append('root_cat', params.root_cat);
        axiosHttp('pdmurl/upload', formData).then((res) => {
            if (res.code === 200) {
                this.props.sure();
            } else {
                message.error(res.msg)
            }
        })
    }

    render() {
        const style = {
            modal: {top: 0, paddingBottom: 0, margin: 0},
        };
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            // , offset: 1
            labelCol: {xs: {span: 5},},
            wrapperCol: {xs: {span: 18},},
        };
        const {fileList, catFroms, loading} = this.state;
        const props = {
            accept: '.csv,.xlsx,.xls',
            onRemove: (file) => {
                this.setState((state) => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(state => ({
                    // fileList: [...state.fileList, file],
                    fileList: [file],
                }));
                return false;
            },
            fileList,
        };
        const {catchPlatforms} = this.props;
        return (
            <Modal title='新增采集' style={style.modal} visible={true} centered okText='确定' cancelText='取消'
                   onCancel={this.cancelPopup} onOk={this.handleSubmit}
                   okButtonProps={{disabled: this.state.hasErrorUpload || fileList.length <= 0}}>
                <Row style={style.inputBox}>
                    <Col span={24}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem {...formItemLayout} hasFeedback label='采集平台'>
                                {getFieldDecorator('plateform', {
                                    initialValue: catchPlatforms && catchPlatforms.data[0],
                                    rules: [{required: true}],
                                })(
                                    <Select onChange={this.handleSelectChange}>
                                        {
                                            catchPlatforms && catchPlatforms.data.map((item) => {
                                                return (
                                                    <Option key={item} value={item}>{item}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} hasFeedback label='分类来源'>
                                {getFieldDecorator('root_cat', {
                                    initialValue: catFroms.data && catFroms.data[0],
                                    rules: [{required: true}],
                                })(
                                    <Select onChange={this.handleSelectChange}>
                                        {
                                            catFroms.data && catFroms.data.map((item) => {
                                                return (
                                                    <Option key={item} value={item}>{item}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label='导入文件'>
                                {getFieldDecorator('fileList', {
                                    rules: [{required: true, message: '请选择文件'}],
                                })(
                                    <div>
                                        <Upload {...props} >
                                            <Button loading={loading} disabled={loading}>
                                                <Icon type="upload"/>浏览文件
                                            </Button>
                                        </Upload>
                                        <span className='c-A1A1A1'>*导入格式：csv，xlsx，xls。导入格式参考 <a download='import'
                                                                                                className='c-39A0AB pointer'
                                                                                                href="http://cmi.center/public/import.xlsx"
                                                                                                target="_blank">下载模板</a></span>
                                    </div>
                                )}
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </Modal>
        )
    }
}

export default Form.create()(NewCollection)