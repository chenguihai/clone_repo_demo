import React from 'react'
import { Row,Col } from 'antd';
import Header from './components/Header'
import NavLeft from './components/NavLeft'
import './style/common.less'
class Admin extends React.Component{

    render(){
        return (
            <Row className="container">
                <Col md={24}>
                    <Header/>
                </Col>
                <Col xll={2} xl={3} lg={4} md={5} className="nav-left">
                    <NavLeft/>
                </Col>
                <Col xll={22} xl={21} lg={20} md={19} className="main">
                    <Row className="content">
                        {this.props.children}
                    </Row>
                </Col>
            </Row>
        );
    }
}
export default Admin