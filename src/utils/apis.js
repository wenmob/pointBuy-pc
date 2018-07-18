import request from '@/utils/request'
let _this;
export const APIS = {
	CommonApis(type, url, dataJson, callBack, isLoad) {
		if(isLoad) {
//			console.log(isLoad)
			layer.load(1, {shade: 0.5})
		}
		_this = this;
		request({
			url: url,
			method: type,
			data: dataJson

		}).then(res => {
			//			layer.closeAll('loading');
			callBack(res)
		}).catch(error => {
			console.log(error)
		})
	},
	//获取背景图片
  	getbgPic(position,callBack){
  		let dataJson = {position:position}
		this.CommonApis(
			'post',
			'/site/position',
			dataJson,
			callBack
		)
  	},
	// 获取网站公共信息接口
	getCommon(callBack) {
		let dataJson = {}
		this.CommonApis(
			'post',
			'/site/info',
			dataJson,
			callBack
		)
	},
	// 获取banner接口
	getBanner(type, callBack) {
		let dataJson = {
			type: type
		}
		this.CommonApis(
			'post',
			'/site/banner',
			dataJson,
			callBack
		)
	},
	//服务中心
  	getSeverce(type,pageNum,pageSize,isLoad,callBack){
  		let dataJson = {type:type,pageNum:pageNum,pageSize:pageSize}
		this.CommonApis(
			'post',
			'/site/faq/list?',
			dataJson,
			callBack,
			isLoad
		)
  	},
	// 注册接口
	getRegister(mobile, username, password, smsCode, registerFrom, referrerType, referrerId, callBack) {
		let dataJson = {
			registerFrom: registerFrom,
			smsCode: smsCode,
			password: password,
			username: username,
			mobile: mobile,
			referrerType: referrerType,
			referrerId: referrerId
		}
		this.CommonApis(
			'post',
			'/register',
			dataJson,
			callBack
		)
	},
	// 获取短信验证码接口
	/*注册action为1,忘记密码action为2*/
	get_sms_code(mobile, action, validateCode, callBack) {
		let dataJson = {
			mobile: mobile,
			action: action,
			validateCode: validateCode
		}
		this.CommonApis(
			'post',
			'/get-sms-code',
			dataJson,
			callBack
		)
	},
	// 登录的接口
	getLogin(mobile, password, callBack) {
		let dataJson = {
			mobile: mobile,
			password: password
		}
		this.CommonApis(
			'post',
			'/user/login/check/mobile',
			dataJson,
			callBack
		)
	},
	// 判断是否登录
	checklogin(callBack) {
		let dataJson = {}
		this.CommonApis(
			'post',
			'/checklogin',
			dataJson,
			callBack
		)
	},
	// 退出登陆
	userLoginOut(callBack) {
		let dataJson = {}
		this.CommonApis(
			'post',
			'/user/loginout',
			dataJson,
			callBack
		)
	},
	// 忘记登录密码接口
	changeLoginPaw(mobile, password, smsCode, callBack) {
		let dataJson = {
			mobile: mobile,
			password: password,
			smsCode: smsCode
		}
		this.CommonApis(
			'post',
			'/resetPsw/save',
			dataJson,
			callBack
		)
	},
	// 查看资产接口
	userMoneyInfo(callBack) {
		let dataJson = {}
		this.CommonApis(
			'post',
			'/user/userMoney/info',
			dataJson,
			callBack
		)
	},
	// 获取用户基本信息
	getBaseUserInfo(callBack) {
		let dataJson = {}
		this.CommonApis(
			'post',
			'/user/base/info',
			dataJson,
			callBack
		)
	},
	// 判断是否绑定支付宝
	checkAlipayBound(callBack) {
		let dataJson = {}
		this.CommonApis(
			'post',
			'/user/alipay/account',
			dataJson,
			callBack
		)
	},
	// 实名认证接口
	checkIdcard(name, idCardNo, callBack) {
		let dataJson = {
			idCardNo: idCardNo,
			name: name
		}
		this.CommonApis(
			'post',
			'/user/idcard/check',
			dataJson,
			callBack
		)
	},
	// 绑定、修改手机号
	changePhone(mobile, password, smsCode, callBack) {
		let dataJson = {
			mobile: mobile,
			password: password,
			smsCode: smsCode
		}
		this.CommonApis(
			'post',
			'/user/base/bindingMobile',
			dataJson,
			callBack
		)
	},
	// 银行卡绑定接口
	saveUserBank(bankId, province, city, district, branch, number, callBack) {
		let dataJson = {
			bankId: bankId,
			province: province,
			city: city,
			district: district,
			branch: branch,
			number: number
		}
		this.CommonApis(
			'post',
			'/user/bank/save',
			dataJson,
			callBack
		)
	},
	// 获取所有省份
	getprovince(callBack) {
		let dataJson = {}
		this.CommonApis(
			'post',
			'/common/region/province',
			dataJson,
			callBack
		)
	},
	// 获取下级列表
	getRegion(pid, callBack) {
		let dataJson = {
			pid: pid
		}
		this.CommonApis(
			'post',
			'/common/region/child',
			dataJson,
			callBack
		)
	},
	// 绑定银行卡获取系统支持的银行信息
	sysBankListWithdraw(callBack) {
		let dataJson = {}
		this.CommonApis(
			'post',
			'/withdraw/sysBank/list',
			dataJson,
			callBack
		)
	},
	// 支付宝转账信息
	rechargeSetAlipay(callBack) {
		let dataJson = {}
		this.CommonApis(
			'post',
			'/merchantSet/alipay',
			dataJson,
			callBack
		)
	},
	// 去绑定支付宝
	goAlipayBound(money, name, account, callBack) {
		let dataJson = {
			money: money,
			name: name,
			account: account
		}
		this.CommonApis(
			'post',
			'/user/alipay/bindAliAccount',
			dataJson,
			callBack
		)
	},
	// 获取付款码
	alipayBoundCode(type, callBack) {
		let dataJson = {
			type: type
		}
		this.CommonApis(
			'post',
			'/user/alipay/bindQrcode',
			dataJson,
			callBack
		)
	},
	// 获取短连接(手机打开支付宝接口)
	fetchShorturl(url, callBack) {
		let dataJson = {
			url: url
		}
		this.CommonApis(
			'post',
			'/shorturl/fetch',
			dataJson,
			callBack
		)
	},
	// 修改登录密码
	updateLoginPsw(originalPwd, newPwd, callBack) {
		let dataJson = {
			originalPwd: originalPwd,
			newPwd: newPwd
		}
		this.CommonApis(
			'post',
			'/user/loginPsw/update',
			dataJson,
			callBack
		)
	},
	// 设置提现密码
	savePayPsw(payPassword, callBack) {
		let dataJson = {
			payPassword: payPassword
		}
		this.CommonApis(
			'post',
			'/user/setPayPsw/save',
			dataJson,
			callBack
		)
	},
	// 修改提现(支付)密码
	saveResetPayPsw(mobile, password, smsCode, callBack) {
		let dataJson = {
			mobile: mobile,
			password: password,
			smsCode: smsCode
		}
		this.CommonApis(
			'post',
			'/user/resetPayPsw/save',
			dataJson,
			callBack
		)
	},
	// 获取我邀请的注册用户
	baseMyusers(page, pageSize, callBack) {
		let dataJson = {
			page: page,
			pageSize: pageSize
		}
		this.CommonApis(
			'post',
			'/user/base/my-users',
			dataJson,
			callBack
		)
	},
	// 获取公告数据接口
	getNotice(page, pageSize, type, callBack) {
		let dataJson = {
			page: page,
			pageSize: pageSize,
			type: type
		}
		this.CommonApis(
			'post',
			'/site/noticeNew',
			dataJson,
			callBack
		)
	},
	// 获取公告详情
	getNoticeDetail(id, callBack) {
		let dataJson = {
			id: id
		}
		this.CommonApis(
			'post',
			'/site/notice',
			dataJson,
			callBack
		)
	},
	// 资金明细接口
	userMoneyCashLog(orderNumber, btype,dateAddBegin,dateAddEnd, page, pageSize, callBack) {
		let dataJson = {
			orderNumber: orderNumber,
			btype: btype,
			dateAddBegin:dateAddBegin,
			dateAddEnd:dateAddEnd,
			page: page,
			pageSize: pageSize,
		}
		this.CommonApis(
			'post',
			'/user/userMoney/cashLog',
			dataJson,
			callBack,
			true
		)
	},
	// 系统支持的支付方式
	getPayType(callBack) {
		let dataJson = {}
		this.CommonApis(
			'post',
			'/merchantSet/payway',
			dataJson,
			callBack
		)
	},
	// 支付宝转账查询接口
	checkAlipayNofee(ddh, callBack) {
		let dataJson = {
			ddh: ddh
		}
		this.CommonApis(
			'post',
			'/user/alipayNofee/check',
			dataJson,
			callBack
		)
	},
	// 前端获取线下转账账号维护(获取银行卡转账所支持账号)
	rechargeOffMerchantSet(callBack) {
		let dataJson = {}
		this.CommonApis(
			'post',
			'/merchantSet/rechargeOff',
			dataJson,
			callBack
		)
	},
	// 微信支付
	wechantPay(amount, callBack) {
		let dataJson = {
			amount: amount
		}
		this.CommonApis(
			'post',
			'/user/pay/wechatPay',
			dataJson,
			callBack
		)
	},
	//银联(网关)支付
	gatewayPay(amount,bankCode,callBack){
		let dataJson = {amount:amount,bankCode:bankCode}
		this.CommonApis(
			'post',
			'/user/pay/gatewayPay',
			dataJson,
			callBack
		)
	},
	//未来优势四方支付
	gatewayPayWlyx(amount,bankCode,callBack){
		let dataJson = {amount:amount,bankCode:bankCode}
		this.allApis(
			'post',
			'/user/pay/gatewayPayWlyx',
			dataJson,
			callBack
		)
	},
	// 银联支付获取验证码
	getNetBankCode(amount, callBack) {
		let dataJson = {
			amount: amount
		}
		this.CommonApis(
			'post',
			'/user/pay/quickPay',
			dataJson,
			callBack
		)
	},
	// 重新获取银联支付验证码
	netBankCodeAgain(bankId, callBack) {
		let dataJson = {}
		this.CommonApis(
			'post',
			'/user/pay/quickPay/' + bankId + '/verifyCode',
			dataJson,
			callBack
		)
	},
	// 确认银联支付
	trueNetBank(bankId, verifyCode, callBack) {
		let dataJson = {
			verifyCode: verifyCode
		}
		this.CommonApis(
			'post',
			'/user/pay/quickPay/' + bankId,
			dataJson,
			callBack,
			true
		)
	},
	// 未来优势转账
	wlyxNetBankPay(amount, callBack) {
		let dataJson = {
			amount: amount
		}
		this.CommonApis(
			'post',
			'/user/pay/quickPayWlyx',
			dataJson,
			callBack,
			true
		)
	},
	// 支付宝支付
	alipayPay(amount, callBack) {
		let dataJson = {
			amount: amount
		}
		this.CommonApis(
			'post',
			'/user/pay/alipayPay',
			dataJson,
			callBack,
			true
		)
	},
	// 获取提现时间接口
	profileWithdraw(callBack) {
		let dataJson = {}
		this.CommonApis(
			'post',
			'/site/profile/withdraw',
			dataJson,
			callBack,
			true
		)
	},
	// 提现接口
	userCashWithdrawApply(amount, payPwd, callBack) {
		let dataJson = {
			payPwd: payPwd,
			amount: amount
		}
		this.CommonApis(
			'post',
			'/user/userCashWithdraw/apply',
			dataJson,
			callBack,
			true
		)
	},
	// 首页滚动策略
	rollingStrategy(callBack) {
		let dataJson = {}
		this.CommonApis(
			'post',
			'/user/strategyInfo/rollingStrategy',
			dataJson,
			callBack,
			true
		)
	},
	// T+1持仓列表
	strategyListT1(isLoad, callBack) {
		let dataJson = {}
		this.CommonApis(
			'get',
			'/user/strategyInfo/tAddOnePosition',
			dataJson,
			callBack,
			isLoad
		)
	},
	// T+1历史查询
	historyTaddOne(dateAddBegin, dateAddEnd, page, pageSize, callBack) {
		let dataJson = {
			dateAddBegin: dateAddBegin,
			dateAddEnd: dateAddEnd,
			page: page,
			pageSize: pageSize
		}
		this.CommonApis(
			'post',
			'/user/strategyInfo/historyTaddOne',
			dataJson,
			callBack,
			true
		)
	},
	// T+D持仓列表
	strategyListTD(callBack) {
		let dataJson = {}
		this.CommonApis(
			'get',
			'/user/strategyInfo/tAddDPosition',
			dataJson,
			callBack
		)
	},
	// T+D历史查询
	historyTaddD(year, page, pageSize, callBack) {
		let dataJson = {
			year: year,
			page: page,
			pageSize: pageSize
		}
		this.CommonApis(
			'post',
			'/user/strategyInfo/historyTaddD',
			dataJson,
			callBack,
			true
		)
	},
	// 策略(历史)详情
	strategyDetail(stockId, callBack) {
		let dataJson = {}
		this.CommonApis(
			'get',
			'/user/strategyStock/info?stockId=' + stockId,
			dataJson,
			callBack,
			true
		)
	},
	// 股票卖出
	stockSell(stockId, callBack) {
		let dataJson = {
			stockId: stockId
		}
		this.CommonApis(
			'post',
			'/user/strategyStock/sell',
			dataJson,
			callBack,
			true
		)
	},
	// 关闭/开启自动递延
	autoContinueFlag(strategyInfoId, continueFlag, callBack) {
		let dataJson = {
			strategyInfoId: strategyInfoId,
			continueFlag: continueFlag
		}
		this.CommonApis(
			'post',
			'/user/strategyInfo/autoContinueFlag',
			dataJson,
			callBack,
			true
		)
	},
	// 修改止损
	updateCloseLine(stockId, price, callBack) {
		let dataJson = {
			stockId: stockId,
			price: price
		}
		this.CommonApis(
			'post',
			'/user/strategyInfo/updateCloseLine',
			dataJson,
			callBack,
			true
		)
	},

	// 增加保证金
	addDeposit(strategyInfoId, deposit, lowClose, callBack) {
		let dataJson = {
			strategyInfoId: strategyInfoId,
			deposit: deposit,
			lowClose: lowClose
		}
		this.CommonApis(
			'post',
			'/user/strategyInfo/addDeposit',
			dataJson,
			callBack,
			true
		)
	},
	// 策略递延
	continueStrategy(strategyInfoId, callBack) {
		let dataJson = {
			strategyInfoId: strategyInfoId
		}
		this.CommonApis(
			'post',
			'/user/strategyInfo/continueStrategy',
			dataJson,
			callBack,
			true
		)
	},
	// 获取最低止损价
	getLowClosePrice(stockId, callBack) {
		let dataJson = {}
		this.CommonApis(
			'get',
			'/user/strategyInfo/getLowClosePrice?stockId=' + stockId,
			dataJson,
			callBack,
			true
		)
	},
	// T+D终止操盘(结算)
	settleTaddD(callBack) {
		let dataJson = {}
		this.CommonApis(
			'post',
			'/user/strategyInfo/settleTaddD',
			dataJson,
			callBack,
			true
		)
	},
	// T+D增加资金
	addAmount(strategyId, amount, callBack) {
		let dataJson = {
			strategyId: strategyId,
			amount: amount
		}
		this.CommonApis(
			'post',
			'/user/strategyInfo/addAmount',
			dataJson,
			callBack,
			true
		)
	},
	// T+D组详情
	tdStrategyInfo(id, callBack) {
		let dataJson = {
			id: id
		}
		this.CommonApis(
			'post',
			'/user/strategyInfo/tdInfo',
			dataJson,
			callBack,
			true
		)
	},
	// T+D策略股票列表
	tdStockList(strategyId, callBack) {
		let dataJson = {}
		this.CommonApis(
			'get',
			'/user/strategyStock/tdStockList?strategyId=' + strategyId,
			dataJson,
			callBack,
			true
		)
	},
	// T+1停牌放弃策略
	stopStockGiveUp(stockId, callBack) {
		let dataJson = {
			stockId: stockId
		}
		this.CommonApis(
			'post',
			'/user/strategyHaltstock/giveUp',
			dataJson,
			callBack,
			true
		)
	},
	// 买断
	buyOut(stockId, callBack) {
		let dataJson = {
			stockId: stockId
		}
		this.CommonApis(
			'post',
			'/user/strategyHaltstock/buyOut',
			dataJson,
			callBack,
			true
		)
	},
	// 停牌股票列表
	stopStockList(callBack) {
		let dataJson = {}
		this.CommonApis(
			'get',
			'/user/strategyHaltstock/stockList',
			dataJson,
			callBack
		)
	},
	// 卖出
	sellOut(stockId, callBack) {
		let dataJson = {
			stockId: stockId
		}
		this.CommonApis(
			'post',
			'/user/strategyHaltstock/sell',
			dataJson,
			callBack,
			true
		)
	},
	// 新手指引
	siteExtContent(k, callBack) {
		let dataJson = {
			k: k
		}
		this.CommonApis(
			'post',
			'/siteExtContent/info',
			dataJson,
			callBack,
			true
		)
	},
	//手机号验证
	phoneNumInput(mobile) {
		_this = this;
		let reg = /^1[0-9]{10}$/;
		if(!reg.test(mobile)) {
			layer.msg("请输入有效的手机号");
			return false;
		}
		return true;
	},
	//用户名验证:至少6位,至多32位的数字,字母和下划线组合
	userName(username) {
		_this = this;
		let reg = /^[0-9a-zA-Z_]+$/;
		if(username.length < 6) {
			layer.msg("用户名至少6位");
			return false;
		}
		if(username.length > 32) {
			layer.msg("用户名最多32位");
			return false;
		}
		if(!reg.test(username)) {
			layer.msg("用户名只能由数字和字母和下划线组成");
		}
		return true;
	},
	//密码验证:至少6位的数字和字母组合
	checkPassword(password) {
		_this = this;
		let reg = /^[0-9a-zA-Z]+$/;
		if(password.length < 6) {
			layer.msg("密码至少6位");
			return false;
		}
		if(password.length > 32) {
			layer.msg("密码最多32位");
			return false;
		}
		if(!reg.test(password)) {
			layer.msg("密码只能由数字和字母组成");
		}
		return true;
	},
	//身份证验证18位
	IdCard(Idcard) {
		_this = this;
		let reg = /^[0-9]{17}[0-9xX]{1}$/;
		if(!reg.test(Idcard)) {
			layer.msg("身份证不正确");
			return false;
		}
		return true;
  },
  // 获取T+1设置的参数
  strategySet_get (type, callBack) {
    let dataJson = {type}
    this.CommonApis(
      'post',
      '/user/strategySet/get',
      dataJson,
      callBack,
      true
    )
  },
  // 购买T+1
  buyTAddOne (data, callBack) {
    this.CommonApis(
      'post',
      '/user/strategyInfo/buyTAddOne',
      data,
      callBack,
      true
    )
  },
  // 判断股票是否可买 GET /user/strategyInfo/stockBuyJudge
  canBuy (stockCode, callBack) {
    let dataJson = {}
    this.CommonApis(
      'get',
      '/user/strategyInfo/stockBuyJudge?stockCode=' + stockCode,
      dataJson,
      callBack,
      false
    )
  }
}

