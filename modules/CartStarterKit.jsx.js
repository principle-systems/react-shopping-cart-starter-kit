import EventEmitter        from 'events'
import React               from 'react'
import assign              from 'object-assign'
import { Dispatcher }      from 'flux'

const CartDispatcher = new Dispatcher

const CartStore = assign({}, EventEmitter.prototype, {

    items        : {},
    selection    : [],
    nextKey      : 0,

    init(config) {
        this.items        = config.items
        this.selection    = []
        config.selection.forEach(item => {
            item.quantity = Number(item.quantity)
            item._key     = this.nextKey++
            if (item.data) {
                this.items[item.id] = item.data
            } else {
                item.data = this.items[item.id]
            }
            if (!item.data) {
                throw 'Missing data for item \'' + item.id + '\'.'
            }
            this.selection.push(item)
            this.items[item.id]._initialQty = item.quantity
        })
        this.reIndex()
    },

    reIndex() {
        let i = 0
        this.selection.forEach(item => {
            item._index = i++
        })
    },

    getSelection() {
        return this.selection
    },

    isEmpty() {
        return !this.selection.length
    },

    getItem(index) {
        return this.selection[index]
    },

    addItem(item, quantity, data) {
        if (this.items.hasOwnProperty(item)) {
            data = this.items[item]
        } else {
            this.items[item] = data
        }
        for (let key in this.selection) {
            if (item === this.selection[key].id) {
                const oldQty = this.selection[key].quantity
                this.selection[key].quantity += Number(quantity)
                this.emit('change')
                this.emit('item-changed', this.items[item], this.selection[key].quantity, oldQty)
                return
            }
        }
        if (data) {
            this.selection.push({
                id       : item,
                quantity : Number(quantity),
                data     : data,
                _index   : this.selection.length,
                _key     : this.nextKey++
            })
            this.emit('change')
            this.emit('item-added', data)
        }
    },

    removeItem(index) {
        let id   = this.selection[index].id,
            item = this.selection.splice(index, 1)[0]
        this.reIndex()
        this.emit('change')
        this.emit('item-removed', this.items[id])
    },

    updateQuantity(index, quantity) {
        let item = this.selection[index]
        const oldQty = item.quantity
        item.quantity = Number(quantity)
        this.emit('change')
        this.emit('item-changed', this.items[item.id], quantity, oldQty)
    },

    reset() {
        this.selection = []
        this.emit('change')
    }

})

CartDispatcher.register(payload => {
    switch (payload.actionType) {
        case 'cart-initialize':
            CartStore.init(payload.config)
            CartStore.emit('ready')
            break
        case 'cart-revert':
            CartStore.init(payload.config)
            CartStore.emit('change')
            break
         case 'cart-add-item':
            CartStore.addItem(payload.key, payload.quantity, payload.item)
            break
        case 'cart-remove-item':
            CartStore.removeItem(payload.index)
            break
        case 'cart-update-item':
            CartStore.updateQuantity(payload.index, payload.quantity)
            break
        case 'cart-reset':
            CartStore.reset()
            break
    }
})

const ContainerComponent = React.createClass({
    render() {
        return (
            <table className={this.props.tableClassName}>
                <thead>
                    <tr>
                        {this.props.columns.map(column => {
                            return (
                                <th key={column}>
                                    {column}
                                </th>
                            )
                        })}
                        <th>
                            Quantity
                        </th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {this.props.body}
                </tbody>
                {this.props.context.total && (
                    <tfoot>
                        <tr>
                            <td colSpan={this.props.columns.length-1} style={{textAlign: 'right'}}>
                                <strong>Total:</strong>
                            </td>
                            <td colSpan={3}>
                                {this.props.context.total.toFixed(2)}
                            </td>
                        </tr>
                    </tfoot>
                )}
            </table>
        )
    }
})

