import React                  from 'react'
import Cart                   from '../modules/CartStarterKit.jsx'
import Griddle                from 'griddle-react'
import BootstrapPager         from './GriddleBootstrapPager.jsx'
import items                  from './sampledata'
import TimeoutTransitionGroup from './react-components/js/timeout-transition-group.jsx'

import { Modal, Alert, Panel, Table, Input, Button } from 'react-bootstrap'

const BootstrapCartRow = React.createClass({
    handleChange(event) {
        const value = event.target.value
        if (!isNaN(value) && value > 0) {
            this.props.setItemQty(value)
        }
    },
    increment() {
        const value = this.props.item.quantity + 1
        this.props.setItemQty(value)
    },
    decrement() {
        const value = this.props.item.quantity - 1
        if (value) {
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
                    <div className='form-group form-group-sm' style={{marginBottom: 0, width: '110px'}}>
                    <Input
                      standalone
                      buttonBefore = {
                        <Button
                          onClick = {this.decrement}
                          bsSize  = 'small'>
                            <i className='fa fa-minus' />
                        </Button>
                      }
                      buttonAfter = {
                        <Button
                          onClick = {this.increment}
                          bsSize  = 'small'>
                            <i className='fa fa-plus' /> 
                        </Button>
                      }
                      style    = {{textAlign: 'right'}}
                      type     = 'text'
                      value    = {this.props.item.quantity}
                      onChange = {this.handleChange} />
                    </div>
                </td>
                <td>
                    <Button 
                      standalone
                      bsSize   = 'small'
                      onClick  = {this.props.removeItem}>
                        <i className='fa fa-remove' /> 
                    </Button>
                </td>
            </tr>
        )
    }
})

const BootstrapCart = React.createClass({
    getInitialState() {
        let data = []
        for (var key in items) {
            let item = items[key]
            item.id = key
            data.push(item)
        }
        return {
            data           : data,
            notifications  : {},
            nextKey        : 0,
            canSubmit      : false,
            purchase       : null
        }
    },
    handleRowClick(row) {
        const item = row.props.data
        this.refs.cart.addItem(row.props.data.id, 1, item)
    },
    refresh() {
        this.setState({
            canSubmit : !this.refs.cart.isEmpty()
        })
    },
    componentDidMount() {
        this.refresh()
    },
    hideNotification(key) {
        let notifications = this.state.notifications
        if (notifications.hasOwnProperty(key)) {
            delete notifications[key]
            this.setState({notifications: notifications})
        }
    },
    addNotification(notification) {
        let { notifications, nextKey } = this.state
        notifications[nextKey] = notification
        this.setState({
            notifications : notifications,
            nextKey       : nextKey + 1
        })
        setTimeout(() => this.hideNotification(nextKey), 6000)
    },
    itemAdded(item) {
        this.addNotification({
            text  : (
                <span>
                    <i className='fa fa-fw fa-check' />
                    '{item['Artist']}<span>&mdash;</span>{item['Title']}' was added to the cart.
                </span>
            ),
            style : 'success'
        })
    },
    itemRemoved(item) {
        this.addNotification({
            text  : (
                <span>
                    <i className='fa fa-fw fa-trash-o' />
                    '{item['Artist']}<span>&mdash;</span>{item['Title']}' was removed from the cart.
                </span>
            ),
            style : 'warning'
        })
    },
    itemChanged(item, to, from) {
        this.addNotification({
            text : (
                <span>
                    <i className='fa fa-fw fa-exclamation-circle' />
                    Quantity changed from {from} to {to} for '{item['Artist']}<span>&mdash;</span>{item['Title']}'.
                </span>
            ), 
            style : 'info'
        })
    },
    showOrder() {
        this.setState({purchase: this.refs.cart.getSelection()})
    },
    hideModal() {
        this.setState({purchase: null})
    },
    rowIterator(context, row) {
        if (!context) {
            return {
                total : 0
            }
        } else {
            let price = Number(row.data['Price'])
            return {
                total : context.total + row.quantity * price
            }
        }
    },
    render() {
        let notifications = []
        for (let key in this.state.notifications) {
            let item = this.state.notifications[key]
            notifications.push({
                key   : key,
                text  : item.text,
                style : item.style
            })
        }
        notifications.sort((a, b) => { 
            return b.key - a.key 
        })
        return (
            <div className='container'>
                <Modal
                  show   = {!!this.state.purchase}
                  onHide = {this.hideModal}>
                    <Modal.Header>
                        <Modal.Title>
                            Your order
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.purchase && (
                            <div>
                                <Alert bsStyle='warning'>
                                    This is a demo&mdash;orders are not processed. <i className='fa fa-smile-o' />
                                </Alert>
                                <Table>
                                    <tbody>
                                        {this.state.purchase.map(item => {
                                            return (
                                                <tr key={item._key}>
                                                    <td>{item.data['Artist']}</td>
                                                    <td>{item.data['Title']}</td>
                                                    <td>&times; {item.quantity}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                                <Button block onClick={this.hideModal}>Ok</Button>
                            </div>
                        )}
                    </Modal.Body>
                </Modal>
                <Panel>
                    <Griddle 
                      ref                     = 'griddle'
                      showFilter              = {true}
                      columns                 = {['Artist', 'Title', 'Country', 'Year', 'Format', 'Price']}
                      useGriddleStyles        = {false}
                      useCustomPagerComponent = {true}
                      customPagerComponent    = {BootstrapPager}
                      tableClassName          = 'table griddle noselect'
                      onRowClick              = {this.handleRowClick}
                      results                 = {this.state.data} />
                </Panel>
                <Panel>
                    <Cart 
                      ref                     = 'cart'
                      tableClassName          = 'table cart'
                      onChange                = {this.refresh}
                      columns                 = {['Artist', 'Title', 'Format', 'Price']}
                      iterator                = {this.rowIterator}
                      rowComponent            = {BootstrapCartRow}
                      onItemAdded             = {this.itemAdded}
                      onItemRemoved           = {this.itemRemoved}
                      onItemQtyChanged        = {this.itemChanged}
                      cartEmptyMessage        = {(
                        <span>
                            No items selected.
                        </span>
                      )} />
                    {this.state.canSubmit && ( 
                        <Button block bsStyle='primary' onClick={this.showOrder}>
                            <i className='fa fa-check' /> Submit
                        </Button>
                    )}
                </Panel>
                <TimeoutTransitionGroup 
                  enterTimeout   = {300}
                  leaveTimeout   = {300}
                  transitionName = 'notifications'>
                    {notifications.map(notification => {
                        return (
                            <Alert 
                              key       = {notification.key} 
                              bsStyle   = {notification.style} 
                              onDismiss = {() => this.hideNotification(notification.key)}>
                                {notification.text}
                            </Alert>
                        )
                    })}
                </TimeoutTransitionGroup>
            </div>
        )
    }
})

React.render(
    <BootstrapCart />,
    document.getElementById('main')
)
