// import {defineStore} from 'pinia'

// // export const useCounterStore = defineStore('counter',{
// // 	state: ()=>{
// // 		return {count:0};
// // 	},
// // 	actions: {
// // 		increment(){
// // 			this.count++;
// // 		}
// // 	}
// // })

// //定义用户存储
// export const useUserStore = defineStore('userStore',{
// 	state :()=>{
// 		return{
// 			//登录token
// 			token:uni.getStorage("token") || '',
// 			//登录用户信息
// 			userInfo:JSON.parse(uni.getStorage("userInfo") || '{}');
// 		}
// 	},
// 	getters:{},
// 	actions:{
// 		//设置token
// 		setToken(token){
// 			this.token = token
// 			uni.setStorageSync('token':token)
// 		},
// 		//设置用户信息
// 		async setUserInfo(userInfo){
// 			this.userInfo = userInfo;
// 			uni.setStorageSync({
// 				'userInfo':JSON.stringify(userInfo);
// 			})
// 		},
		
// 		//清楚用户信息
// 		clearUserInfo(){
// 			this.token = ''
// 			this.userInfo = {}
// 			uni.removeStorage('token')
// 			uni.removeStorage('userInfo')
// 		}
// 	}
// })
