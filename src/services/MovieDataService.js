import fetchJsonp from 'fetch-jsonp'

export default {
    /**
     * 根据电影类型，获取对应的电影列表数据
     * 
     * @param type 电影类型 
     * @param callback 回调函数
     */
    /**
    getMovieListByType(type,callback){
        const url = `http://127.0.0.1:3000/getMovieListByType?type=${type}`
        fetch(url).then(function(response) {
            return response.json();
        }).then(function(data) {
            callback(data)
        }).catch(function(e) {
            console.log("Oops, error");
        })
    }
     */

    //Promise版本
    getMovieListByType(type){
        //1.创建一个promise对象
        /**
         * 在创建Promise对象的时候，要给它传递一个回调函数
         * 回调函数又有两个参数resolve,reject(这两个都是函数)
         * resolve 把成功的结果返回给需要的组件
         * reject 把失败的结果返回给需要的组件
         */
        var promise = new Promise(function(resolve, reject) {
            const url = `http://127.0.0.1:3000/getMovieListByType?type=${type}`
            fetch(url).then(function(response) {
                return response.json();
            }).then(function(data) {
                resolve(data)
            }).catch(function(err) {
                reject(err)
                console.log("Oops, error");
            })
        });

        //2.把promise对象返回给调用我们这个方法的文件
        return promise
    },
    /**
     * 根据电影id获取电影详情数据
     * @param movieId 电影Id 
     */
    getMovieInfoById(movieId){
        //1.创建Promise对象
        const promise = new Promise(function(resolve,reject){
            const url = `http://api.douban.com/v2/movie/subject/${movieId}`
            fetchJsonp(url).then(function(response){
                return response.json()
            }).then(function(data){
                resolve(data)
            }).catch(function(err){
                reject(err)
            })
        })

        //2.返回promise
        return promise
    }
}