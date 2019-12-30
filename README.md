# 修改page与component 原生写法，修改为class方式加注解@


## 组件class js写法（json、wxml、wxss使用不变）
```
// 组件装饰器
// properties 可直接写在装饰器中，优先级最高
@Componented({
    //组件properties
    properties: {
        propKey1: "propValue1",
        propKey2: "propValue2",
    }
}) 
export default ComponentName extends BaseComponent {

    //此处若无操作可以省略构造方法
    constructor() {
        super();
        this.data = {
            dataKey: "dataValue",
            ...this.data
        }
        //properties 也可写在此处
        this.properties = {
            propKey: "propValue",
            ...this.properties
        }
    }

    //data除了写到constructor，也可以直接写到此处
    data = {
        ……
    }
    
    //properties 也可写在此处
    properties = {
        ……
    }

    @Compute // 计算返回值， wxml 中使用: xxxx="{{computeKey}}"
    computeKey() {
        ……
        return result;
    }

    @Watch // data 或 properties 中 watchKey 修改时回调
    watchKey() {
        ……
        do sth or this.setData({……});
    }

    // 生命周期函数会自动识别并加入到lifetimes，同样适用于pageLifetimes
    ready() {

    }
    ……其他生命周期函数

    // 此写法也一样可用，优先级比直接写高
    lifetimes = {
        ……
    }
    
    // 此写法也一样可用，优先级比直接写高
    pageLifetimes = {
        ……
    }

    //普通方法直接写到此处，不能与生命周期函数同名
    myFunction() {
        ……
        // 触发watch与compute
        this.setData({……})
        ……
    }
    
    ……

}

```

## 页面class js写法（json、wxml、wxss使用不变）
```
@Paged // 页面装饰器
export default PageName extends BasePage {

    //此处若无操作可以省略构造方法
    constructor() {
        super();
        this.data = {
            dataKey: "dataValue",
            ...this.data
        }
    }

    //data除了写到constructor，也可以直接写到此处
    data = {

    }
    
    @Compute // 计算返回值， wxml 中使用: xxxx="{{computeKey}}"
    computeKey() {
        ……
        return result;
    }

    @Watch // data 中 watchKey 修改时回调
    watchKey() {
        ……
        do sth or this.setData({……});
    }

    // 生命周期函数
    onLoad() {

    }
    ……其他生命周期函数

    //普通方法直接写到此处，不能与生命周期函数同名
    myFunction() {
        ……
        //触发watch与compute
        this.setData({……})
        ……
    }
    
    ……
}


```
