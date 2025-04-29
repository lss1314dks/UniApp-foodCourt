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


//获得推荐信息
export function getFoodInfoApi(){
	return request({
		url:'/suggest',
		method:'get',
		header:{
			'userToken':uni.getStorageSync("userToken")
		}
	})
}

//根据id获得推荐的详情信息
export function getDailyRecommendations(id){
	return request({
		url:`/suggest/${id}`,
		method:'get',
		header:{
			'userToken':uni.getStorageSync("userToken")
		}
	})
}

//获得扫描后的数据已经建议
export function getScanApi(barcode){
	return request({
		url:`/api/food/${barcode}`,
		method:'get',
		header:{
			'userToken':uni.getStorageSync("userToken")
		}
	})
}

//用户上传头像
export function uploadUrl(img){
	return request({
		url:'/admin/common/upload',
		method:'post',
		Header:{
			"userToken":uni.getStorageSync("userToken")
		},
		data:{
			"file":img
		}
	})
}

//编辑用户信息
export function EditUserApi(data){
	return request({
		url:'/user/user',
		method:'put',
		data:data,
		header:{
			"userToken":uni.getStorageSync("userToken")
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

 
 