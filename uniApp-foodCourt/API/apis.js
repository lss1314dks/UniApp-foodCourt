import { request } from "../utils/request";

export function apiGetBanner(){
	return request();
}


	
export function LoginApi(data){
	return request({
		url:'/user/user/login',
		method:'POST',
		header:{
			'Content-Type':'application/json'
		},
		data:data
	});
}

export function RegisterApi(data){
	return request({
		url:'/user/user/register',
		method:'POST',
		header:{
			'Content-Type':'application/json'
		},
		data:data
	})
}
export function getUserInfoApi(){
	return request({
		url:'/user/user/info',
		method:'get',
		header:{
			'userToken':uni.getStorageSync("userToken")
		}
	})
}

//  export function apiGetBanner(){
// 	return uni.request({
// 		url:"xxxx",
// 		header:{
// 			'token':'xxxxxxxxxx';
// 		}
// 	});
// }



//调用后端接口

 
 