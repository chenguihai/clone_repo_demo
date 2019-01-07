import React from 'react'
import {Menu} from 'antd';
import {NavLink} from 'react-router-dom'
import MenuConfig from './../../config/menuConfig'
import './index.less'

const SubMenu = Menu.SubMenu;

class NavLeft extends React.Component {
    state = {
        currentKey: '',
        // collapsed: false,
        openKeys: ['/goodsManage'],
        defaultKeys:['/goodsManage/goodsCollection']
    }
    rootSubmenuKeys = ['/homepage/fbAdverts', '/goodsManage', '/statisticAnalysis'];

    componentDidMount() {
        let hash = window.location.hash.slice(1);
        this.setState({
            openKeys:[hash.slice(0,hash.lastIndexOf('/'))],
            defaultKeys:[hash]
        })
    }

    componentWillMount() {
        const menuTreeNode = this.renderMenu(MenuConfig);
        this.setState({
            menuTreeNode
        })
    }

// 菜单渲染
    renderMenu = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    // title={<span><Icon type="mail" /><span>{item.title}</span></span>}
                    <SubMenu title={item.title} key={item.key}>
                        {this.renderMenu(item.children)}
                    </SubMenu>
                )
            }
            return <Menu.Item title={item.title} key={item.key}>
                {/*<Icon type="pie-chart"/>*/}
                {/*<span>*/}
                <NavLink to={item.key}>{item.title}</NavLink>
                {/*</span>*/}
            </Menu.Item>
        })
    }
// toggleCollapsed = () => {
//     this.setState({
//         collapsed: !this.state.collapsed,
//     });
// }


    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.filter(key => this.state.openKeys.indexOf(key) === -1)[0];
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({openKeys});
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }

    render() {
        const {openKeys,defaultKeys} = this.state;
        return (
            <div>
                {/*<div className='homepage'><a href="http://cmi.center/fbAdvert.html" target='_blank'>首页</a></div>*/}
                <Menu mode='inline'
                      defaultSelectedKeys={[window.location.hash.slice(1)]}
                      // defaultOpenKeys={['/goodsManage']}
                      openKeys={openKeys}
                      onOpenChange={this.onOpenChange}
                    // inlineCollapsed={this.state.collapsed}
                    // theme="dark"
                >
                    {this.state.menuTreeNode}
                </Menu>
                {/*<Button type="primary" onClick={this.toggleCollapsed} style={{marginBottom: 16}}>*/}
                {/*<Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}/>*/}
                {/*</Button>*/}
            </div>
        );
    }
}

export default NavLeft