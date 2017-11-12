const path = require('path')

//将来根据参照文件，在内存中生成index.html并且自动引入打包好的bundle.js
var HtmlWebpackPlugin = require('html-webpack-plugin')

//打包之前，删除dist目录
var CleanWebpackPlugin = require('clean-webpack-plugin')

//抽离第三方样式
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const webpack = require('webpack')

module.exports = {
    entry:{
        //属性名称是以后生成的js的名称，值是第三包的名称
        react:['react'],
        reactDom:['react-dom'],
        fetchJsonp:['fetch-jsonp'],
        bundle:'./src/main.js' //不要忘记我们自己写的那些代码了
    },
    output:{
        //publicPath:'/',//静态资源目录
        path:path.join(__dirname,'dist'),
        filename:'js/[name].js'
    },
    module:{
        rules:[
            {
                test: /\.jsx?$/,
                exclude: /node_modules/, //在进行babel转换的时候一定要加
                use: [
                  {
                    loader: 'babel-loader'
                  }
                ]
            },
            {
                test:/\.css$/,
                // use:[
                //     {
                //         loader:'style-loader'
                //     },
                //     {
                //         loader:'css-loader'
                //     }
                // ]
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!postcss-loader"
                })
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader?limit=4000&name=images/[name]-[hash:5].[ext]'
                        // options: {
                        //     limit: 4000
                        // }
                    }
                ]
            }
        ]
    },
    resolve:{
        //拓展名，当我们导入其它模块，没有写文件的后缀的时候，自动按照下面的规则补全
        extensions:['.js','.json']
    },
    plugins:[
        //打包之前，删除dist目录，写在其它插件前面
        new CleanWebpackPlugin('dist'),

        new HtmlWebpackPlugin({
            template:'./template.html', //以谁为模版
            filename:'index.html',//在内存中生成的文件名
            minify:{
                collapseWhitespace:true, //去除空格
                minifyCSS:true,//压缩css
                minifyJS:true,//压缩js
                removeComments:true//去掉注释
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
              NODE_ENV: JSON.stringify('production')//设置为生产环境
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false//干掉警告
            },
            comments: false //去掉版权信息等注释
        }),
        //这个地方有个小注意点，不要把自己业务逻辑bundle放在这里，
        //这里只放第三方
        /**
         * name:我们刚刚在entry打包入口对象里面的属性名称
         * minChunks:公共模块被使用的最小次数。比如配置为3，也就是同一个模块只有被3个以外的页面同时引用时才会被提取出来作为common chunks。
         */
        new webpack.optimize.CommonsChunkPlugin({name:["react","reactDom","fetchJsonp"],minChunks: Infinity}),

        //抽离到css目录下面的styles.css中
        new ExtractTextPlugin("css/styles.css")
    ]
}