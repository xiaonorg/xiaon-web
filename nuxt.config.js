module.exports = {
  /*
  ** 进度条设置
  */
  loading: false,
  head: {
    title: '小恩的世界',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no'},
      {hid: 'keywords', name: 'keywords', content: '小恩,小恩的世界,博客'},
      {hid: 'description', name: 'description', content: '小恩创造的虚拟世界，这个世界有技术文章、实用工具、源码、日记等内容'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {hid: 'icon', rel: 'stylesheet', href: '/static/plugins/font-awesome/css/font-awesome-4.7.0.min.css'}
    ]
  },
  build: {
    // 改为true，执行nuxt build -a 可以在浏览器上可视化地看到js文件的体积占用情况
    analyze: false,
    publicPath: '/static/',
    babel: {
      // 将js编译为es2015，不然Android上的uc浏览器和夸克浏览器不支持
      presets: ['vue-app', 'es2015', 'stage-0']
    },
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  plugins: [
    {src: '~plugins/axios'}
  ],
  env: {
    appName: '小恩的世界',
    // 访问xiaoyun-core项目的url，如果设置了环境变量CORE_URL，则使用环境变量
    coreUrl: 'http://localhost:8083'
  }
}
