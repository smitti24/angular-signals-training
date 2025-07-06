# 📚 Angular Signals Day By Day Learning Plan

> **A comprehensive journey to master Angular Signals through theory and practical application**

This project serves as a structured lesson plan to learn Angular Signals. It follows a day-by-day approach combining theoretical concepts with hands-on practice. By the end of this journey, you'll have mastered Angular Signals and built a fully functional application.

---

## Day 1: Signals Theory – The Fundamentals

### What is a Signal?

A **Signal** is a reactive value container that:

- **Holds a piece of data** (like a variable)
- **Notifies everyone** when that data changes
- **Tracks dependencies automatically** (no manual subscriptions needed)

#### Analogy: Spreadsheet Cell
Think of a cell in Excel:
- If `A1 = 5` and `B1 = A1 + 5`
- Updating `A1` automatically updates `B1`
- **Signals work exactly the same way!**

### Why Signals? What Problem Do They Solve?

#### Before Signals:
- Angular relied heavily on **Zone.js** for change detection
- **RxJS Observables** were overkill for simple state management

#### After Signals:
- **Granular Updates**: Only components using changed Signals re-render
- **Simpler Syntax**: No `.subscribe()` or `| async` pipes required
- **Predictable**: Synchronous by default, making debugging easier

### Core Signal API

#### Creating a Signal

Import the signal function from Angular core:
```typescript
import { signal } from '@angular/core'
```

Create a signal with an initial value:
```typescript
const count = signal(0) // Initial value is 0
```

> **Note**: `signal()` returns a **getter** function with **setter** methods attached

#### Reading a Signal

To read the current value, call the signal as a function:
```typescript
console.log(count()) // Outputs: 0
```

#### Updating a Signal

There are two main methods to update signals:

**1. `set()` Method** - Direct value assignment
```typescript
count.set(5) // Sets the value directly to 5
```
> *"Here is the new value"*

**2. `update()` Method** - Functional update
```typescript
count.update((currentValue) => currentValue + 1) // Increments by 1
```
> *"Here is how to calculate the new value"*

#### Common Questions

**Q: Can I use `set()` on a `const` signal?**  
**A:** Yes! The `const` keyword prevents reassigning the signal variable itself, but you can still call methods like `set()` and `update()` on the signal object.

```typescript
const count = signal(0) // ✅ This is fine
count.set(5)           // ✅ This works - we're calling a method
// count = signal(10)  // ❌ This would fail - reassignment not allowed
```

---

## Day 2: Computed Signals & Derived State

### What is a Computed Signal?

A **Computed Signal** derives its value from other signals and:

- **Automatically updates** when its dependencies change
- **Lazy evaluation** - only re-calculates when needed
- **Pure function** - same inputs always produce same outputs

#### Analogy: Excel Formulas
Think of Excel formulas:
- If `A1 = 5` and `B1 = A1 + 5`
- `B1` is like a computed signal - it **automatically updates** when `A1` changes!

### Why Computed Signals? What Problem Do They Solve?

| **Benefit** | **Description** |
|-------------|----------------|
| **Performance** | Avoid redundant calculations through smart caching |
| **Consistency** | Always in sync with source data automatically |
| **Declarative** | Define *what* you want, not *how* to calculate it |
| **Dependency Management** | No manual subscription or cleanup needed |

### Creating Computed Signals

Import the computed function from Angular core:
```typescript
import { computed, signal } from '@angular/core'
```

Create a computed signal that derives from other signals:
```typescript
const count = signal(5)
const double = computed(() => count() * 2) // Returns: 10

console.log(double()) // Outputs: 10
count.set(10)
console.log(double()) // Outputs: 20 (automatically updated!)
```

### How computed() Works Under the Hood

#### 1. Dependency Tracking
```typescript
const count = signal(5)
const double = computed(() => count() * 2) // 'double' depends on 'count'
```
> The first time `double()` is read, Angular records that it depends on `count`

#### 2. Recomputation Strategy
```typescript
count.set(10) // Changes the source signal
// 'double' is marked as 'stale' but not immediately recalculated
console.log(double()) // NOW it recalculates: 10 * 2 = 20
```
> **Lazy evaluation**: Only recalculates when actually needed

#### 3. Memoization & Caching
```typescript
console.log(double()) // First call: calculates 10 * 2 = 20
console.log(double()) // Second call: returns cached value (20)
console.log(double()) // Third call: still cached (20)
```
> **Smart caching**: Avoids redundant calculations for better performance


### Advanced Theory

#### 1. Dynamic Dependencies

Computed signals can change their dependencies dynamically based on conditions:

```typescript
const useA = signal(true)
const A = signal(1)
const B = signal(2)

const dynamicValue = computed(() => useA() ? A() : B())
```

> **Note**: The computed signal will track different dependencies based on the `useA()` condition

#### 2. Error Handling

Computed signals throw errors synchronously when accessed:

```typescript
const risky = computed(() => {
    if (someCondition()) throw new Error('Oops!')
    return value()
})

// Error is thrown when risky() is called, not when computed is created
```

> **Best Practice**: Handle errors at the point where you read the computed signal

#### 3. Performance Considerations

**Avoid Heavy Computations**
- Computed signals run on the main thread
- Heavy calculations can block the UI

**Use `untracked()` for Non-Reactive Reads**
```typescript
import { untracked } from '@angular/core'

const data = computed(() => {
    const nonReactiveValue = untracked(() => getConfig())
    return nonReactiveValue + reactiveValue()
})
```

> **When to use `untracked()`**: When you need to read a signal's value without creating a dependency




