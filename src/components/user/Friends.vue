<template>
	<div id="User_back">
		<div class="contWidth">
			<div class="Extension">
				<div class="Extension_left">
					<p>以下网址是您对外界进行推广的地址，您可以通过朋友、QQ、微信、博客、论坛或自己的网站进行推广，所有通过该地址访问过来的人，注册后就都属于您的用户， 而当这些用户在本站配资时，您就可以赚取佣金了，详细的推广情况可到访问记录里查看。</p>
					<p style="position:relative;">
						<strong>我的推广链接</strong> {{userInfo.spreadUrl}}
						<input id='inputText' style='position:absolute;opacity: 0;' v-model='userInfo.spreadUrl' />
					</p>
					<div class="Invitation"><span>邀请码：{{userInfo.id}}</span><button @click="copyUrl">复制链接</button></div>
				</div>
				<div class="Extension_right qrcodeDiv">

				</div>
				<div class="clear"></div>
			</div>
			<div class="Friends">
				<div class="Friends_title">
					<icon class="red" name="Headportrait" scale="3"></icon>
					<strong>我的好友</strong>
				</div>
				<dl class="Friends_list">
					<dd v-for="item in friendList">
						<div class="list_Alone">
							<span><icon name="Headportrait" scale="8.7"></icon></span>
							<p>{{item.mobile}}</p>
							<p>{{item.dateAdd?item.dateAdd.split(' ')[0]:'-'}}</p>
						</div>
					</dd>
					<div class="clear"></div>
				</dl>
				<!--分页-->
				<ul class="pagination">
					<li @click='subPage' class='pointer'>
						<a aria-label="Previous">
							<span aria-hidden="true">&laquo;</span>
						</a>
					</li>

					<li v-if='totalPage <= 10' class='pointer' @click='changeCurrentPage(item)' :class="currentPage == item?'active':''" v-for='item in totalPage'>
						<a>{{item}}</a>
					</li>
					<li v-if='totalPage > 10' class='pointer' @click='changeCurrentPage(item)' :class="currentPage == item?'active':''" v-for='item in pageNumArr'>
						<a>{{item}}</a>
					</li>

					<li @click='addPage' class='pointer'>
						<a aria-label="Next">
							<span aria-hidden="true">&raquo;</span>
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import Icon from 'vue-svg-icon/Icon.vue';
	import QRCode from 'qrcodejs2';
	import { APIS } from '../../utils/apis.js';
	import COMMON from '@/utils/common'
	let vm;

	export default {
		data() {
			return {
				headerData: [],
				userInfo: {},
				currentPage: 1,
				pageSize: 5,
				friendList: [],
				totalPage: 1,
				pageNumArr: [],

			}
		},
		components: {
			Icon
		},
		mounted() {
			vm = this;
		},
		methods: {
			// 获取用户基本信息
			getBaseUserInfo() {
				APIS.getBaseUserInfo(function(res) {
					console.log(res)
					if(res.code == 0) {
						vm.userInfo = res.data
						vm.getQrCode()
					}
				})
			},
			//复制推广链接
			copyUrl() {
				var input = $("#inputText");
				input.select(); // 选中文本
				document.execCommand("copy"); // 执行浏览器复制命令
				layer.msg('复制成功')
			},
			//生成二维码
			getQrCode() {
				console.log($(".qrcodeDiv"))
				let qrcode = new QRCode($(".qrcodeDiv")[0], {
					width: 200, //设置宽高
					height: 200
				});
				qrcode.makeCode(vm.userInfo.spreadUrl);
			},
			//获取我邀请的注册用户
			baseMyusers() {
				APIS.baseMyusers(vm.currentPage, vm.pageSize, function(res) {
					//					console.log(res)
					if(res.code == 0) {
						vm.friendList = res.data.result
						vm.totalPage = res.data.totalPage
						//执行分页
						if(vm.totalPage > 10) {
							//		  					console.log(COMMON.getPagination(vm.currentPage,vm.totalPage,vm.pageNumArr))
							vm.pageNumArr = COMMON.getPagination(vm.currentPage, vm.totalPage, vm.pageNumArr)
						}
					}
				})
			},
			//指定当前页数据
			changeCurrentPage(currentPage) {
				//				console.log(currentPage)
				if(currentPage == vm.currentPage || currentPage == '...') {
					return
				}
				vm.currentPage = currentPage
				vm.baseMyusers()
			},
			//减少当前页码
			subPage() {
				if(vm.currentPage > 1) {
					vm.currentPage--;
					vm.baseMyusers()
				}
			},
			//增加当前页码
			addPage() {
				if(vm.currentPage < vm.totalPage) {
					vm.currentPage++;
					vm.baseMyusers()
				}
			}
		}
	}
