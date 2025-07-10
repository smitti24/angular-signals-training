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

## Day 3: Signal Effects & Side Effects

### What is an `effect()`?

An **effect** is a reactive side effect that:

1. **Runs when its signal dependencies change**
2. **Automatically tracks dependencies** like `computed()`
3. **Used for:**
   - Saving to LocalStorage
   - Logging analytics
   - Triggering DOM updates outside of Angular

#### How Does an `effect()` Work?

**Automatic Dependency Tracking:**
```typescript
effect(() => console.log(count())) // Logs when `count` changes
```

**Cleanup Mechanism:**
```typescript
effect((onCleanup) => {
    const timer = setInterval(() => {}, 1000)
    onCleanup(() => clearInterval(timer))
})
```

**Runs Once Immediately:** By default, executes when first created.

#### Under the Hood

1. Angular records signals read inside the effect
2. When any dependency changes, the effect re-runs
3. Cleanup runs before the next execution

### When to Use `effect()`

| **Use Case** | **Example** |
|-------------|-------------|
| **Persisting Data** | Auto-save to LocalStorage |
| **Analytics** | Log button clicks |
| **Non-Angular DOM Updates** | Integrating with vanilla JS libraries |

### Anti-Patterns ⚠️

**❌ Do NOT:**
- Modify signals inside effects (could cause infinite loops)
- Perform heavy synchronous work (could block the main thread)

**✅ DO:**
- Use for side effects only
- Keep effects lightweight and async when possible
- Use cleanup functions for proper resource management

### Advanced `effect()` Patterns

#### 1. Conditional Effects

Use `untracked()` to prevent unnecessary re-runs:

```typescript
import { effect, untracked } from '@angular/core'

effect(() => {
    const user = untracked(() => userService.user()) // Prevents re-triggering when user changes
    
    if (user) {
        console.log('Task count:', this._tasks().length)
    }
})
```

> **Why use `untracked()`?** It reads the signal value without creating a dependency, preventing the effect from re-running when `user` changes.

#### 2. Debounced Effects

Combine signals with RxJS for advanced patterns:

```typescript
import { effect } from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import { debounceTime } from 'rxjs/operators'

effect((onCleanup) => {
    const subscription = toObservable(this._tasks)
        .pipe(debounceTime(1000))
        .subscribe(() => saveToServer())
    
    onCleanup(() => subscription.unsubscribe())
})
```

> **Use Case:** Debounce expensive operations like API calls or localStorage saves to improve performance.

#### 3. Effect Cleanup Best Practices

| **Resource Type** | **Cleanup Example** |
|-------------------|---------------------|
| **Timers** | `onCleanup(() => clearInterval(timer))` |
| **Subscriptions** | `onCleanup(() => sub.unsubscribe())` |
| **Event Listeners** | `onCleanup(() => element.removeEventListener(...))` |
| **WebSocket** | `onCleanup(() => socket.close())` |

```typescript
effect((onCleanup) => {
    const timer = setInterval(() => {
        console.log('Periodic task')
    }, 1000)
    
    onCleanup(() => clearInterval(timer))
})
```
### Effect Batching & Performance Optimization

#### Multiple Dependencies in a Single Effect

You can track multiple signals within the same `effect()`:

```typescript
const signalA = signal(1)
const signalB = signal(2)

effect(() => {
    console.log('A:', signalA(), 'B:', signalB())
    // This effect depends on both signalA and signalB
})
```

#### How Angular Handles Batching

When multiple dependencies change simultaneously, Angular uses **smart batching** to optimize performance:

| **Phase** | **What Happens** |
|-----------|------------------|
| **1. Signal Changes** | `signalA` changes, then `signalB` changes shortly after |
| **2. Stale Marking** | Effect is marked as "stale" but doesn't run immediately |
| **3. Microtask Queue** | Angular waits for the end of the current microtask |
| **4. Batch Execution** | Effect runs **once** with the latest values of both signals |

