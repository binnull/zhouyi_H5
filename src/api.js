const host = 'https://annual-forecast.chuangkit.com';
const getWxAuthUrl = host + '/login/getWxAuthUrl.do';
const getUserInfo = host + '/user/getUserInfo.do';
const executeForecast = host + '/forecast/executeForecast.do';
const getPayForecastTimesParam = host + '/pay/getPayForecastTimesParam.do';
export {
  getWxAuthUrl,
  getUserInfo,
  executeForecast,
  getPayForecastTimesParam
}