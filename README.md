# signin
Web作业11 Sign In
## Requirements
1. 将其转变成为一个Express应用，并使用MongoDB对数据持久化
2. 修改“注册”页面，增加密码，重复密码字段，允许用户设置密码
    1. 密码为6~12位数字、大小写字母、中划线、下划线
    2. 校验密码符合格式、密码与重复密码一致
    3. 改“注册”页面URL为[http://localhost:8000/regist](http://localhost:8000/regist)
3. 添加“登录”页面，使整个应用完善为Web应用中常见的用户注册与登录子系统
    1. 用户输入正确用户名和密码之后，跳转到详情页面
    2. 登录信息不正确，停留在signin页面，并提示出错“错误的用户名或者密码”
    3. 登录界面为整个应用默认入口，其中有按钮“注册”，点击进入注册界面
4. 限制用户访问他人“详情”，当已登录用户试图通过[http://localhost:8000?username=ab](http://localhost:8000?username=ab)访问用户ab的“详情”页面时
    1. 跳转到其自身的“详情”页面
    2. 在“详情”页面显示提示：“只能够访问自己的数据”
5. 实现退出，在“详情”页面增加“退出”按钮，用户点击后，退出登录，回到“登录”页面
6. 实现保持登录
    1. 已登录用户访问http://localhost:8000 将直接跳转到其“详情”页面
    2. 用户登录应用后，关闭浏览器，再度打开浏览器，依然保持已登录状态
7. 信息安全
    用户密码加密之后存储在数据库内


## Attentions
1. 除了express外还添加了一些别的模块，主要有：
	- 	bcryptjs: v2.4.3（用于实现用户密码的加密）
	- 	clean-css: v4.2.1 (github提示原来的旧版本安全性不高)
	- 	constantinople: v4.0.1 (github提示原来的旧版本安全性不高)
	- 	expression-session: v1.17.0 (用于用户cookie)
	- 	session-file-store: v1.3.1 (session存储的相关包)
	- 	lodash: v4.17.15 (简化指令书写)
    -   node-inspect: v1.11.6 (用于nodejs程序的调试)
	- 	**mongodb: v3.4.1 (数据库的存储，注意不同版本可能会有些命令不兼容)**
	
2. 另外，老师在视频里讲解的一些模块由于我的电脑配置原因无法安装,比如
	- 	bcrypt(因此另选了bcryptjs)
	- 	node-inspector(该工具可用于调试代码)
	
3. 启动：使用cmd（非PowerShell）打开到signin文件夹路径下，使用下列命令启动服务器
`````bash
SET DEBUG=signin:* & npm start
`````
然后利用浏览器打开网址[http://localhost:8000](http://localhost:8000)，即可启动应用

1. 调试: 老师视频中所说的node-inspector因为电脑配置原因无法使用，因此添加了node-inspector包，具体调试方法与视频类似，应在signin文件夹下运行命令````` node --inspect-brk bin\www app.js routes\index.js models\user.js `````，然后打开调试器后再打开网址进行调试
    在网上搜索发现有两种打开调试器的方式：
    1. 一种是在Google浏览器中打开cmd命令下面"Debugger listening on ws://"后面的网址后按F12,点击出现的绿色六边形(如下图)

    ![Image text](https://github.com/Terry-Zheng/Sign-In/blob/master/public/images/%E5%A4%87%E6%B3%A8%E5%9B%BE1.jpg)
    2. 另一种是打开Google浏览器，打开网址[chrome://inspect/#devices](chrome://inspect/#devices) ，等待一会后点击www下方的inspect(如下图)

    ![Image text](https://github.com/Terry-Zheng/Sign-In/blob/master/public/images/%E5%A4%87%E6%B3%A8%E5%9B%BE1.jpg)
1. 注意：mongodb可能无法正常启动，应注意mongodb的Data文件夹是否建立，它不会默认建立新的文件夹，需手动添加
