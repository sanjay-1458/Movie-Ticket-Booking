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