## Root Rendering
```
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Here `document.getElementById('root')` has return type "HTMLElement | null". Meaning it could be null at runtime.

The `!` after an expression is called the `non-null assertion` operator.

It tells TypeScript: “I know this value will not be null or undefined, even if you think it might be.”