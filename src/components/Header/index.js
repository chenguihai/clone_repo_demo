import React from 'react'
import {Row, Col, Button, message} from "antd"
import {Link, withRouter} from 'react-router-dom'
import DeleteModal from '../DeleteModal'
import LoginModal from "../LoginModal";
import axiosHttp from "../../utils/ajax";
import './index.less'

class Header extends React.Component {
    state = {
        username: '',
        isLogoutFlag: false,
        loginFlag: false,
        bgFlag: false
    }

    componentDidMount() {
        this.setState({
            username: sessionStorage.getItem('username'),
            bgFlag: window.location.hash === '#/homepage/fbAdverts'
        })
    }

    showLogoutPopup = () => {
        this.setState({
            isLogoutFlag: true
        });
    }

    cancelLogoutPopup = () => {    // 关闭弹框
        this.setState({
            isLogoutFlag: false,
        });
    };
    cancelLoginPopup = () => {
        this.setState({
            loginFlag: false,
        });
    }
    // 退出登录
    _handleSureLogout = () => {
        window.sessionStorage.clear();
        this.setState({
            username: '',
            isLogoutFlag: false
        })
        this.props.history.push('/homepage/fbAdverts');
    }

    showLoginPopup = () => {
        this.setState({
            loginFlag: true
        })
    }
    _handleLogin = (params) => { //登录接口
        axiosHttp('user/login', params).then((res) => {
            if (res.code === 200) {
                window.sessionStorage.setItem('token', res.data);
                window.sessionStorage.setItem('username', params.name);
                this.setState({
                    loginFlag: false,
                    username: params.name
                })
            } else {
                message.error(res.msg)
            }
        })
    }

    render() {
        const {username, loginFlag, isLogoutFlag, bgFlag} = this.state;
        return (
            <div className="header">
                <Row className="header-top">
                    <Col span="6" className="logo">
                        <Link to='/homepage/fbAdverts'>
                            <img src="/assets/logo.png" alt="logo图片"/>
                        </Link>
                    </Col>
                    <Col span='18'>
                        {username ?
                            <div><span className='mr10'>{username}</span>{bgFlag ? <Link
                                to='/goodsManage/goodsCollection'><Button>我的后台</Button></Link> : null}
                                <Button className='ml10 c-39A0AB pointer'
                                        onClick={this.showLogoutPopup}>退出</Button></div> :
                            <Button onClick={this.showLoginPopup} style={{borderRadius: 16}}>登录</Button>
                        }
                    </Col>
                </Row>
                {/*登录*/}
                {loginFlag ? <LoginModal loginSubmit={this._handleLogin}
                                         cancelPopup={this.cancelLoginPopup}/> : null}
                {/*退出登录*/}
                {isLogoutFlag ? <DeleteModal title='退出登录' content='确认退出登录吗？' hide={this.cancelLogoutPopup}
                                             sure={this._handleSureLogout}/> : null}
            </div>
        );
    }
}

export default withRouter(Header)