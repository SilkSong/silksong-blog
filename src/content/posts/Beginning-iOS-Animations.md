---
title: Beginning iOS Animations 
date: 2017-07-18 01:44:09
tags: [iOS 开发]
description: 一直对 iOS 的动画很感兴趣，美好的交互体验的确会给 App 的使用带来愉悦的感觉，也能让开发者引导着用户正确的使用 App。 最近学习了 Ray 的 Beginning iOS Animations，试着总结一下知识点，权当复习。
---

一直对 iOS 的动画很感兴趣，美好的交互体验的确会给 App 的使用带来愉悦的感觉，也能让开发者引导着用户正确的使用 App。 最近学习了 Ray 的 Beginning iOS Animations，试着总结一下知识点，权当复习。
### Constraint Animations 
在看这一部分之前，我只看过和约束无关的动画代码，它们非常不一样。然而，其实 non-constraint animations 只是你通过 animation block 直接改变一个视图的属性, 之后 UIKit 会自动想办法如何创造出动画而已。

`layoutIfNeeded()` 会对于 layout 的每一个视图更新 center, bounds, 任何一个可以动画化的改变都会发生动画效果，因为 bounds 是一个 animatable property, 即使 textLabel 的文字瞬间变化，它的 size 可能不能立刻赶上它的内容, 于是在你自定义的 animation.duration 里面它会完成这个动画效果，如：
可以对一个视图的 constraint outlet 进行三元操作，然后定义一个基本的动画效果 

```
titleLabel.text = isMenuOpen:  "Select Item" : "Picking List" 
MenuHeightConstraint.constant = isMenuOpen ？ 200 : 60

UIView.animate (
 withDuration: 0.33, 
 delay: 0.0,
 options: .curveEaseIn,
 animations: {
    self.view.layoutIfNeeded()
 }
 completion: nil )
```

### Intermediate Constraints
对于进阶一点的约束动画，在这里只的是像 `multiplier` 一样的 get only property。 通常可以使用 Storyboard 和纯代码两种方式进行multiplier constraint 的设置。
 在使用 Storyboard 的时候，可以设置 `constraint.identifier`, 然后 isActive = false, 就相当于删掉了这个约束，然后通过创建一个与其 identifier 相同的一个新的约束即可，然后不要忘记设置 `isActive = true`, 这里的思想就是既然属性只是可读，那就干脆删掉这个约束，重新创建一个。
 
 在这里，我对于 frame.size.width 和 frame.width 这两个概念模糊不清, google 搜到了 stackoverflow 上的一个回答，又自己查阅了文档，算是搞明白了。
>  Regardless of whether the height is stored in the CGRect data structure as a positive or negative number, this function returns the height as if the rectangle were standardized. That is, the result is never a negative number.
> A CGSize structure is sometimes used to represent a distance vector, rather than a physical size. As a vector, its values can be negative. To normalize a CGRect structure so that its size is represented by positive values, call the standardized function.

size 是属于 CGSize 结构体，而 frame 是属于 CGRect 结构体，于是差别显而易见了，frame.width 只可以是正值，而 frame.size.width 可以是负值，可以通过 `standardized` 方法取正。
另外，可以通过定义看到 CGRect 定义的 width, height 属性只有 getter， 所以当我们需要为其赋值的时候，就只能使用 frame.size.width 了

### Spring Animation 

只需要在 UIView.animate() 中添加 `uingSpringWithDamping` and `initialSpringVolocity`
Damping: 震动越大，越接近于 0。不过，值的设定还是会带来显而易见的差别，需要更多的使用来慢慢体会。

### View Transitions
实例代码：

```
UIView.transition(
        with: imageView,
        duration: 1.0,
        options: [
          .curveEaseIn,
          .transitionFlipFromBottom
        ],
        animations: {
          imageView.isHidden = true
        },
        completion: {_ in
          imageView.removeFromSuperview()
        }
      )
```
 其实主要就是通过这个函数，通过在 animations 的闭包里的 triggers 触发动画发生的条件，比如 `isHidden`, `addSubview()`, `removeFromSuperview()` 等，在 options 里可以对各种动画效果进行组合，往往会有很酷炫的效果~
 另外，一些 button 往往需要保证其在发生动画的时候也可以进行交互，此时可以在 options 中添加 `.allowUserInteraction`

###  Beginning View Animations

关于一个 View 通常有三类 property 可以 animate 

* Position & Size
    * bounds： Repositions a view's content
    * frame:  to move or resize a view
    * center: mvoe a view to a new location onscreen
* Transformation:  
  * transform: 
       * translation
       * rotation
       * scale
* Appearance: 
   * backgroundColor
   * alpha: creates fade in and fade out effects


