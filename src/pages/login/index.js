import React from 'react'
import {Form, Input, Button, message} from 'antd'
import {withRouter} from 'react-router-dom'
import axiosHttp from "../../utils/ajax";
import './index.less'

const FormItem = Form.Item;

class Login extends React.Component {
    state = {};

    loginReq = (params) => {
        axiosHttp('user/login', params).then((res) => {
            if (res.code === 200) {
                window.sessionStorage.setItem('token', res.data);
                window.sessionStorage.setItem('username', params.name);
                if(window.sessionStorage.getItem("token")){
                    this.props.history.push('/home/detail');
                }
            } else {
                message.error(res.msg)
            }
        })
    };

    render() {
        return (
            <div className="login-page">
                {/*<div className="login-header">*/}
                {/*<div className="logo">*/}
                {/*<img src="/assets/logo-ant.svg" alt="管理系统"/>*/}
                {/*后台管理系统*/}
                {/*</div>*/}
                {/*</div>*/}
                <div className="login-content-wrap">
                    <div className="login-content">
                        {/*<div className="word">共享出行 <br />引领城市新经济</div>*/}
                        <div className="word"></div>
                        <div className="login-box">
                            <div className="error-msg-wrap">
                                <div
                                    className={this.state.errorMsg ? "show" : ""}>
                                    {this.state.errorMsg}
                                </div>
                            </div>
                            <div className="title">CMI</div>
                            <LoginForm ref="login" loginSubmit={this.loginReq}/>
                        </div>
                    </div>
                </div>
                {/*<Footer/>*/}
            </div>
        )
    }
}

export default withRouter(Login);

class LoginForm extends React.Component {
    state = {};

    _handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.loginSubmit({
                    name: values.name,
                    pwd: values.pwd
                });
            }
        });
    };

    checkUsername = (rule, value, callback) => {
        var reg = /^\w+$/;
        if (!value) {
            callback('请输入用户名!');
        } else if (!reg.test(value)) {
            callback('用户名只允许输入英文字母');
        } else {
            callback();
        }
    };

    checkPassword = (rule, value, callback) => {
        if (!value) {
            callback('请输入密码!');
        } else {
            callback();
        }
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form className="login-form" onSubmit={this._handleSubmit}>
                <FormItem>
                    {getFieldDecorator('name', {
                        initialValue: '',
                        rules: [{validator: this.checkUsername}]
                    })(
                        <Input placeholder="用户名"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('pwd', {
                        initialValue: '',
                        rules: [{validator: this.checkPassword}]
                    })(
                        <Input type="password" placeholder="密码" wrappedcomponentref={(inst) => this.pwd = inst}/>
                    )}
                </FormItem>
                <FormItem>
                    {/*onClick={this.loginSubmit}*/}
                    <Button type="primary" htmlType='submit' className="login-form-button">
                        Submit
                    </Button>
                </FormItem>
            </Form>
        )
    }
}

LoginForm = Form.create({})(LoginForm);
