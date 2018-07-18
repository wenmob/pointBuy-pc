const commonJs = {
	page(val){
		return val+1
	},
	//分页
  	getPagination(currentPage,totalPage,pageNumArr){
//		let totalPage = vm.totalPage
		pageNumArr = []
//		console.log(vm.pageNumArr)
		//页数大于10，加省略号
		if(currentPage == 1){
			pageNumArr.push(1)
		}
		if(currentPage == 2){
			pageNumArr.push(1,2)
		}
		if(currentPage == 3){
			pageNumArr.push(1,2,3)
		}
		if(currentPage > 3){
			pageNumArr.push(1,'...',currentPage-2,currentPage-1,currentPage)
		}
		if(currentPage+1 <= totalPage){
			pageNumArr.push(currentPage+1)
		}
		if(currentPage+2 <= totalPage){
			pageNumArr.push(currentPage+2)
		}
		if(currentPage+3 == totalPage){
			pageNumArr.push(currentPage+3)
		}
		if(currentPage+3 < totalPage){
			pageNumArr.push('...',totalPage)
		}
			
		return pageNumArr
		
  	},
}

export default commonJs