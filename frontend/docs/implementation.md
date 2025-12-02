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

---

## StrictMode

React StrictMode intentionally double-invokes certain lifecycle functions in development (not in production) to help you detect unsafe code.

This includes:

1. useEffect (runs twice)
2. component mounting (mount → unmount → mount again)

---

## Dependencies

### Tailwind CSS

Installed Tailwind CSS using Vite:

[Tailwind CSS Vite Installation Guide](https://tailwindcss.com/docs/installation/using-vite)

---

### Outfit Google Font

Imported Outfit font from Google-Fonts:

[Google Fonts: Outfit & Poppins](https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap)

---

## Colors

Doing `bg-[###]` evrytime can cause bug, so a custom css property is used using `@theme`.

```
@theme {
  --color-primary: #F84565;
  --color-secondary: #D63854;
}
```

Now it can be used as `bg-primary text-secondary`
