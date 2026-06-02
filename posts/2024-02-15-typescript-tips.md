---
title: TypeScript Tips and Tricks
date: 2024-02-15
description: Advanced TypeScript patterns and tips for better code
category: Development
tags: [typescript, javascript, tips, advanced]
---

# TypeScript Tips and Tricks

Master TypeScript with these advanced patterns and tips.

## 1. Utility Types

### Partial and Required

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required
type RequiredUser = Required<PartialUser>;
```

### Pick and Omit

```typescript
// Pick specific properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit specific properties
type UserWithoutEmail = Omit<User, 'email'>;
```

### Record

```typescript
type Page = 'home' | 'about' | 'contact';

const pageTitles: Record<Page, string> = {
  home: 'Home Page',
  about: 'About Us',
  contact: 'Contact',
};
```

## 2. Template Literal Types

```typescript
type Color = 'red' | 'blue' | 'green';
type Size = 'sm' | 'md' | 'lg';

type ColorSize = `${Color}-${Size}`;
// 'red-sm' | 'red-md' | 'red-lg' | 'blue-sm' | ...

const button: ColorSize = 'red-lg'; // ✅
const invalid: ColorSize = 'red-xl'; // ❌ Error
```

## 3. Conditional Types

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// More complex example
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type C = UnwrapPromise<Promise<string>>; // string
type D = UnwrapPromise<number>; // number
```

## 4. Mapped Types

```typescript
type Optional<T> = {
  [K in keyof T]?: T[K];
};

type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Create getter methods
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; }
```

## 5. Discriminated Unions

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    case 'triangle':
      return (shape.base * shape.height) / 2;
  }
}
```

## 6. Type Guards

```typescript
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim(); // TypeScript knows it's a Fish
  } else {
    pet.fly(); // TypeScript knows it's a Bird
  }
}
```

## 7. Const Assertions

```typescript
// Without const assertion
const ROUTES = {
  home: '/',
  about: '/about',
  contact: '/contact',
};
// Type: { home: string; about: string; contact: string }

// With const assertion
const ROUTES = {
  home: '/',
  about: '/about',
  contact: '/contact',
} as const;
// Type: { readonly home: "/"; readonly about: "/about"; readonly contact: "/contact" }
```

## 8. Satisfies Operator (TypeScript 5.0+)

```typescript
type Colors = 'red' | 'green' | 'blue';
type RGB = [red: number, green: number, blue: number];

// Old way (loses type information)
const palette: Record<Colors, string | RGB> = {
  red: [255, 0, 0],
  green: '#00ff00',
  blue: [0, 0, 255],
};

// New way with satisfies (keeps type information)
const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
  blue: [0, 0, 255],
} satisfies Record<Colors, string | RGB>;

// Now palette.green is known to be string
palette.green.toUpperCase(); // ✅ No error
```

## 9. Decorators (TypeScript 5.0+)

```typescript
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}
```

## 10. Branded Types

```typescript
type Brand<T, B> = T & { __brand: B };

type USD = Brand<number, 'USD'>;
type EUR = Brand<number, 'EUR'>;

function createUSD(amount: number): USD {
  return amount as USD;
}

function createEUR(amount: number): EUR {
  return amount as EUR;
}

function addUSD(a: USD, b: USD): USD {
  return (a + b) as USD;
}

const usd = createUSD(100);
const eur = createEUR(100);

addUSD(usd, usd); // ✅
addUSD(usd, eur); // ❌ Error: EUR is not assignable to USD
```

## Best Practices

1. **Use strict mode**: Enable `strict: true` in tsconfig.json
2. **Avoid `any`**: Use `unknown` instead when type is uncertain
3. **Use discriminated unions**: For complex state management
4. **Leverage utility types**: Don't reinvent the wheel
5. **Use `as const`**: For constant values

## Common Mistakes

### ❌ Using `any` everywhere

```typescript
// Bad
function process(data: any): any {
  return data.map((item: any) => item.value);
}

// Good
function process<T extends { value: unknown }>(data: T[]): unknown[] {
  return data.map((item) => item.value);
}
```

### ❌ Not using strict null checks

```typescript
// Bad (without strictNullChecks)
const element = document.getElementById('root');
element.innerHTML = 'Hello'; // Might be null!

// Good
const element = document.getElementById('root');
if (element) {
  element.innerHTML = 'Hello';
}
```

### ❌ Ignoring type inference

```typescript
// Bad (explicit when unnecessary)
const numbers: number[] = [1, 2, 3].map((n: number): number => n * 2);

// Good (let TypeScript infer)
const numbers = [1, 2, 3].map((n) => n * 2);
```

## Conclusion

TypeScript is a powerful tool that can significantly improve your code quality. Use these patterns to write better, safer code.

Happy typing! 🎯