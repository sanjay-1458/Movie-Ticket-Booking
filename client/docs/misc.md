## Blur Circle

A simple blur image is attached at the background using `z-index` to show a good visual, making this as a component which take props and based on that it align with their relative parent.

## React Hot Toast

This dependeny provides a way to send a notification to user, like sending warning, success or plain notification on some action.

```js
if (!selectedDate) {
  return toast("Please select a date");
}
```

## Testing

Each components / pages have their own test file. Test are wriiten in `Vitest` & `React-Testing-Library`.

## Types

The types of the data we recieved from API call are stored in `types` folder, where we can export the types and used in their respective component.

`../src/types/` [Link](../src/types/)

## Props Passing

Context API is used for passing props without prop drilling.

<strong>Steps:</strong><br>

1. We create a context.
2. We wrap the application with the provider.
3. Inside the provider component we call render the apllication which we passed earlier with passing values like state and function to update state.
4. Inside the subtree / application we can use those value from context.
