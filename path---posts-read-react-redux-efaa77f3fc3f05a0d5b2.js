webpackJsonp([0xf5bda1fd8e90],{379:function(a,n){a.exports={data:{markdownRemark:{html:'<p>写react项目快一年了，最近写项目用到了<a href="https://redux-saga.js.org/">redux-saga</a>这个框架，大家总是拿，<code class="language-text">redux-saga</code>和<a href="https://github.com/gaearon/redux-thunk">redux-thunk</a>相提并论，大概都是因为大家先用了<code class="language-text">redux-thunk</code>，然后才用了<code class="language-text">redux-saga</code>的缘由吧，因为我觉得确实<code class="language-text">redux-saga</code>做的比<code class="language-text">redux-thunk</code>做的多，而且用法相差甚远。很多人没有仔细阅读过文档或者用了更上层的框架来使用<code class="language-text">redux-saga</code>，本文意在讲解作者理解的<code class="language-text">redux-saga</code>，引导大家走向我觉得正确的使用路线上。</p>\n<p>  首先，阅读<a href="https://redux-saga.js.org/docs/introduction/BeginnerTutorial.html">文档</a>是必不可少的，这个框架几乎不存在<code class="language-text">xxx看这篇就够了的道理</code>，当然，加入你的<code class="language-text">javascript</code>基本功很扎实的话，也是能够理解的。</p>\n<p>  略微的讲解一下<code class="language-text">redux-saga</code>的一些概念（这些概念也不一定很正确，可以暂且理解一下）：</p>\n<h4>effects</h4>\n<p>  我们把根节点的子任务称之为<code class="language-text">effect</code>，effect往往由一个<code class="language-text">redux-saga</code>的effect函数加上一个promise函数组合而成，<code class="language-text">redux-saga</code>的<code class="language-text">effect</code>函数控制具体开启任务的方式，而promise中承载着具体的任务的具体实现。</p>\n<p>介绍一些redux-saga的effect</p>\n<ul>\n<li><code class="language-text">take</code> 当前的generator会停止，等待一个满足take能够匹配上的action的时候才会进行下去</li>\n<li><code class="language-text">put</code> 将数据output到store，相当于redux的store.dispatch</li>\n<li><code class="language-text">call</code> 执行一个promise或者一个saga</li>\n<li><code class="language-text">fork</code> 同call一样去执行但是不阻碍当前任务队列</li>\n<li><code class="language-text">takeEvery</code> 当匹配到action的时候，执行一个saga</li>\n<li><code class="language-text">takeLatest</code> 当匹配到action的时候，取消上个同action的saga并执行一个新的saga</li>\n</ul>\n<h4>sagas</h4>\n<p>  我们把一系列任务的控制链的集合称之为<code class="language-text">saga</code>，这也是我们任务链的入口，这是一个<code class="language-text">generator</code>函数，我们能够通过<code class="language-text">yield</code>来逐个执行我们的子任务（这些子任务可以是一个<code class="language-text">saga</code>或者<code class="language-text">effect</code>），并通过<code class="language-text">while</code>、<code class="language-text">if</code>语句来控制流程。</p>\n<p><code class="language-text">redux-saga</code>提供了我们这么多控制流程的方法，那么我们就应该利用起来，所谓的利用起来，就是我们对自己应用的设计需要作出相应的改变。如果还是墨守成规的使用老方法强融<code class="language-text">redux-saga</code>这个框架，那便是误了匠心了。</p>\n<h4>举个栗子吧</h4>\n<p>假如我们要完成一个登陆登出的逻辑</p>\n<p>我们会这么设计我们的任务链</p>\n<div class="gatsby-highlight" data-language="javascript">\n      <pre class="language-javascript"><code class="language-javascript">  <span class="token keyword">function</span> <span class="token operator">*</span><span class="token function">loginFlow</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">let</span> isLogin <span class="token operator">=</span> <span class="token keyword">yield</span> <span class="token function">call</span><span class="token punctuation">(</span>checkLogin<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isLogin<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token operator">!</span>isLogin<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword">const</span> <span class="token punctuation">{</span> type <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">yield</span> <span class="token function">take</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">\'LOGINFLOW_CHANGE_USERNAME\'</span><span class="token punctuation">,</span> <span class="token string">\'LOGINFLOW_CHANGE_PASSWORD, LOGINFLOW_LOGIN\'</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n          <span class="token keyword">if</span> <span class="token punctuation">(</span>type <span class="token operator">==</span> <span class="token string">"LOGINFLOW_CHANGE_USERNAME"</span> <span class="token operator">||</span> type <span class="token operator">==</span> <span class="token string">"LOGINFLOW_CHANGE_PASSWORD"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">yield</span> <span class="token function">put</span><span class="token punctuation">(</span><span class="token punctuation">{</span> type<span class="token punctuation">:</span> <span class="token constant">LOGINFLOW_LOGIN_UPDATE_FORM</span><span class="token punctuation">,</span> key<span class="token punctuation">:</span> type <span class="token punctuation">}</span><span class="token punctuation">)</span>\n          <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n            isLogin <span class="token operator">=</span> <span class="token keyword">yield</span> <span class="token function">call</span><span class="token punctuation">(</span>login<span class="token punctuation">)</span>\n          <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword">yield</span> <span class="token function">take</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">\'LOGINFLOW_LOGOUT\'</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">yield</span> <span class="token function">call</span><span class="token punctuation">(</span><span class="token function">logout</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span></code></pre>\n      </div>\n<p>我们利用这个名为<code class="language-text">loginFlow</code>的saga描述了一个关于登录登出的流程，我们可以在应用刚开始的时候就启动这个saga，首先我们用<code class="language-text">while(true)</code>来描述一个登入登出的循环，进入流程后我们首先判断是否已经登录，如果已经登陆了，我们需要等待一个登出的action，如果没有登录，我们无限等待输入账号密码或者登录的指令，在登录之后我们改变登录的状态，并跳出循环，等待登出的指令。</p>\n<p>可能这个任务链还会存在很多bug，但是我觉得我们应该做的事情通过这个栗子已经很明显了，我们在使用<code class="language-text">redux-saga</code>的时候我们应该去定义一个主要的控制链，因为我觉得<code class="language-text">redux-saga</code>最精华的部分就是帮助我们去控制任务，去定义什么时候应该或者能够监听怎样的任务才是<code class="language-text">redux-saga</code>这个框架最具有特色的地方，不然的话，真的还是用回<code class="language-text">redux-thunk</code>吧，<code class="language-text">redux-thunk</code>也是一个非常优秀的开源项目，易懂且好用。</p>\n<h4>项目结构</h4>\n<p>针对saga我们可以新建一个saga的目录，然后再针对应用中的流程，我们新建一个<code class="language-text">flows</code>的目录来存放所有的流程saga，一个effects的目录来存放子任务的effects和sagas，模块可以先按照业务分类，在业务分类的基础上抽出一些通用的模块。</p>',frontmatter:{title:"React-redux解读",date:"11 September, 2017",tag:"react,redux"}}},pathContext:{slug:"read-react-redux"}}}});
//# sourceMappingURL=path---posts-read-react-redux-efaa77f3fc3f05a0d5b2.js.map