const RowComponent = React.createClass({
    handleChange(event) {
        const value = event.target.value
        if (!isNaN(value) && value > 0) {
            this.props.setItemQty(value)
        }
    },
    render() {
        return (
            <tr>
                {this.props.columns.map(column => {
                    return (
                        <td key={column}>
                            {this.props.item.data[column]}
                        </td>
                    )
                })}
                <td>
                    <input
                      style    = {{textAlign: 'right', width: '100px'}}
                      type     = 'number'
                      value    = {this.props.item.quantity}
                      onChange = {this.handleChange} />
                </td>
                <td>
                    <button 
                      onClick  = {this.props.removeItem}>
                        Remove
                    </button>
                </td>
            </tr>
        )
    }
})

const CartStarterKit = React.createClass({
    propTypes: {
        items             : React.PropTypes.object,
        selection         : React.PropTypes.array,
        onItemAdded       : React.PropTypes.func,
        onItemRemoved     : React.PropTypes.func,
        onItemQtyChanged  : React.PropTypes.func,
        onChange          : React.PropTypes.func,
        iterator          : React.PropTypes.func,
        tableClassName    : React.PropTypes.string,
        cartEmptyMessage  : React.PropTypes.node
    },
    getDefaultProps() {
        return {
            items               : {},
            selection           : [],
            onItemAdded         : () => {},
            onItemRemoved       : () => {},
            onItemQtyChanged    : () => {},
            onChange            : () => {},
            iterator            : () => { return {} },
            containerComponent  : ContainerComponent,
            rowComponent        : RowComponent,
            tableClassName      : '',
            cartEmptyMessage    : (
                <span>
                    The cart is empty.
                </span>
            )
        }
    },
    getInitialState() {
        return {
            selection : []
        }
    },
    refresh() {
        this.setState({
            selection : CartStore.getSelection()
        })
    },
    onChange() {
        this.refresh()
        this.props.onChange()
    },
    componentDidMount() {
        CartStore.on('ready', this.refresh)
        CartDispatcher.dispatch({
            actionType : 'cart-initialize',
            config     : {
                items        : this.props.items,
                selection    : this.props.selection
            }
        })
        CartStore.on('change', this.onChange)
        CartStore.on('item-added', this.props.onItemAdded)
        CartStore.on('item-removed', this.props.onItemRemoved)
        CartStore.on('item-changed', this.props.onItemQtyChanged)
    },
    componentWillUnmount() {
        CartStore.removeListener('ready', this.refresh)
        CartStore.removeListener('change', this.onChange)
        CartStore.removeListener('item-added', this.props.onItemAdded)
        CartStore.removeListener('item-removed', this.props.onItemRemoved)
        CartStore.removeListener('item-changed', this.props.onItemQtyChanged)
    },
    addItem(key, quantity, item) {
        CartDispatcher.dispatch({
            actionType : 'cart-add-item',
            key        : key,
            quantity   : quantity,
            item       : item
        })
    },
    removeItem(index) {
        CartDispatcher.dispatch({
            actionType : 'cart-remove-item',
            index      : index
        })
    },
    updateQuantity(index, quantity) {
        CartDispatcher.dispatch({
            actionType : 'cart-update-item',
            index      : index,
            quantity   : quantity
        })
    },
    emptyCart() {
        CartDispatcher.dispatch({
            actionType : 'cart-reset'
        })
    },
    reset() {
        CartDispatcher.dispatch({
            actionType : 'cart-revert',
            config     : {
                items        : this.props.items,
                selection    : this.props.selection
            }
        })
    },
    isEmpty() {
        return CartStore.isEmpty()
    },
    getSelection() {
        return CartStore.getSelection()
    },
    render() {
        let context   = this.props.iterator(),
            Container = this.props.containerComponent,
            Row       = this.props.rowComponent
        if (this.isEmpty()) {
            return (
                <div>
                    {this.props.cartEmptyMessage}
                </div>
            )
        }
        return (
            <Container
              tableClassName = {this.props.tableClassName}
              columns        = {this.props.columns}
              body           = {this.state.selection.map(item => {
                  context = this.props.iterator(context, item)
                  return (
                      <Row
                        key        = {item._key}
                        item       = {item}
                        columns    = {this.props.columns}
                        removeItem = {()  => this.removeItem(item._index)}
                        setItemQty = {qty => this.updateQuantity(item._index, qty)} />
                  )
              })}
              context        = {context} 
            />
        )
    }
})

module.exports = CartStarterKit
