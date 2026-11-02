---
title: iOS Apprentice Part 2 Checklist 学习笔记
date: 2017-07-14 18:32:44
tags: [iOS 开发]
description: 前段时间学习了 Ray 家的 iOS Apprentice Part 2 Checklists, 为了更好的掌握，自己又独立重新将 App 写了一遍，发现很多知识还是不能够一次掌握，离开了书，很多功能的实现还是磕磕绊绊，也总结了一些小知识和初学者容易踩的坑，总结一下。
---
前段时间学习了 Ray 家的 iOS Apprentice Part 2 Checklists, 为了更好的掌握，自己又独立重新将 App 写了一遍，发现很多知识还是不能够一次掌握，离开了书，很多功能的实现还是磕磕绊绊，也总结了一些小知识和初学者容易踩的坑，总结一下。

### View 之间的传值
因为 Checklists 本身是一个基本的 TableView 应用, 所以我主要是想熟练掌握如何在不同 View 之间传值，如何处理 Model, View 和 Controller 之间的关系。在 App 里应用最多的一个场景，是通过一个 TableViewController, 触发一个 Segue, push modally 到下一个 TableViewController, 此时如何将下级的 Controller 里的数据传回上级，就成了一个问题。以 `ItemDetailViewControllre` 举例，此时可以定义一个 protocol, 

```
protocol ItemDetailViewControllerDelegate: class {
    func ItemDetailViewControllerDidCancel(_ controller: ItemDetailViewController)
    func ItemDetailViewController(_ controller: ItemDetailViewController, didFinishAdding item: ChecklistItem)
    func ItemDetailViewController(_ controller: ItemDetailViewController, didFinishEditing item: ChecklistItem)
}
```
在协议的定义过程中，变量往往是这个 controller 加上那个你需要传的值，然后在 class 内声明一个 `delegate` 变量：
`var delegate: ItemDetailViewControllerDelegate?`
因为无法保证其一定有 delegate对象，所以一定要加 Optional 修饰，然后在你需要传值的动作里，调用这三个方法。
之后，为了保证 `ChecklistViewController` 能够遵从此协议，要在类声明时遵从此协议，然后实现协议里定义的三个函数。最后，就是在 `override func prepare(for segue: UIStoryboardSegue, sender: Any?)` 方法里，将 delegate 的值赋给 `ChecklistViewController`，便在 storyboard 里面实现了通过 push modally 连接的两个 TableViewController 之间的传值。

### 数据的持久化

倘若不写 saving and loading 相应的代码，app 一旦从内存中移除或者闪退，写下的数据就会丢失，所以需要实现这种功能，保证下次用户打开 App 可以保留原始的数据
返回 .plist 文件储存位置的方法：

```
    func documentsDirectory() -> URL {
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        return paths[0]
    }
    
    func dataFilePath() -> URL {
        return documentsDirectory().appendingPathComponent("Checklists.plist")
    }
```
将数据具体编码（encoding) 和解码（decoding)的方法：

```
   func saveChecklists() {
        let data = NSMutableData()
        let archiver = NSKeyedArchiver(forWritingWith: data)
        archiver.encode(lists, forKey: "Checklists")
        archiver.finishEncoding()
        data.write(to: dataFilePath(), atomically: true)
    }
    
    func loadChecklists() {
        let path = dataFilePath()
        if let data = try? Data(contentsOf: path) {
            let unarchiver = NSKeyedUnarchiver(forReadingWith: data)
            lists = unarchiver.decodeObject(forKey: "Checklists") as! [Checklist]
            unarchiver.finishDecoding()
        }
    }
```
另外，每一层数据必须遵从 NSCoding 协议，并实现 `func encode(with aCoder: NSCoder` 和 ` required init? (coder aDecoder: NSCoder)` 两个方法，要讲每一种数据类型的每一个变量进行对应的编码和解码，才能保证程序的正确运行。

### init 方法的正确书写方法
iOS 的类可能会有很多初始化函数，还有各种诸如 *convenience* 和 *required* 的修饰符，还涉及负责的继承问题。想要一时间彻底弄懂也并非易事，一种标准的 init 方法编写规范是：

```
 init() {
  // Put values into your instance variables and constants
  super.init()
  //Other initialization code, such as calling methods, goes here
```
另外，一个 table view controller 会有不止一种 init 方法，他们是：
* `init?(coder)` for 自动从 Storyboard 里加载的 view controller 
* `init(nibName, bundle)` for 手动从一个 nib 文件加载的 view controller 
* `init(style)` for 用纯代码创造的 view controller

### 小技巧和注意事项
* 一定要把 segue, cell 的 identifier，以及 Controller 的 Class 在 Storyboard 里定义好
* 可以通过设定 Label 的 Tag 值方便的调用，如 `let label = cell.viewWithTag(1000) as! UILabel`
* 为了 App 界面的好看，可以设定其 `tintColor`
* 键盘⌨️的优化：
   *  在 `viewDidLoad() ` 设定 `textField.becomeFirstResponder()` 
   *  textField 勾选 *Auto-enable Reture Key* 
   *  让敲键盘回车具有和点按 按钮Done 具有一样的效果：讲 **Send Events** 里面的 *Did End on Exit* 连接到相应的动作
   *  通过将 Controller 继承 `UITextFieldDelegate` 协议，检测是否新输入文字，将 done 按钮设置为只有键盘输入文字才能点按

```
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        let oldText = textField.text! as NSString
        let newText = oldText.replacingCharacters(in: range, with: string) as NSString

        doneBarButton.isEnabled = newText.length > 
        return true
    }
```

### 总结
一个简单的三级嵌套, 不超过10个 Controller 的 App 就有这么多知识包含，而且目前也没有深入的完全掌握，更何况那些 上百个 View 的大应用，路漫漫其修远兮.....



