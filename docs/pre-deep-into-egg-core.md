---
title: "深入egg-core前篇"
date: '2018-12-18'
tag: node,egg
---

> 我知道node并不是一个语言，所以本文提及的**node作为服务器语言**皆代表node环境下的Javascript

> 众所周知，[egg](https://eggjs.org/)是现今一个非常流行的node框架，好像是起源于阿里，还记得刚入前端的时候觉得前端未来的发展有无穷的方向，node算是一个方向，而node作为Server应用而言，也是一个比较重要的方向，时隔3年，node在server服务语言的竞争上感觉是不进反退，java、php、ruby、.net、go等等或许都更加流行。

**我们会抛出一个问题，为什么Javascript在和这些语言竞争作为一个Server的语言中落了下风？**

按照Javascript的基础开发人员人数来看，这本是一个非常美妙的事情，庞大的人口基数，如果存在一定的转化率的话，最后使用Javascript依赖node环境来进行Server端开发可以说最后的结果应该非常可观。

在node环境上使用Javascript进行开发Server的体验可以说完爆类似于Java这种需要编译才能运行的语言，或许只要若干行代码就能简单的实现一个Server，而这些或许Java的Server需要引入一个笨重的框架或者将代码编译后放入特定的环境中(比如tomcat之类的)才能够跑起来，相比之下node的开发体验更好而且更加敏捷。

Node的单进程无堵塞IO的特性在设计上非常适合高并发且非CPU密集型的Server，如果服务器的逻辑不存在非常复杂的CPU计算，那么使用Node开发是非常好的。

诸如此类的有点Node有非常多，那么为什么它还是不够流行呢?我指的流行起码...要占到Java一般的份额。这个问题我思考了很久，或者说我之前一直没有站在一个企业级的角度上来思考。

**我们回看Node的曾经，或许我们会找到答案**

_一个优秀的语言在一个企业级的Server选型上根本不够_。我们先去寻找一些那些流行的语言的优点，Java为例。我们会发现针对Java作为一款WebServer的框架非常完善而且非常统一，虽然我不是很懂，但是总听见Springxxx之类的，对的，全世界似乎都在用这个框架，只要是一个做Java的WebServer必须要懂得都是这个，简单的应用有的开发人员甚至连数据库的SQL都不需要会，上手速度极快！我们总说框架是什么，**框架 - 是拉近高端开发者和低端开发者的工具**。科技是一种进步，就好像有个绝世高手在如今站在机枪导弹的面前也只是一只蚂蚁。如果这点能够理解的话，我们就能够大概明白，其实Node比较缺乏的是一个好的框架，一个能够针对企业级的需求的框架。

**我们会看Node的几个常用的框架**

[tj](https://github.com/tj)做了一个众所周知的入门级框架 [express](https://github.com/expressjs/express)，我们一定要承认的是`express`是一个非常了不起的框架，也非常适合新手入门，因为`express`是基于原生的Node的server的IncomingMessage上做扩展的，内部调用的API除了一些扩展的API，所有的原生的API都可以调用，加入是一位对Node的http比较熟悉的开发人员，上手这个框架或者去阅读这个框架的代码是很好的。除此之外`express`提供了非常灵活的中间件机制，这位一个WebServer的扩展性提供了可能，让开发人员的手段更加灵活，在Node支持了async/await之后更是如虎添翼，可以发现用`express`编写WebServer真的会比较快捷。

而之后[tj](https://github.com/tj)又做了一个也非常著名的框架，这个框架也是如今比较流行的`egg`的基础，那就是[koa](https://github.com/koajs/koa)，tj也把这个项目骄傲的放在了他的首页上。`koa`对`express`的设计作出了修改，将原本在原`IncomingMessage`上做扩展的设计修改了，`IncomingMessage`对开发者隐藏，并修改了中间件的模型，从原本的线性模型改为了洋葱模型，这个模型让中间件拥有处理一个请求输入和输出的能力，而不像`express`只能单纯的让中间件只处理输入或者输出。从开发的体验上来说，我觉得这是极好的。

发展到`koa`的时候，其实我觉得已经很不错了。这个不错的夸赞我觉得是针对tj对node的封装，但是这对于一个企业级的方案来说，还是太微弱了，接下来我觉得我可以说说我对一个企业级的WebServer的框架的需求:

**开箱即用(简单而全面)** 企业级的解决方案绝对是开箱即用的，因为企业级的框架都是期望被统一维护的，不会期望开发者对框架作出太多的修改，所以对于一个开发者而言，一定是开箱即是一个完整的方案，他只需要关注自己的业务代码，这也是一个开发者的职责。

**高可用** 企业级的解决方案绝对是高可用的，Server可能是一个企业的产品甚至可以是一个企业的命脉，我们的框架一定需要做到稳定。代码总是会有BUG的，框架也是代码，所以我们首先会期望BUG尽可能的少，再者我们期望代码的bug是可以追溯的，至少可以准确定位问题。

**扩展性** 企业的业务总是会变化，有的时候会需要从框架的角度来处理这些问题，我们当然希望我们的框架是具有一定的扩展性，能够支持自定义启动、定时任务、协议、鉴权、测试、Mock等等。

**统一** 企业的解决方案是期望统一的，这样开发者在项目间迁移不会感到陌生，可以快速的进入业务的代码开发，而在一些统一处理比如鉴权或者数据层连接上能够统一的维护也是非常重要的。

`koa`针对上面的几个需求，或许在扩展性上能够崭露头角，但是其他方面还不够，而扩展性而言也太过基础，很多方面的扩展，比如自定义启动，定时任务等等都需要太多的代码量来覆盖，而且这些代码往往在多个项目中都是重复的，这不是一个企业级框架的样子。

**`egg`的诞生可以说是解决了这些问题**，他更像是一个企业级的解决方案，插件的扩展性和Framework的统一性对企业级的开发非常友好，越来越多的社区开发人员或许对他的高可用提供了一定的帮助，但是这个还是待探究的。为了能够更好的使用这个框架，我们需要深入内部，一探究竟，期待一下这个[egg系列](/posts/egg)

最后，如果会有人觉得node成为一个流行的服务器开发语言会前端开发的价值提升，或许Node的开发人员会获得类似Java开发的待遇，其实不然，Node作为一个非密集型CPU计算友好的语言来看，一些业务的核心复杂计算逻辑不适合使用node来实现，而掌握复杂算法逻辑的开发人员才是一个公司或者一个项目的价值所在，所以如果你是一个对公司有巨大价值的人，那么你不会使用node，如果你使用node，那么你就无法成为那个价值所在，这是互相矛盾的。因此我觉得Node的流行不能够本质上改变那些从前端转入Node的人员的价值，Node更应该作为一种手段或者一个兴趣，比如同样是写代码，你更愿意开发WebServer的话，可以考虑Node这样。并不是说你使用Javascript开发了WebServer你就提升了你的价值。