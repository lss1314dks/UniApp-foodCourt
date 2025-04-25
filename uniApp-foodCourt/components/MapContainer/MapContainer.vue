<template>
    <div id="container"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
defineProps(['isTrueGeolocation']);
// 引入高等地图
import AMapLoader from '@amap/amap-jsapi-loader';
// 高德地图
let map = null;
let message = ref(false);
let isGeolocation = ref(false);

onMounted(() => {
    window._AMapSecurityConfig = {
        securityJsCode: "766d0e1839a4cfb75304069351c383e2",
    };
    AMapLoader.load({
        key: "b8b1f09933ae7cf96535e9e265117082", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Scale", "AMap.Geolocation"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    })
      .then((AMap) => {
            map = new AMap.Map("container", {
                // 设置地图容器id
                viewMode: "3D", // 是否为3D地图模式
                zoom: 11, // 初始化地图级别
                center: [106.555525,29.559858],// 初始化地图中心点位置
                resizeEnable: true
            });
            // 定位插件
            let geo_location = new AMap.Geolocation({
                enableHighAccuracy: true, //是否使用高精度定位，默认:true
                timeout: 10000, //超过10秒后停止定位，默认：5s
                buttonPosition: 'RT', //定位按钮的停靠位置
                buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
            });
            map.addControl(geo_location);
			geo_location.getCurrentPosition(function(status,result){
			        if(status=='complete'){
			            onComplete(result)
			        }else{
			            onError(result)
			        }
			});
        })
      .catch((e) => {
            console.log(e);
        });
});

//解析定位结果
function onComplete(data) {
 //    document.getElementById('status').innerHTML = '定位成功';
	// console.log("定位成功");
	// console.log("定位结果和类别"+data.position);
 //    var str = [];
 //    str.push('定位结果：' + data.position);
 //    str.push('定位类别：' + data.location_type);
 //    if (data.accuracy) {
 //        str.push('精度：' + data.accuracy + ' 米');
 //    } //如为IP精确定位结果则没有精度信息
 //    str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
 //    document.getElementById('result').innerHTML = str.join('<br>');
 console.log("定位信息 "+data.position);
 console.log("定位精度: "+data.accuracy)
 console.log(data)
}
//解析定位错误信息
function onError(data) {
	console.log("定位失败")
    document.getElementById('status').innerHTML = '定位失败';
    document.getElementById('result').innerHTML = '失败原因排查信息:' + data.message;
}

</script>

<style lang="scss">
#container {
    width: 100%;
    height: 200%; /* 设置高度为视口高度 */
}

#status,
#result {
    padding: 10px;
}
</style>