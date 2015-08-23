import React               from 'react'
import HTML5Backend        from 'react-dnd/modules/backends/HTML5'
import Griddle             from 'griddle-react'
import CartDragItem        from './CartDragItem.jsx'
import CartDropTarget      from './CartDropTarget.jsx'
import Cart                from '../modules/CartStarterKit.jsx'
import BootstrapPager      from './GriddleBootstrapPager.jsx'
import items               from './sampledata'
import { DragDropContext } from 'react-dnd'
import { Alert, Table, Grid, Col, Row, Thumbnail, Input, Button, Modal } from 'react-bootstrap'

const DragDropContainer = React.createClass({
    render() {
        return (
            <table className={this.props.tableClassName}>
                <thead>
                    <tr>
                        <th />
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
                <tfoot>
                    <tr>
                        <td colSpan={this.props.columns.length} style={{textAlign: 'right'}}>
                            <strong>Total:</strong>
                        </td>
                        <td colSpan={3}>
                            {this.props.context.total.toFixed(2)}
                        </td>
                    </tr>
                </tfoot>
            </table>
        )
    }
})

const DragDropCartRow = React.createClass({
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
                <td>
                    <Thumbnail src={'media/' + this.props.item.data.thumbnail} />
                </td>
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

const CatalogRowComponent = React.createClass({
    getDefaultProps() {
        return { 
            data : {} 
        }
    },
    render() {
        return (
        <Col xs={12} sm={2}>
            <CartDragItem 
              item  = {this.props.data}
              id    = {this.props.data.id} />
        </Col>
        )
    }
})

const DragDropComponent = React.createClass({
    getInitialState() {
        let data = []
        for (var key in items) {
            let item = items[key]
            if (item.thumbnail) {
                item.id = key
                data.push(item)
            }
        }
        return {
            data      : data,
            canSubmit : false,
            purchase  : null
        }
    },
    refresh() {
        if (!this.refs.cart) {
            return
        }
        this.setState({
            canSubmit : !this.refs.cart.isEmpty()
        })
    },
    showOrder() {
        this.setState({purchase: this.refs.cart.getSelection()})
    },
    hideModal() {
        this.setState({purchase: null})
    },
    reset() {
        this.refs.cart.emptyCart()
    },
    componentDidMount() {
        this.refresh()
    },
    itemDropped(item) {
        this.refs.cart.addItem(item, 1, items[item])
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
                <Grid>
                    <Griddle 
                      showFilter              = {true}
                      columns                 = {['Artist', 'Title', 'Label', 'Country', 'Year', 'Format', 'Price']}
                      useGriddleStyles        = {false}
                      useCustomPagerComponent = {true}
                      customPagerComponent    = {BootstrapPager}
                      useCustomRowComponent   = {true}
                      resultsPerPage          = {6}
                      customRowComponent      = {CatalogRowComponent}
                      results                 = {this.state.data} />
                </Grid>
                <div style={{ 
                    zIndex        : '10',
                    background    : '#fff',
                    position      : 'fixed',
                    bottom        : 0,
                    left          : 0,
                    width         : '100%',
                    maxHeight     : '40%',
                    borderTop     : '1px solid #eee',
                    paddingTop    : '1em',
                    paddingBottom : '2em',
                    overflow      : 'scroll'
                }}>
                    <Grid>
                        <Row>
                            <Col md={3}>
                                <CartDropTarget onItemDropped = {this.itemDropped} />
                            </Col>
                            <Col md={9}>
                                <div>
                                    <Cart 
                                      ref                     = 'cart'
                                      tableClassName          = 'table cart'
                                      onChange                = {this.refresh}
                                      columns                 = {['Artist', 'Title', 'Format', 'Price']}
                                      iterator                = {this.rowIterator}
                                      mainComponent           = {DragDropContainer}
                                      rowComponent            = {DragDropCartRow} />
                                </div>
                                {this.state.canSubmit && ( 
                                    <div>
                                        <Button 
                                          className = 'pull-right'
                                          onClick   = {this.reset}
                                          bsStyle   = 'danger'>
                                            <i className='fa fa-times' /> Empty
                                        </Button>
                                        <Button 
                                          style   = {{minWidth: '200px'}}
                                          onClick = {this.showOrder}
                                          bsStyle = 'primary'>
                                            <i className='fa fa-shopping-cart' /> Check out
                                        </Button>
                                    </div>
                                )}
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        )
    }
})

module.exports = DragDropContext(HTML5Backend)(DragDropComponent)