#### Example: Batching in Action

```typescript
const count = signal(0)
const multiplier = signal(2)

effect(() => {
    console.log('Result:', count() * multiplier())
})

// Trigger multiple changes
count.set(5)      // Effect marked as stale
multiplier.set(3) // Effect still stale

// At the end of microtask queue:
// Effect runs ONCE with count = 5 and multiplier = 3
// Output: "Result: 15"
```

#### Benefits of Batching

- **Performance**: Prevents redundant effect executions
- **Consistency**: Always works with the latest values
- **Predictability**: Effects run in a controlled, batched manner

> **Key Insight**: This batching mechanism ensures your effects are efficient and don't cause unnecessary re-renders or computations.

You can force Synchronous updates:
```typescript
tasks.set([...tasks()])
queueMicrotask(() => filter.set('active')) // Effect will run twice
```

#### Key Takeaway

✅ Normally: Effects batch updates for performance.
✅ Edge Cases: Async operations (setTimeout, HTTP) can split batches.
✅ Debug Tip: Use effect.onTrigger(() => console.log('Triggered')) to log dependency changes.


## Day 4: Performance Deep Dive

### Advanced Signal Optimization Techniques

#### 1. Using `untracked()` for Performance

Use `untracked()` when you need to read a signal's value without creating a dependency:

**Purpose:** Read signals without triggering re-computations or re-runs.

```typescript
import { effect, untracked } from '@angular/core'

effect(() => {
    // This effect will ONLY run when tasks() changes
    const currentFilter = untracked(() => filter())
    console.log(`Tasks updated: ${tasks().length}, Current filter: ${currentFilter}`)
})
```

**When to Use:**
- Reading configuration values that shouldn't trigger updates
- Accessing user preferences for logging purposes
- Breaking circular dependencies

#### 2. Computed Signal Caching & Memoization

Computed signals automatically cache their results until dependencies change:

**❌ Inefficient Pattern:**
```typescript
const expensiveComputation = computed(() => {
    return tasks().map(task => performHeavyCalculation(task))
})
// Recalculates on EVERY task change, even minor ones
```

**✅ Optimized Pattern:**
```typescript
const optimizedComputation = computed(() => {
    const completedTasks = tasks().filter(task => task.isCompleted)
    // Heavy calculation only runs when completed tasks change
    return completedTasks.map(task => performHeavyCalculation(task))
})
```

**Performance Benefits:**
- **Memoization**: Cached until dependencies change
- **Granular Updates**: Only recalculates when relevant data changes
- **Lazy Evaluation**: Computed only when accessed

#### 3. Resource Cleanup & Memory Management

Always clean up resources in effects to prevent memory leaks:

```typescript
import { effect } from '@angular/core'

effect((onCleanup) => {
    const timer = setInterval(() => {
        console.log('Background task running...')
    }, 1000)
    
    // Critical: Clean up to prevent memory leaks
    onCleanup(() => clearInterval(timer))
})
```

**Common Cleanup Scenarios:**

| **Resource Type** | **Cleanup Method** |
|-------------------|-------------------|
| **Intervals/Timeouts** | `clearInterval()`, `clearTimeout()` |
| **Event Listeners** | `removeEventListener()` |
| **RxJS Subscriptions** | `subscription.unsubscribe()` |
| **WebSocket Connections** | `socket.close()` |


## Day 5: RxJS & Signals Interop

#### When to use each?

| **Signals** | **RxJS Observables** |
|-------------------|-------------------|
| **Sync state management** | `Async event streams` |
| **Template reactivity** | `Complex async operations` |
| **Low Overhead** | `Powerful operators` |

#### Key interop Functions
-- toObservable() -> Converts a signal to a observable -> const obs$ = toObservable(this.signal)
-- toSignal() -> Converts a observable to a signal -> const data = toSignal(obs$)