# JavaScript 面试题 (50个)

以下是50个JavaScript面试题，涵盖基础、中级和高级主题。每个问题后附简短答案。

## 基础题

1. **什么是JavaScript？**  
   JavaScript是一种脚本语言，用于网页交互和动态内容。

2. **JavaScript有哪些数据类型？**  
   原始类型：string, number, boolean, undefined, null, symbol, bigint。引用类型：object, array, function。

3. **var、let、const的区别？**  
   var有函数作用域，let和const有块作用域。const不能重新赋值。

4. **什么是undefined和null？**  
   undefined表示未定义，null表示空对象。

5. **== 和 === 的区别？**  
   == 进行类型转换后比较，=== 严格比较（类型和值）。

6. **什么是NaN？**  
   Not a Number，表示无效数字。NaN !== NaN。

7. **如何检查变量类型？**  
   使用typeof运算符，如typeof x。

8. **什么是数组？**  
   数组是存储多个值的对象，使用索引访问。

9. **如何添加数组元素？**  
   使用push()添加末尾，unshift()添加开头。

10. **什么是对象？**  
    对象是键值对的集合。

## 中级题

11. **什么是函数？**  
    函数是可重用的代码块。

12. **函数声明和函数表达式的区别？**  
    函数声明会被提升，表达式不会。

13. **什么是作用域？**  
    变量可访问的范围：全局、函数、块。

14. **什么是闭包？**  
    函数可以访问其外部作用域的变量。

15. **什么是原型？**  
    每个对象都有原型，用于继承。

16. **如何创建对象？**  
    使用对象字面量{}、构造函数new Object()、Object.create()。

17. **什么是this？**  
    指向当前执行上下文的对象。

18. **call、apply、bind的区别？**  
    call和apply立即调用函数，bind返回新函数。apply接受数组参数。

19. **什么是事件循环？**  
    JavaScript处理异步操作的机制：调用栈、任务队列。

20. **setTimeout和setInterval的区别？**  
    setTimeout执行一次，setInterval重复执行。

21. **什么是Promise？**  
    表示异步操作最终完成的对象，有pending、fulfilled、rejected状态。

22. **async/await是什么？**  
    基于Promise的异步语法糖，使异步代码更易读。

23. **什么是回调函数？**  
    作为参数传递给另一个函数的函数。

24. **如何处理错误？**  
    使用try...catch语句。

25. **什么是DOM？**  
    Document Object Model，网页的编程接口。

26. **如何选择DOM元素？**  
    使用getElementById、querySelector等。

27. **什么是事件冒泡？**  
    事件从子元素向父元素传播。

28. **如何阻止事件冒泡？**  
    使用event.stopPropagation()。

29. **什么是JSON？**  
    JavaScript Object Notation，轻量数据交换格式。

30. **JSON.stringify和JSON.parse的作用？**  
    stringify将对象转为JSON字符串，parse将JSON字符串转为对象。

## 高级题

31. **什么是ES6？**  
    ECMAScript 2015，JavaScript的新标准，引入箭头函数、模板字符串等。

32. **箭头函数和普通函数的区别？**  
    箭头函数没有自己的this，arguments，不能用作构造函数。

33. **什么是模板字符串？**  
    使用反引号` `的字符串，支持插值${}。

34. **什么是解构赋值？**  
    从数组或对象中提取值到变量。

35. **什么是展开运算符？**  
    ... 用于展开数组或对象。

36. **什么是模块？**  
    将代码分割成独立文件，使用import/export。

37. **什么是Symbol？**  
    唯一且不可变的数据类型，用于对象属性键。

38. **什么是Map和Set？**  
    Map是键值对集合，Set是唯一值集合。

39. **什么是WeakMap和WeakSet？**  
    弱引用版本，不阻止垃圾回收。

40. **什么是迭代器？**  
    对象实现next()方法，返回{value, done}。

41. **什么是生成器？**  
    函数使用yield暂停和恢复执行。

42. **什么是Proxy？**  
    用于定义对象的基本操作的自定义行为。

43. **什么是Reflect？**  
    提供操作对象的方法，与Proxy对应。

44. **什么是Web API？**  
    浏览器提供的API，如DOM、Fetch、LocalStorage。

45. **Fetch API是什么？**  
    现代异步HTTP请求API，返回Promise。

46. **LocalStorage和SessionStorage的区别？**  
    LocalStorage持久化，SessionStorage仅当前会话。

47. **什么是Service Worker？**  
    后台运行的脚本，用于缓存和推送通知。

48. **什么是WebSocket？**  
    全双工通信协议，用于实时应用。

49. **什么是内存泄漏？**  
    不再使用的内存未被释放。

50. **如何优化JavaScript性能？**  
    使用防抖节流、避免全局变量、优化循环、懒加载等。
