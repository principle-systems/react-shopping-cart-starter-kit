# React Shopping Cart Starter Kit
 
This component comes with no batteries included. 

```
npm install react-shopping-cart-starter-kit
```

<!-- &#10004; -->

## Props

### Required

| Property         | Type                     | Description                                              |
| ---------------- | ------------------------ | -------------------------------------------------------- |
| columns          | Array                    | The columns used in the table of items currently in the cart. Items added to the cart should have keys matching the entries of this array. |

### Optional

| Property         | Type                     | Description                                              | Default               | 
| ---------------- | ------------------------ | -------------------------------------------------------- | --------------------- |
| items            | Object                   | Normally, you pass item data with the call to `addItem`. As an alternative, you may provide an object here mapping each key to an object with item data.
| selection        | Array                    | Initial selection. (Used when editing an existing order or selection of items).    | `[]`                    |
| onItemAdded      | Function                 | Called when an item is added to the cart.                | `() => {}`              |
| onItemRemoved    | Function                 | Called when an item is removed from the cart.            | `() => {}`              |
| onItemQtyChanged | Function                 | Called when an item's quantity has changed.                  | `() => {}`              |
| onChange         | Function                 | Called when the state of the component changes. (You may want to implement this callback to toggle the visibility of a submit button, based on whether the cart is empty or not.)                                                         | `() => {}`              |
| iterator         | Function                 | A function used to pass state between rows. The real raison d'&ecirc;tre for this function is to sum up the price of each product in an order and output a total in the footer. |                       |
| mainComponent    | Component                | A custom container component.                     |                       |
| rowComponent     | Component                | A custom row component.                           |                       |
| tableClassName   | String                   | The css class name to apply to the table element. Whether this value is actually used or not depends on the implementation of `mainComponent`.       |                       |
| cartEmptyMessage | Node                     | A message shown when the cart is empty.                | 'The cart is empty.' |

## Preparation

Assign a unique id to each item you add to the cart. For demonstration, we will use the following key-value object with a catalog of five products.

```
var myProducts = {
  "product-1" : { "name": "Canned Unicorn Meat", "price" : "9.99" },
  "product-2" : { "name": "Disappearing Ink Pen", "price" : "14.99" },
  "product-3" : { "name": "USB Rocket Launcher", "price" : "29.99" },
  "product-4" : { "name": "Airzooka Air Gun", "price" : "29.99" },
  "product-5" : { "name": "Star Trek Paper Clips", "price" : "19.99" }
};
```

## Hello, World!



## Initial data

If the user is editing an existing selection, use the `selection` prop to pass the collection as an array in the following format.

```
var orderData = [
  {
    "id"       : "item-1",
    "quantity" : 2,
    "data"     : { "name": "Canned Unicorn Meat", "price" : "9.99" }
  },
  {
    "id"       : "item-2",
    "quantity" : 1,
    "data"     : { "name": "Disappearing Ink Pen", "price" : "14.99" }
  }
];
```

### addItem(key, quantity, item)
---

To add an item to the cart, provide its id, a quantity, and the item itself. (The third argument may not be required if you have supplied an object to the component's `items` props.) 

```
cart.addItem('product-1', 1, myProducts['product-1']);
```

If an item with the given id already exists in the cart, no new item is inserted. Instead, the quantity is increased for the existing entry.

```
cart.addItem('product-1', 1, myProducts['product-1']);
cart.addItem('product-1', 1);

cart.getSelection();

[
  {
    "id"       : "product-1",
    "quantity" : 2,
    "data"     : { "name": "Canned Unicorn Meat", "price" : "9.99" }
  }
]
```

### emptyCart()
---

Clears the cart.

### reset()
---

Does the same as `emptyCart()`, unless you specify the `selection` prop, in which case the initial selection will be restored. E.g., if editing an existing order, this method will revert the cart back to a state consistent with the order being edited.

### getSelection()
---

Return the current selection.

```
[
  {
    "id"       : "item-1",
    "quantity" : 2,
    "data"     : { "name": "Canned Unicorn Meat", "price" : "9.99" }
  },
  {
    "id"       : "item-2",
    "quantity" : 1,
    "data"     : { "name": "Disappearing Ink Pen", "price" : "14.99" }
  }
];
```

### isEmpty()
---

Return `true` if the cart is empty, otherwise `false`.

### removeItem(index) 
---

In a typical implementation, it is not necessary to call this method directly. Instead, use `this.props.removeItem` from within the row component.

### updateQuantity(index, quantity) 
---

In a typical implementation, it is not necessary to call this method directly. Instead, use `this.props.setItemQty` from within the row component.

## Customization

## Recipes 