这里比较实用的比如通过设置 alpha 值实现渐变效果，通过设置 center 或者 frame，当 label 的值改变时，可以有转变的效果。其步骤如下：
 1.  Create & Set up helper view
 2. Fade helper view
 3. Update background view and remove helper view 


```
let overlayView = UIImageView(frame: bgImageView.frame)
    overlayView.image = toImage
    overlayView.alpha = 0.0
    bgImageView.superview?.insertSubview(overlayView, aboveSubview: bgImageView)
    
    UIView.animate(
        withDuration: 0.5,
        animations: {
            //Fade helper view
            overlayView.alpha = 1.0
        },
        completion: { _ in
            //Update background view and remove helper view
            self.bgImageView.image = toImage
            overlayView.removeFromSuperview()
        })

    //Add 
    overlayView.center.y += 20
    overlayView.bounds.size.width = bgImageView.bounds.size.width * 1.3
    
    In UIView.animate closure {
     overlayView.center.y -= 20
            overlayView.bounds.size = self.bgImageView.bounds.size
     }
    
```

### Intermediate View Animations

```
func moveLabel(
    label: UILabel,
    text: String,
    offset: CGPoint
  ) {
    //Create & Set up helper label
    let auxLabel = duplicateLabel(label: label)
    auxLabel.text = text
    
    auxLabel.transform = CGAffineTransform(translationX: offset.x, y: offset.y)
    auxLabel.alpha = 0
    view.addSubview(auxLabel)
    
    //Fade out & translate real label
    UIView.animate(
        withDuration: 0.5,
        delay: 0,
        options: .curveEaseIn,
        animations: {
            label.transform = CGAffineTransform(translationX: offset.x, y: offset.y)
            label.alpha = 0
        },
        completion: nil
    )
    
    //Fade in & translate helper label
    UIView.animate(
        withDuration: 0.25,
        delay: 0.0,
        options: .curveEaseIn,
        animations: {
//            auxLabel.transform = CGAffineTransform(translationX: -offset.x, y: -offset.y)
            auxLabel.transform = .identity
            auxLabel.alpha = 1
    },
        completion: { _ in
            //Update real label & remove helper label
            label.text = text
            label.alpha = 1
            label.transform = .identity
            
            auxLabel.removeFromSuperview()
        }
    )
```
### Keyframe Animations
通过 `UIView.animateKeyframes` 函数，在 animations 的闭包里不断的添加 `UIView.addKeyframe` 来创建一段段的动画，看起来简单，但当面对一个动画效果，如何通过分析将其拆解成多个小部分，并较为准确的设置 `Duration` 和 `startTime`，让动画看起来流畅才是难点。这个过程往往需要调试很多很多次。


###Beginning View Controller Transitions
每一个过渡都离不开 transition context，它包含一个 `containerView`, 可以视为一个 superview。
自定义过渡动画，需要继承两个 delegate ：

* ` UIViewControllerTransitioningDelegate` ： 每次你 present 或者 dismiss 一个 VC的时候  UIKit 都会询问这个 delegate 是否使用一个自定义的过渡动画，它有两个 required method，分别对应 present 和 dismiss 的具体行为
* `UIViewConrollerAnimatedTransitioning`: 继承这个 delegate 的类往往叫做 animator, 也就是其具体定义动画的方式。其中，`transitionDuration` 定义动画的时间，而 `animateTransition` 则具体实现动画的内容。

你需要通过在继承第一个协议的类中声明它的代理是继承了第二个协议的类，这样子才能将两个协议连接起来：
`detailViewController.transitioningDelgate = view controller`

创建过渡动画的过程也通常有三步：

1.  Set up transition
2. animate!
3. complete transition 

知道真相的我眼泪掉下来，这不是和如何把大象🐘装到冰箱一样么.... lol 
当然，其实具体的实现是非常的复杂..
这个过程中，有一个小坑，就是往往在第一步里面，我们需要设置好所有想要动画的试图的起始状态，比如说它的位置，它的大小，而往往它的 frame 和我们在 animator 里通过 containerView 调用的 frame 并不在统一坐标系里面，所以会造成动画效果失败，这时, 可以通过调用 

```
convert(_ rect: to view:) 
```
它的作用在于将一个 矩形从 receiver 的坐标系转移到另一个视图所在的坐标系，如何其设置为 nil, 则会转移到 window 所在的坐标系，这个坐标系也往往会和进行转场动画所在的 VC 的坐标系相同。例子：

```
transition.originFrame = selectedImage!.superview!.convert(  selectedImage!.frame,to: nil )
```

### Intermediate View Controller Transitions

这一节更多的是具体的一些细节优化，如圆角动画等等

### 最后

开发者在设计一个动画的时候， 要搞清楚它的目的，并且遵循 Apple' design paradigms 和 Human User Interface, 好的动画往往能更直观的表达信息。过于复杂的动画反而会显得累赘，让交互看起来费劲。

