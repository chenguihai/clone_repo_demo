import axios from "axios";
import config from "../config/config";
// import {message} from "antd";

// export function ajax(api, params, methods = "POST", isJson = true) {
//     return new Promise((suc, err) => {
//         var token = window.sessionStorage.getItem("token") || ""
//         var xhr = new XMLHttpRequest();
//         xhr.onreadystatechange = function () {
//             if (xhr.readyState === 4) {
//                 if (xhr.status === 200) {
//                     suc(xhr.responseText);
//                 } else {
//                     err(xhr.statusText);
//                 }
//             }
//         };
//
//         xhr.onerror = function (e) {
//             err(xhr.statusText);
//         };
//
//         xhr.open(methods, api, true);
//         if (isJson) {
//             xhr.setRequestHeader('Content-Type', 'application/json');
//         } else {
//             xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//         }
//         xhr.setRequestHeader('token', token);
//         xhr.send(params);
//     })
// }

export default function axiosHttp(api, params, methods = "POST",url=false) {
    var token = window.sessionStorage.getItem("token") || "";
    return new Promise((resolve, reject) => {
        axios({
            method: methods,
            // url: url ? config.baseUrl2+api :config.baseUrl+api,
            url:config.baseUrl+api,
            data: params,
            headers: {
                "token": token,
                // "Content-Type": 'application/x-www-form-urlencoded'
                // "Content-Type": 'application/json'
            }
        }).then(res => {
                resolve(res.data);
        }).catch(err => {
            reject(err);
            // message.error(err.message);
        });
    })
}