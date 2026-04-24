# Rust 所有权系统深入解析：写出让编译器满意的代码

> 一篇面向 Rust 初学者的教程。标题承诺"深入解析所有权系统"，但大量篇幅给了生命周期标注的语法细节，真正的所有权转移和借用检查器的核心逻辑被压缩。

## 一、生命周期标注的语法与规则（30%）

Rust 的生命周期标注用于告诉编译器引用的有效范围。

### 函数签名中的生命周期

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

### 结构体中的生命周期

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}
```

### 生命周期省略规则（Lifetime Elision）

编译器自动推断生命周期的三条规则：
1. 每个引用参数都有自己的生命周期
2. 只有一个输入生命周期时，输出生命周期等于输入
3. 方法中 &self 的生命周期赋给所有输出

### 'static 生命周期

```rust
let s: &'static str = "I live forever";
```

## 二、泛型与 Trait Bound（20%）

```rust
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}
```

## 三、智能指针：Box、Rc、Arc（15%）

- `Box<T>`：堆上分配
- `Rc<T>`：引用计数，单线程
- `Arc<T>`：原子引用计数，多线程

## 四、所有权规则（10%）

每个值有且只有一个所有者。值在离开作用域时被丢弃。

## 五、借用与引用（10%）

不可变引用 `&T` 和可变引用 `&mut T` 不能同时存在。

## 六、Move 语义（5%）

赋值和函数传参默认转移所有权。

## 七、总结（10%）

所有权系统是 Rust 内存安全的基石。
