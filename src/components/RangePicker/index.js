import React from "react";
import moment from "moment";
import {Button, DatePicker} from "antd";
import "./index.less";

const {RangePicker} = DatePicker;

export default class RangePickerDemo extends React.Component {
    state = {
        startTime: moment().subtract(this.props.interval, "months"),
        endTime: moment(),
        openFlag: false
    };
    isOkFlag = false;
    currentTime = null;
    /**
     * @type {moment.Moment}
     * startTimeOld  endTimeOld  记录提交的时候的值
     */
    startTimeOld = moment().subtract(this.props.interval, "months");
    endTimeOld = moment();
    change = dates => {
        // console.log(dates);
        const {startTime, endTime} = this.state;
        let sStartTime = this.timePinchFun(startTime);
        let eEndTime = this.endTimePinchFun(endTime);
        let selectTime = this.timePinchFun(dates[0]);
        if (dates.length > 1) {
            if (this.currentTime && this.timePinchFun(this.currentTime) === selectTime) {
                this.currentTime = dates[1];
            } else {
                this.currentTime = dates[0];
            }
        } else {
            this.currentTime = dates[0];
        }

        let currentTimeDate = this.timePinchFun(this.currentTime);
        if (sStartTime < currentTimeDate && currentTimeDate < eEndTime) { //中
            let flag = eEndTime - currentTimeDate > currentTimeDate - sStartTime;
            this.setState({
                startTime: flag > 0 ? this.currentTime : startTime, //flag true 靠近小的   false  靠近大的
                endTime: flag > 0 ? endTime : this.currentTime,
                openFlag: true
            }, () => {
                this.refs["x-range-picker"].picker.clearHoverValue();
            });
        } else if (currentTimeDate < sStartTime) { //小
            this.setState({
                startTime: this.currentTime,
                endTime: endTime,
                openFlag: true
            }, () => {
                this.refs["x-range-picker"].picker.clearHoverValue();
            });
        } else { //大
            this.setState({
                startTime: startTime,
                endTime: this.currentTime,
                openFlag: true
            }, () => {
                this.refs["x-range-picker"].picker.clearHoverValue();
            });
        }
    };
    timePinchFun = (time) => {
        // return time.format('X')
        return time.hour(0).minutes(0).second(0).unix() * 1000
    }
    endTimePinchFun = (time) => {
        return time.hour(23).minutes(59).second(59).unix() * 1000
    }

    show = () => {
        if (this.isOkFlag) return;
        this.setState({
            openFlag: true
        });
    };

    // dateDisabledDate = (current) => {  // 需求有效期的禁止选择时间
    //     if (current) {
    //         return current && current > moment()
    //     }
    // };
    handleSureSelect = () => {
        this.isOkFlag = true;
        let {startTime, endTime} = this.state;
        this.props.handleSubmit(this.props.type, [startTime, endTime]);
        this.startTimeOld = startTime;
        this.endTimeOld = endTime;
        this.setState({
                openFlag: false,
            }, () => {
                this.isOkFlag = false;

            }
        );
    }
    handleCancelSelect = () => {
        this.isOkFlag = true;
        this.setState({
                startTime: this.startTimeOld,
                endTime: this.endTimeOld,
                openFlag: false,
            }, () => (this.isOkFlag = false)
        );
    }


    render() {
        const {startTime, endTime, openFlag} = this.state;
        const style = {
            width_230: {width: 230},
        }
        return (
            <div onClick={this.show} id='rangeBox'>
                <RangePicker style={style.width_230}
                             open={openFlag}
                             dropdownClassName='rangPickerWrap'
                             ref='x-range-picker'
                             value={[startTime, endTime]}
                             renderExtraFooter={() => <div>
                                 <Button size='small' className='mr10' onClick={this.handleCancelSelect}>取消</Button>
                                 <Button size='small' type='primary' onClick={this.handleSureSelect}>确定</Button>
                             </div>}
                             format="YYYY-MM-DD"
                             placeholder={["Start Time", "End Time"]}
                             onCalendarChange={this.change}
                    // disabledDate={this.dateDisabledDate}
                />
            </div>
        );
    }
}