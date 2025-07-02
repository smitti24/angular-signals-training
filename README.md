# 📚 Angular Signals Day By Day Learning Plan

> **A comprehensive journey to master Angular Signals through theory and practical application**

This project serves as a structured lesson plan to learn Angular Signals. It follows a day-by-day approach combining theoretical concepts with hands-on practice. By the end of this journey, you'll have mastered Angular Signals and built a fully functional application.

---

## 🎯 Day 1: Signals Theory – The Fundamentals

### 🔍 What is a Signal?

A **Signal** is a reactive value container that:

- 📦 **Holds a piece of data** (like a variable)
- 🔔 **Notifies everyone** when that data changes
- 🔗 **Tracks dependencies automatically** (no manual subscriptions needed)

#### 💡 Analogy: Spreadsheet Cell
Think of a cell in Excel:
- If `A1 = 5` and `B1 = A1 + 5`
- Updating `A1` automatically updates `B1`
- **Signals work exactly the same way!**

### 🚀 Why Signals? What Problem Do They Solve?

#### ⚠️ Before Signals:
- Angular relied heavily on **Zone.js** for change detection
- **RxJS Observables** were overkill for simple state management

#### ✅ After Signals:
- 🎯 **Granular Updates**: Only components using changed Signals re-render
- 🔧 **Simpler Syntax**: No `.subscribe()` or `| async` pipes required
- 🐛 **Predictable**: Synchronous by default, making debugging easier

### 🔍 Core Signal API

#### 📦 Creating a Signal

Import the signal function from Angular core:
```typescript
import { signal } from '@angular/core'
```

Create a signal with an initial value:
```typescript
const count = signal(0) // Initial value is 0
```

> 💡 **Note**: `signal()` returns a **getter** function with **setter** methods attached

#### 📖 Reading a Signal

To read the current value, call the signal as a function:
```typescript
console.log(count()) // Outputs: 0
```

#### ✏️ Updating a Signal

There are two main methods to update signals:

**1. `set()` Method** - Direct value assignment
```typescript
count.set(5) // Sets the value directly to 5
```
> 💭 *"Here is the new value"*

**2. `update()` Method** - Functional update
```typescript
count.update((currentValue) => currentValue + 1) // Increments by 1
```
> 💭 *"Here is how to calculate the new value"*

#### ❓ Common Questions

**Q: Can I use `set()` on a `const` signal?**  
**A:** Yes! The `const` keyword prevents reassigning the signal variable itself, but you can still call methods like `set()` and `update()` on the signal object.

```typescript
const count = signal(0) // ✅ This is fine
count.set(5)           // ✅ This works - we're calling a method
// count = signal(10)  // ❌ This would fail - reassignment not allowed
```



