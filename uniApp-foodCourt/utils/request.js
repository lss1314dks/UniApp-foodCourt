
// 服务器地址
const BASE_URL = 'http://localhost:8081'
export function request(config={}){
	
	
	let {
		url,
		method = "GET",
		header={"userToken":uni.getStorageSync("userToken") || ""},
		data={}
	} = config
	
	url = BASE_URL + url;
	return new Promise((resolve,reject)=>{
		uni.request({
			url,
			method,
			header,
			data,
			success:res=>{
				console.log(res);
				if(res.data.code===200||res.status==200){
					resolve(res.data)
				}else if(res.data.code===400||res.data.status==0){
					uni.showModal({
						title:'错误提示',
						content:res.data.msg,	
						showCancel:false
					})
					reject(res.data);
				}else{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					reject(res.data);
				}
			},
			fail:err=>{
				console.log("1111111");
				reject(err);
			}
		})
	})
	
}