---
title: <译> Best Way to dismiss Keyboard in a View Controller iOS (Swift)
date: 2017-07-24 16:30:52
tags: [iOS 开发]
description:  我一直思考在 iOS 应用中隐藏键盘的所有方法，并找到适合我的最好的方法。键盘是 `UITextFields` 的第一响应对象，一旦你开始编辑，键盘就会出现。
---

我一直思考在 iOS 应用中隐藏键盘的所有方法，并找到适合我的最好的方法。
键盘是 `UITextFields` 的第一响应对象，一旦你开始编辑，键盘就会出现。写代码来隐藏它是每一个开发者的责任。让我来解释几种方法来完成这件事情，尤其是当你的 view controller 有多个 `UITextField` 的时候。

**First Way**:  实现 `textFieldShouldReturn` delegate 来隐藏键盘


```
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
       textField1.resignFirstResponder()
       textField2.resignFirstResponder() 
       return true
  }
```

这个方法会显得有点笨重，当你的 view controller 里有太多的 `textField` 的时候

**Second Way**: 在 `textFieldShouldReture` 实现里，你可以直接调用 self.view 方法 `endEditing` 


```
func textFieldShouldReturn(textField: UITextField) -> Bool {
   self.view.endEditing(true)
   return true;
}
```
简洁清楚，不是么？

**Third Way**: 第二种方法可能是最好的方法，不过有一种情况就是你的键盘没有 *return* 键，比如数字键盘 （UIKeyboardType.NumberPad)
解决方法可以是在键盘上方添加一个 `UIToolbar` 然后设置一个目标方法


```
override func viewDidLoad() {
   super.viewDidLoad()
   //init toolbar
   let toolbar:UIToolbar = UIToolbar(frame: CGRect(x: 0, y: 0,  width: self.view.frame.size.width, height: 30))
   //create left side empty space so that done button set on right side
   let flexSpace = UIBarButtonItem(barButtonSystemItem:    .flexibleSpace, target: nil, action: nil)
   let doneBtn: UIBarButtonItem = UIBarButtonItem(title: “Done”, style: .done, target: self, action: #selector(doneButtonAction))
   toolbar.setItems([flexSpace, doneBtn], animated: false)
   toolbar.sizeToFit()
   //setting toolbar as inputAccessoryView
   self.textField1.inputAccessoryView = toolbar
   self.textField2.inputAccessoryView = toolbar
}
@Objc func doneButtonAction() {
  self.view.endEditing(true) 
}
```

**Best Way**:
有什么能比单指点按 view controller 任何地方来隐藏键盘更好的呢？只需要一行代码就能完成我们的目的。

```
self.view.addGestureRecognizer(UITapGestureRecognizer(target: self.view, action: #selector(UIView.endEditing(_:)))
```
是它么？

正如本叔叔（Uncle Ben) 所说，“更大的权利伴随着更大的责任”，如果你正在处理 Table Views 并在上面添加 Tap 手势, 那么你可能会遇到一些问题。问题在于当选中某一行时，`didSelectRowAtIndex` 可能不会触发知道长按。
所以这里有一个解决方法。将上述代码改成下面：

```
let tap = UITapGestureRecognizer(target: self.view, action: #selector(UIView.endEditing(_:))
tap.cancelsTouchesInView = false
self.view.addGestureRecognizer(tap)
```
仅仅是确认 `cancelsTouchesInView` 设置为 `false`


原文地址： https://medium.com/@KaushElsewhere/how-to-dismiss-keyboard-in-a-view-controller-of-ios-3b1bfe973ad1