</script>

<style scoped>
	@import "../../assets/css/style.css";
	.clear {
		clear: both;
	}
	
	.red {
		color: #ff5d5e;
	}
	
	.green {
		color: #76cf75;
	}
	
	.back-red {
		background: #ff5d5e!important;
		color: #fff!important;
	}
	
	.back-blue {
		background: #5bc1d7;
	}
	
	#User_back {
		position:relative;
		display: block;
		width: 100%;
		min-height: 880px;
		padding-top: 80px;
		padding-bottom: 60px;
		background: #f1f1f1;
	}
	
	.contWidth {
		margin: 0 auto;
		display: block;
		min-width: 1200px;
		width: 66%;
		/*position: relative;*/
		text-align: center;
	}
	
	.Extension {
		position: relative;
		min-height: 260px;
		background: #fff;
		padding: 30px;
		margin: 0 5px;
	}
	
	.Extension_left {
		position: absolute;
		left: 30px;
		width: 860px;
		text-align: left;
	}
	
	.Extension_left p {
		font-size: 14px;
		margin-bottom: 30px;
	}
	
	.Extension_left p strong {
		display: block;
		font-size: 16px;
	}
	
	.Invitation {
		position: relative;
		width: auto;
	}
	
	.Invitation span {
		position: absolute;
		left: 0;
		top: 8px;
		font-size: 16px;
	}
	
	.Invitation button {
		position: absolute;
		right: 0;
		width: 120px;
		height: 36px;
		border-radius: 18px;
		border: none;
		background: #5bc1d7;
		color: #fff;
	}
	
	.Extension_right {
		position: absolute;
		right: 30px;
		width: 220px;
		height: 200px;
		border-left: 1px dotted #ddd;
		padding-left: 20px;
	}
	
	.Extension_right img {
		margin: 10px;
		width: 180px;
		height: 180px;
		background: #666;
	}
	
	.Friends {
		margin-top: 40px;
	}
	
	.Friends_title {
		position: relative;
		text-align: left;
	}
	
	.Friends_title strong {
		position: absolute;
		top: 1px;
		left: 36px;
		font-size: 18px;
	}
	
	.Friends_list dd {
		width: 16.66%;
		padding: 5px;
		float: left;
	}
	
	.list_Alone {
		padding: 20px;
		background: #fff;
		border-radius: 10px;
		color: #282828;
	}
	
	.list_Alone span {
		display: inline-block;
		;
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: #282828;
		color: #fff;
		margin-bottom: 20px;
	}
	
	.list_Alone p {
		margin-bottom: 0;
		line-height: 30px;
	}
	.Friends .pagination{
		position:absolute;
		bottom:20px;
		right:100px;
	}
	.Friends .pagination .active a{
		background:#ff5d5e;
		color:#fff;
	}
	.Friends .pagination a{
		width: 30px;
	    height: 30px;
	    padding:0;
	    line-height:30px;
	    border-radius: 50%;
	    border: 1px solid #ddd;
	    margin: 0 5px;
	    color: #282828;
	    font-size: 14px;
	}
</style>