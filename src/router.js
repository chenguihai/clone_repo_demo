import React from 'react'
import { HashRouter, Route, Switch, Redirect} from 'react-router-dom'
import App from './App'
// import Login from './pages/login'
import Admin from './admin'
import SaleStatis from './pages/statisticAnalysis/saleStatis'
import ConverStatis from './pages/statisticAnalysis/converStatis'
import GoodsCollection from './pages/goodsManage/goodsCollection'
import GoodsPutaway from './pages/goodsManage/goodsPutaway'
import OrderDetail from './pages/home/index'

export default class ERouter extends React.Component{
// <Common></Common>

    render(){
        return (
            <HashRouter>
                <App>
                    <Switch>
                        {/*<Route path="/login" component={Login}/>*/}
                        <Route path="/homepage" render={() =>
                            <Route path="/homepage/fbAdverts" component={OrderDetail} />
                        }
                        />
                        <Route path="/" render={()=>
                            <Admin>
                                <Switch>
                                    <Route path="/goodsManage/goodsCollection" component={GoodsCollection} />
                                    <Route path="/goodsManage/goodsPutaway" component={GoodsPutaway} />
                                    <Route path="/statisticAnalysis/saleStatis" component={SaleStatis} />
                                    <Route path="/statisticAnalysis/converStatis" component={ConverStatis} />
                                    <Redirect to="/homepage/fbAdverts" />
                                    {/* <Route component={NoMatch} /> */}
                                </Switch>
                            </Admin>         
                        } />
                    </Switch>
                </App>
            </HashRouter>
        );
    }
}