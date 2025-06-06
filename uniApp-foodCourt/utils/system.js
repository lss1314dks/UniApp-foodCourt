import { ref } from 'vue';

const SYSTEM_INFO = uni.getSystemInfoSync();
export const getStatusBarHeight = ()=>SYSTEM_INFO.statusBarHeight || 15

export const getTitleBarHeight = ()=> {
		if(uni.getMenuButtonBoundingClientRect){
			let {top,height} = uni.getMenuButtonBoundingClientRect();
			return height +(top - getStatusBarHeight) *2 
		}else{
			return 40;
		}
}