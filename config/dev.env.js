'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"/api"',
  DEV_API_URL: 'http://192.168.8.91:8090' // http://192.168.8.91:8090
  							/*http://a.yingqw.com */
  							/*http://dm.yingqw.com */
  							/*http://192.168.8.216:8081 */
})
