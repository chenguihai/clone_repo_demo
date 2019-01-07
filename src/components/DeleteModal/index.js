import React, {Component} from 'react'
import {Modal} from 'antd'

/**
 *这个组件需要 以下参数和方法
 * @param title 标题
 * @param content 内容
 * @function hide 关闭弹框
 * @function sure 提交内容
 */
export default class Index extends Component {
    // 初始化页面常量 绑定事件方法
    constructor(props, context) {
        super(props);
    }

    cancelPopup = ()=> { //取消编辑
        this.props.hide();
    }

    handleSubmit = (e)=> {
        this.props.sure();
    }

    render() {
        const style = {
            modal: {top: 0, paddingBottom: 0, margin: 0},
        };
        const {title, content} = this.props;
        return (
            <Modal title={title} style={style.modal} visible={true} centered okText='确定' cancelText='取消' iconType='error'
                   onCancel={this.cancelPopup} onOk={this.handleSubmit}>
                <p>{content}</p>
            </Modal>
        )
    }
}
