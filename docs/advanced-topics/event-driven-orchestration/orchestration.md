# Event Driven Orchestration

基于事件的botlet装配：

1. resp事件：on-response, on-error
   **flow方式**来编排，允许关键字：
    默认正常resp才触发，允许加修饰语，
    默认修饰语：when， then
                 可以是if then, while, for.. case
2. 非resp事件
   1. server事件
      登记哪个client的webhook entry订阅哪个types，必要的映射？etype，otype，data，toWhom?
   2. action事件：pre-X, 
      - 依然flow方式，when 上面加event定语
      - 或者在端点上加，变成Botlet的一部分，
        - c端点的action事件：挂载Botlet

## 挂载法，和flow法

在事件上挂Botlet指令，
或者单独flow脚本，

属于同一种，放在不同地方而已。

### auth Botlet

c端点，

## 数据传输

string or object

来自不同client的数据，有不同的格式，如何做统一处理，
特别是flow上，上一个事件的输出，接入下一个输入时，
存在数据来源不同的问题，
action事件来自client，resp事件来自server，
也就是说Botlet接收的数据，可能是任意格式，
理论上来说，数据来自哪个端点，该端点就负责数据解析，
Botlet间传递的数据，要溯源，来自哪个端点，由他负责解析？

还是说不解析？如何从数据包内，获取特定数据
进来一个或回传一个数据包，我要获取特定值时，需要端点支持，
抑或端点将数据转为标准格式：
server响应交给client/next之前，先将数据正规化为json或string？
按照下一个端点的entry签名做正规化！

当前端点负责为下一个端点解包，
c端点是已经上游准备好的数据，s端点是3口
事件传给下个端点前，先弄清对方要什么，准备好了再给他，
可能跨Botlet的端点

1. botlets间传递，在系统内，
2. 最后一个Botlet resp发回最初的cb，可以看做一个冒泡回传过程
