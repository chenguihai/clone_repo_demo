import React from 'react'
import {message, Modal, Checkbox} from 'antd'
import axiosHttp from "../../utils/ajax";
import './index.less'

export default class GoodsModal extends React.Component {
    state = {
        loading: false,
        params: {},
        listData: [],
        suppliers: []
    }
    deleteFlag = false;
    pageInfo = {
        type: this.props.type,//0:100%hash匹配,1:90%hash匹配,2:点阵匹配,3:全部, 4:非同款
        sku: this.props.skuId, // 产品id
        offerid: '',
    }
    componentDidMount() {
        this.getSourceList()
    }

    getSourceList = () => {
        this.setState({
            loading: true
        });
        const params = {type: this.pageInfo.type, sku: this.pageInfo.sku};
        axiosHttp('salesku/source/list',params).then((res)=>{
            if (res.code === 200) {
                let suppliers = res.data && res.data.suppliers;
                for (let i = 0; i < suppliers.length; i++) {
                    suppliers[i].idDisabled = false;
                }
                this.setState({
                    loading: false,
                    listData: suppliers
                })
            } else {
                this.setState({
                    loading: false,
                })
                message.error(res.msg)
            }
        })
    }
    deleteList = () => {
        const params = {offerid: this.pageInfo.offerid, sku: this.pageInfo.sku};
        axiosHttp('salesku/source/del',params).then((res)=>{
            if (res.code === 200) {
                this.deleteFlag = true
            } else {
                message.error(res.msg)
            }
        })
    }
    onChange = (offerid, e) => {
        this.pageInfo.offerid = offerid;
        let listData = this.state.listData;
        for (let i = 0; i < listData.length; i++) {
            if (offerid === listData[i].offerid) {
                listData[i].isDisabled = true;
                break;
            }
        }
        this.deleteList();
        this.setState({
            listData
        })
    };
    cancelPopup = () => {
        this.props.cancelPopup(this.deleteFlag);
    }

    render() {
        const style = {
            modal: {top: 0, paddingBottom: 0, margin: 0},
        }
        const {listData} = this.state;
        return (
            <Modal style={style.modal} title={'匹配货源列表(' + listData.length + ')'} centered visible={true}
                   footer={null} width={1120} onCancel={this.cancelPopup}
                   bodyStyle={{height: 800, overflow: 'auto'}}>
                {listData.length ? listData.map((item) => {
                    return (
                        <div key={item.offerid} className="pick-list-item">
                            <div className="img-box">
                                <div className="shadow" style={{display: item.status != 1 ? " block" : 'none'}}></div>
                                <a href={item.url} target="_blank"><img src={item.images.src}
                                                                        alt={item.images.msg}/></a>
                                <div className="list-check">
                                    <label className="f-12"> <Checkbox onChange={this.onChange.bind(this, item.offerid)} checked={item.status !== 1 || item.isDisabled === true}
                                                                       disabled={item.status !== 1 || item.isDisabled === true}>非同款</Checkbox></label>
                                    {/*<label className="f-12"><input type="checkbox" value={item.offerid}*/}
                                    {/*checked={item.status != 1 ? "checked" : ""}/>非同款</label>*/}
                                </div>
                                <div className="pick-result f-12">
                                    {
                                        item.images.mathType == 0 || item.images.mathType == 1 ?
                                            <span>绝对匹配: <span
                                                className='red'>{Math.round(item.images.imgHashPercent)}</span></span> :
                                            <span>点阵匹配: <span
                                                className="red">{Math.round(item.images.pointPercent)}</span></span>
                                    }
                                </div>
                            </div>
                            <div className="pick-list-item-desc">
                                <p className="desc-title" title={item.title}><a href={item.url}
                                                                                target="_blank">{item.title}</a></p>
                                <p className="desc-price ac">{item.price_range.length > 1 ?
                                    `${item.price_range[item.price_range.length - 1] && item.price_range[item.price_range.length - 1].price}~${item.price_range[0] && item.price_range[0].price}` :
                                    `${item.price_range[0] && item.price_range[0].price}`
                                }</p>
                                <div className="desc-other">
                                    <p>起订量<span>{item.price_range[0] && item.price_range[0].condition}</span><span
                                        className="split">|</span>近30天销量<span>{item.sale_count}</span><span
                                        className="split"/></p>
                                    <div></div>
                                    <p>{item.company && item.company.location}</p>
                                </div>
                            </div>
                        </div>
                    )
                }) : null
                }
            </Modal>
        )
    }
}