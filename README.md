# React Shopping Cart Starter Kit
 
This component aims for loose coupling and comes with no batteries included. 

```
npm install react-shopping-cart-starter-kit
```

## Props

| Property         | Type                     | Required? | Description                                              | Default               | 
| ---------------- | ------------------------ |:--------:| -------------------------------------------------------- | --------------------- |
| items            | Object                   | &#10004; |                                                          |                       |
| selection        | Array                    |          |                                                          | `[]`                    |
| allowDoubles     | Boolean                  |          | If true, an item may appear more than once in the selection.  | `false`                 |
| onItemAdded      | Function                 |          | Called when an item is added to the cart.                | `() => {}`              |
| onItemRemoved    | Function                 |          | Called when an item is removed from the cart.            | `() => {}`              |
| onItemQtyChanged | Function                 |          | Called when an item's quantity has changed.                  | `() => {}`              |
| onChange         | Function                 |          |                                                          | `() => {}`              |
| iterator         | Function                 |          |                                                          |                       |
| mainComponent    | Component          |          | A custom container component.                     |                       |
| rowComponent     | Component          |          | A custom row component.                           |                       |
| tableClassName   | String                   |          | The css class name to apply to the table element.        |                       |
| cartEmptyMessage | Node                     |          | The message shown when the cart is empty.                | 'The cart is empty. ' |

## addItem(key, quantity)

## removeItem(index) 

## updateQuantity(index, quantity) 

## reset()

## getSelection()

## isEmpty()
