# Cypress 学习 FAQ

> 问答式整理Cypress学习过程中遇到的具体问题

## 🔍 搜索提示
使用 Ctrl+F (Windows) 或 Cmd+F (Mac) 搜索关键词

---

## Q1: 如何单独执行一个测试用例？
**A**: 有三种方法：
1. 在测试用例前加 `.only()`
2. 命令行: `npx cypress run --spec "文件路径"`
3. 图形界面: `npx cypress open` 然后选择文件

---

## Q2: 为什么我的CSS选择器 `input[type="text"]:not(.action-email)` 不选择email和password输入框？
**A**: 因为：
- Email输入框的type是"email"，不是"text"
- Password输入框的type是"password"，不是"text"
- 选择器只匹配type="text"的输入框

---

## Q3: `cy.wrap()` 是做什么用的？
**A**: 将jQuery对象转换为Cypress命令链，让你可以对jQuery查询结果使用Cypress命令如 `.click()`, `.type()` 等。

---

## Q4: 什么时候用 `.then()` 什么时候用 `.should()`？
**A**:
- `.then()`: 需要使用原生JavaScript/jQuery时，不会自动重试
- `.should()`: 进行断言验证时，会自动重试直到条件满足

---

## Q5: 如何处理页面上动态生成的元素？
**A**: 使用条件判断：
```javascript
cy.get('body').then(($body) => {
  const elements = $body.find('selector')
  if (elements.length > 0) {
    // 处理找到的元素
  }
})
```

---

## Q6: 为什么测试有时候找不到元素？
**A**: 可能的原因：
1. 元素还没有加载完成
2. CSS选择器写错了
3. 元素在iframe里
4. 元素被其他元素遮挡

---

## Q7: 如何在Cypress中添加调试信息？
**A**: 使用 `cy.log('信息')` 来记录调试信息，会显示在测试运行日志中。

---

## Q8: 测试运行太慢怎么办？
**A**:
1. 使用 `--headless` 模式运行
2. 减少 `cy.wait()` 的使用
3. 使用更精确的选择器
4. 只运行必要的测试用例

---

## Q9: 如何模拟用户的复杂操作序列？
**A**: 将操作分解为多个步骤，每步都进行验证：
```javascript
cy.visit('url')
cy.get('input1').type('value1')
cy.get('button').click()
cy.get('result').should('contain', 'expected')
```

---

## Q10: 什么是页面对象模式？
**A**: 将页面元素和操作封装在类或对象中，提高代码复用性和可维护性。(待学习)

---

*最后更新: 2026-01-20*