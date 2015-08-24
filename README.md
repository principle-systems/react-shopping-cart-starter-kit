# React Shopping Cart Starter Kit
 
This component comes with no batteries included, but allows for a great deal of flexibility. It was initially designed for shopping cart type of functionality (creating and editing orders), but is likely to be applicable in other contexts where a selection of some kind is involved.

## Installation

```
$ npm install react-shopping-cart-starter-kit
```

## Examples

* [http://principle-systems.github.io/react-shopping-cart-starter-kit/examples/index-unstyled.html](x)
* http://principle-systems.github.io/react-shopping-cart-starter-kit/examples/index-bootstrap.html
* http://principle-systems.github.io/react-shopping-cart-starter-kit/examples/index-drag-drop.html

## How to use

### Preparation

Assign a unique id to each item used in your application. For demonstration, we will use the following key-value object with a catalog of five products in subsequent examples.

```javascript
const myProducts = {
  "product-1" : { "Name" : "Canned Unicorn Meat",   "Price" : "9.99"  },
  "product-2" : { "Name" : "Disappearing Ink Pen",  "Price" : "14.99" },
  "product-3" : { "Name" : "USB Rocket Launcher",   "Price" : "29.99" },
  "product-4" : { "Name" : "Airzooka Air Gun",      "Price" : "29.99" },
  "product-5" : { "Name" : "Star Trek Paper Clips", "Price" : "19.99" }
}
```


### Hello, World!

###### main.js

```javascript
import React from 'react'
import Cart  from 'react-shopping-cart-starter-kit'

const myProducts = {
  "product-1" : { "Name" : "Canned Unicorn Meat",   "Price" : "9.99"  },
  "product-2" : { "Name" : "Disappearing Ink Pen",  "Price" : "14.99" },
  "product-3" : { "Name" : "USB Rocket Launcher",   "Price" : "29.99" },
  "product-4" : { "Name" : "Airzooka Air Gun",      "Price" : "29.99" },
  "product-5" : { "Name" : "Star Trek Paper Clips", "Price" : "19.99" }
}

const MyComponent = React.createClass({
    submit() {
        const selection = this.refs.cart.getSelection()
        alert(JSON.stringify(selection))
    },
    addItem(key) {
        this.refs.cart.addItem(key, 1, this.props.products[key])
    },
    render() {
        const products = this.props.products
        return (
            <div>
                <h4>Products</h4>
                <ul>
                    {Object.keys(products).map(key => {
                        return (
                            <li key={key}>
                                <a href='#' onClick={() => this.addItem(key)}>
                                    {products[key]['Name']}
                                </a>
                            </li>
                        )
                    })}
                </ul>
                <hr />
                <Cart ref='cart' columns={['Name', 'Price']} />
                <hr />
                <button onClick={this.submit}>
                    Submit
                </button>
            </div>
        )
    }
})

React.render(
    <MyComponent products={myProducts} />,
    document.getElementById('main')
)
```

###### index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
</head>
<body>
    <div id="main"></div>
    <script src="bundle.js"></script>
</body>
</html>
```

```
$ browserify -t babelify ./main.js -o bundle.js
```

### Improvements to Hello, World!

Next, we'll implement a row iterator to sum up the order total.

```javascript
<Cart iterator={this.rowIterator} ref='cart' columns={['Name', 'Price']} />
```

This function is called once to allow initialization, and then for each item in the cart. The object we return is being passed on as an argument to the subsequent call, together with the row item. 

```javascript
    rowIterator(context, row) {
        if (!context) {
            /* Initialization call */
            return {
                total : 0
            }
        } else {
            /* Invoked once for each row */
            let price = Number(row.data['Price'])
            return {
                total : context.total + row.quantity * price
            }
        }
    },
```

> To change how the component renders the cart's contents, implement the `mainComponent` and/or `rowComponent` props. (See Customization)

Finally, we'd like to have the submit button disappear when nothing is present in the cart. To achieve this, we introduce a `this.state.canSubmit` flag.

```javascript
        <Cart 
          ref      = 'cart'
          onChange = {this.cartChanged}
          iterator = {this.rowIterator}
          columns  = {['Name', 'Price']} />
        <hr />
        {this.state.canSubmit && ( 
            <button onClick={this.submit}>
                Submit
            </button>
        )}
```

We also add `cartChanged` and `getInitialState` to `MyComponent`.

```javascript
    getInitialState() {
        return {
            canSubmit : false
        }
    },
    cartChanged() {
        this.setState({
            canSubmit : !this.refs.cart.isEmpty()
        })
    },
```

### Editing an existing selection of items

Up to this point, we have assumed that the cart is initially empty. When working with an existing order or selection, we can provide an item array to the cart's `selection` prop.

```javascript
        <Cart 
          /* ... as before ... */
          selection = {[
              {
                  id       : 'product-2',
                  quantity : 15,
                  data     : myProducts['product-2']
              },
              {
                  id       : 'product-3',
                  quantity : 1,
                  data     : myProducts['product-3']
              }
          ]} 
```

To allow the user to revert any changes back to the order's initial state, we add a button that triggers the cart's `reset` method.

```javascript
    <button onClick={this.undoChanges}>
        Undo changes
    </button>
```

To make the submit button appear in edit mode, we add a call to `cartChanged` when the component has mounted.
 
```javascript
    undoChanges() {
        this.refs.cart.reset()
    },
    componentDidMount() {
        this.cartChanged()
    },
```

## Props

### Required

| Property         | Type                     | Description                                              |
| ---------------- | ------------------------ | -------------------------------------------------------- |
| columns          | Array                    | The columns used in the table of items currently in the cart. Items added to the cart should have keys matching the entries of this array. |

### Optional

| Property         | Type                     | Description                                              | Default               | 
| ---------------- | ------------------------ | -------------------------------------------------------- | --------------------- |
| items            | Object                   | Normally, you pass an item's data with the call to `addItem`. As an alternative, you may provide an object here, mapping each key to an object with the item's attributes.  | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
| selection        | Array                    | Initial selection. (Used when editing an existing order or selection of items).    | `[]`                    |
| onItemAdded      | Function                 | Called when an item is added to the cart.                | `() => {}`              |
| onItemRemoved    | Function                 | Called when an item is removed from the cart.            | `() => {}`              |
| onItemQtyChanged | Function                 | Called when an item's quantity has changed.                  | `() => {}`              |
| onChange         | Function                 | Called when the state of the component changes. (You may want to implement this callback to toggle the visibility of a submit button, based on whether the cart is empty or not.)                                                         | `() => {}`              |
| iterator         | Function                 | A function used to pass state between rows. The real raison d'&ecirc;tre for this function is to sum up the price of each product in an order and output a total in the footer. | `() => { ... }`                       |
| mainComponent    | Component                | A custom container component.                     |                       |
| rowComponent     | Component                | A custom row component.                           |                       |
| tableClassName   | String                   | The css class name to apply to the table element. Whether this value is actually used or not depends on the implementation of `mainComponent`.       |                       |
| cartEmptyMessage | Node                     | A message shown when the cart is empty.                | 'The cart is empty.' |

## Initial data

When editing an existing selection, use the `selection` prop to pass the collection as an array in the following format.

```javascript
const orderData = [
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
]
```

## API

### addItem(key, quantity, item)
---

To add an item to the cart, provide its id, a quantity, and the item itself. (The third argument may not be required if you have previously supplied an object to the component's `items` props.) 

```javascript
cart.addItem('product-1', 1, myProducts['product-1'])
```

If an item with the given id already exists in the cart, no new item is inserted. Instead, the quantity is adjusted accordingly for the existing entry.

```javascript
cart.addItem('product-1', 1, myProducts['product-1'])
cart.addItem('product-1', 1)

cart.getSelection()

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

Does the same as `emptyCart()`, unless you specify the `selection` prop, in which case the initial selection will be restored. That is, when editing an existing order, this method will revert the cart back to a state consistent with the order being edited.

### getSelection()
---

Return the current selection.

```javascript
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
]
```

### isEmpty()
---

Returns `true` if the cart is empty, otherwise `false`.

### removeItem(index) 
---

In a typical implementation, it is not necessary to call this method directly. Instead, use `this.props.removeItem` from within the row component.

### updateQuantity(index, quantity) 
---

In a typical implementation, it is not necessary to call this method directly. Instead, use `this.props.setItemQty` from within the row component.

## Customization

*todo*

## Recipes 

*todo*

