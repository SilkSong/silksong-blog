---
title: RxSwift 自定义 Delegate 实现
date: 2020-02-10 18:29:02
tags: [iOS 开发]
description:  最近在学习 RxSwift, 一个很常用的例子就是通过 UITableView 各种数据的展示和事件的点击来学习。通常我们会通过原生的 delegate 来控制各种行为，比如通过 `tableView(_:didSelectRowAt:)` 这个方法来设置点击 cell 之后的自动反选，但既然是在学习 Reactive programming, 我们期待实现下面的效果：
---

最近在学习 RxSwift, 一个很常用的例子就是通过 UITableView 各种数据的展示和事件的点击来学习。通常我们会通过原生的 delegate 来控制各种行为，比如通过 `tableView(_:didSelectRowAt:)` 这个方法来设置点击 cell 之后的自动反选，但既然是在学习 Reactive programming, 我们期待实现下面的效果：

```swift
myTableView.rx.didSelectedRowAtIndexPath.subscribe(onNext: {
  // do something
}
```

这看上去更简洁，更符合 RxSwift 的习惯，RxSwift 也提供了这种机制：`DelegateProxy`, 让我们可以实现上面的代码。

事实上，RxSwift 为我们提供了一个 `itemSelected` 变量可以作为我们学习的对象

```swift
tableView.rx.itemSelected.subscribe(onNext: { path in 
//do something
}
```

通过查看 `itemSelected` 在 UITableView+Rx.swift 的源码我们可以看到，它其实就是 delegate message `tableView:didSelectRowAtIndexPath:` 的 Reactive wrapper,
其中 source 是通过` delegate.methodInvoked` 返回的 Observable<IndexPath>


```swift
public var itemSelected: ControlEvent<IndexPath> {
        let source =  self.delegate.methodInvoked(#selector(UITableViewDelegate.tableView(_:didSelectRowAt:)))
            .map { a in
                return try castOrThrow(IndexPath.self, a[1])
            }

        return ControlEvent(events: source)
    }
```
那这就解释的通，对 itemSelected 订阅来获取通知的方法。我们继续查看 delegate 定义


```swift
 /// Reactive wrapper for `delegate`.
 /// For more information take a look at `DelegateProxyType` protocol documentation.
  public var delegate: DelegateProxy<UIScrollView, UIScrollViewDelegate> {
            return RxScrollViewDelegateProxy.proxy(for: base)
        }
```
可以看到 delegate 是原生 delegate 的 Reactive wrapper, 是一个继承了 `DelegateProxy` 的 computed property, 并且通过查资料得知，只能通过 `proxyForObject` 方法来创建它，然后我们继续了解 `DelegateProxy` 这个协议, 具体源码略长，这里就不附上，但我们了解到，它是 DelegateProxyType 的基本实现，并且了解到想要实现这个协议所必须实现的三个方法，我们试着自己定义自己的 RxDelegate: 

```swift
class MyRxTableViewDelegateProxy: DelegateProxy<UITableView, UITableViewDelegate>, UITableViewDelegate, DelegateProxyType {
    static func registerKnownImplementations() {
        self.register {
            MyRxTableViewDelegateProxy(parentObject: $0, delegateProxy: MyRxTableViewDelegateProxy.self) }
    }
    
    static func currentDelegate(for object: UITableView) -> UITableViewDelegate? {
        return object.delegate
    }
    
    static func setCurrentDelegate(_ delegate: UITableViewDelegate?, to object: UITableView) {
        object.delegate = delegate
    }
}

```
需要注意的几点是：

  1. 自定义协议遵从 `DelegateProxy`, `DelegateProxyType`,和我们想要模仿的 `UITableViewDelegate` 三个协议

  2. 让 delegate proxy 获取原生delegate对象:

```swift
static func currentDelegate(for object: UITableView) -> UITableViewDelegate? {
    return object.delegate
}
```
设置 delegate proxy 对象

```swift
static func setCurrentDelegate(_ delegate: UITableViewDelegate?, to object: UITableView) {
    object.delegate = delegate
}
```
用于向RxCocoa注册我们自定义的DelegateProxyType

```swift
    self.register {
        MyRxTableViewDelegateProxy(parentObject: $0, delegateProxy: MyRxTableViewDelegateProxy.self) }
}
```

然后我们需要定义 `rxDidSelectedRowAtIndexPath` 和它的对象 `rxDelegate`, 
依据源码我们可以很容易试着对 UITableView 扩展


```swift
extension UITableView {
    var rxDelegate: MyRxTableViewDelegateProxy {
        return MyRxTableViewDelegateProxy.proxy(for: self)
    }
    
        var rxDidSelectRowAtIndexPath: Observable<(UITableView, IndexPath)> {
      return rxDelegate.methodInvoked(#selector(UITableViewDelegate.tableView(_:didSelectRowAt:))) .map{ params in
   
        return (params[0] as! UITableView, params[1] as! IndexPath)
    }
```

而对于 Selector 方法，一个更好的写法是：

```swift
private extension Selector {
    static let didSelectRowAt =
        #selector(UITableViewDelegate.tableView(_:didSelectRowAt:))
}

```

所以我们的 `rxDidSelectRowAtIndexPath` 就变成了：

```swift
    var rxDidSelectRowAtIndexPath: Observable<(UITableView, IndexPath)> {
        return rxDelegate.methodInvoked(.didSelectRowAt).map { params in
            return (params[0] as! UITableView, params[1] as! IndexPath)
        }
    }
```

至此，我们自定义的 DelegateProxy 就可以进行原生 delegate 的功能了：


```swift
self.myTableView.rxDidSelectRowAtIndexPath.subscribe(onNext: {
            $0.deselectRow(at: $1, animated: true)
       }).disposed(by: bag)
```

