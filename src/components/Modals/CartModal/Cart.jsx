import { Button, Modal, Spinner } from 'react-bootstrap';
import { handleAddToCart, handleRemoveFromCart, onSubmit } from './helpers';
import { useState } from 'react';
import notify from '../../../utils/useNotification';

/**
 * Cart Component
 * Displays the items added to the cart with the ability to:
 * - Increase/decrease item count
 * - Select a table
 * - Submit the order
 *
 * @param {Object} props
 * @param {boolean} props.show - Controls visibility of the modal
 * @param {Function} props.onHide - Function to close the modal
 * @param {Array} props.cart - Current cart items
 * @param {Function} props.setCart - Function to update cart state
 * @param {Array} props.tables - List of restaurant tables for selection
 * @param {Object} props.adminInfo - Admin info for authentication
 */
const Cart = ({ show, onHide, cart, setCart, tables, adminInfo , tableNumber }) => {
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  ); // Calculate total price of items in the cart

  const [loading, setLoading] = useState(false); // Loading indicator during submission
  const [tableId, setTableId] = useState(tableNumber); // Selected table ID

  /**
   * Handles submission of the current order.
   * Validates table selection, then sends data to the backend.
   */
  const handleSubmit = async () => {
    if (!tableId) {
      notify("أدخل رقم الطاولة", "error");
      return;
    }

    await onSubmit(cart, setCart, setLoading, adminInfo, tableId, onHide);
  };

  return (
    <div>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header className="d-flex justify-content-center">
          <Modal.Title>الطلب</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {cart?.length > 0 ? (
            <div className="cart-order">
              {/* Display all valid priced items */}
              {cart.filter((item) => item.price > 0).map((item) => (
                <div
                  key={item.id}
                  className="cart-item"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  {/* Price Column */}
                  <p
                    style={{
                      flex: '2',
                      textAlign: 'start',
                    }}
                  >
                    {item.price * item.count} S.P
                  </p>

                  {/* Quantity Control */}
                  <div
                    style={{
                      flex: '1',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <button
                      style={{
                        border: 'none',
                        backgroundColor: '#1f2a40',
                        color: 'white',
                        width: '25px',
                        borderRadius: '10px',
                      }}
                      onClick={() => handleRemoveFromCart(item, setCart)}
                    >
                      -
                    </button>
                    <span style={{ margin: '0 10px' }}>{item.count}</span>
                    <button
                      style={{
                        border: 'none',
                        backgroundColor: '#1f2a40',
                        color: 'white',
                        width: '25px',
                        borderRadius: '10px',
                      }}
                      onClick={() => handleAddToCart(item, setCart)}
                    >
                      +
                    </button>
                  </div>

                  {/* Item Name Column */}
                  <p
                    style={{
                      flex: '2',
                      textAlign: 'end',
                    }}
                  >
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">لايوجد عناصر</p>
          )}

          {/* Footer with table select and total */}
          <div className="total d-flex justify-content-between align-items-center">
            <select
              style={{
                height: '40px',
                borderRadius: '10px',
                border: '1px solid #1F2A40',
              }}
              className="w-50"
              onChange={(e) => setTableId(Number(e.target.value))}
              value={tableId || ''}
            >
              <option value="" disabled>
                إختر طاولة
              </option>
              {tables?.map((table) => (
                <option key={table.id} value={table.id}>
                  Table {table.number_table}
                </option>
              ))}
            </select>

            <h5
              style={{
                width: '50%',
                textAlign: 'end',
                lineHeight: '50px',
              }}
            >
              Total: {totalPrice} S.P
            </h5>
          </div>
        </Modal.Body>

        <Modal.Footer dir="rtl">
          <Button onClick={handleSubmit}>
            {loading ? <Spinner size="sm" /> : 'إتمام'}
          </Button>
          <Button onClick={onHide}>إلغاء</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cart;
