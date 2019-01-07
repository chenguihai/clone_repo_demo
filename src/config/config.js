const dev_baseUrl = "http://10.37.4.104:3030/";
const prod_baseUrl = "http://cmi.center/";
const is_dev = process.env.NODE_ENV === "production" ? false : true;
const baseUrl = is_dev ? dev_baseUrl : prod_baseUrl;
export default {
    baseUrl, is_dev
}