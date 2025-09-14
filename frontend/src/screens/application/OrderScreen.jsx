import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { PayPalButtons } from '@paypal/react-paypal-js';

import Message from '../../components/helpers/Message';
import Loader from '../../components/helpers/Loader';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from '../../slices/ordersApiSlice';

function OrderScreen() {
  const { id: orderId } = useParams();

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  // PayPal handlers
  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: Number(order?.totalPrice || 0).toFixed(2),
            },
          },
        ],
      })
      .then((id) => id);
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        await payOrder({ orderId, details }).unwrap();
        await refetch();
        toast.success('Payment successful');
      } catch (e) {
        toast.error(e?.data?.message || 'Payment failed');
      }
    });
  };

  const onError = (err) => {
    toast.error(err?.message || 'PayPal error');
  };

  const onApproveTest = async () => {
    try {
      await payOrder({ orderId, details: { payer: {} } }).unwrap();
      await refetch();
      toast.success('Payment successful (test)');
    } catch (e) {
      toast.error(e?.data?.message || 'Test payment failed');
    }
  };

  const deliverHandler = async () => {
    try {
      // If your API expects a body like { orderId }, change this call accordingly:
      await deliverOrder(orderId).unwrap();
      await refetch();
      toast.success('Order marked as delivered');
    } catch (e) {
      toast.error(e?.data?.message || 'Failed to mark delivered');
    }
  };

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <Message variant="danger">
        {error.data?.message || 'Error loading order'}
      </Message>
    );
  }

  return (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p><strong>Name:</strong> {order.user?.name}</p>
              <p><strong>Email:</strong> {order.user?.email}</p>
              <p>
                <strong>Address:</strong>{' '}
                {order.billingAddress?.address}, {order.billingAddress?.city}{' '}
                {order.billingAddress?.postalCode}, {order.billingAddress?.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {new Date(order.deliveredAt).toLocaleString()}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p><strong>Method:</strong> {order.paymentMethod}</p>
              {order.isPaid ? (
                <Message variant="success">
                  Paid on {new Date(order.paidAt).toLocaleString()}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>No items in this order</Message>
              ) : (
                order.orderItems.map((item, idx) => (
                  <ListGroup.Item key={idx}>
                    <Row>
                      <Col md={2}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col>
                        <Link to={`/application/${item.application}`}>{item.name}</Link>
                      </Col>
                      <Col md={4}>${Number(item.price || 0).toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item><h2>Order Summary</h2></ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${Number(order.itemsPrice || 0).toFixed(2)}</Col>
                </Row>
                <Row>
                  <Col>Tax</Col>
                  <Col>${Number(order.taxPrice || 0).toFixed(2)}</Col>
                </Row>
                <Row>
                  <Col>Total</Col>
                  <Col>${Number(order.totalPrice || 0).toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  <Button onClick={onApproveTest} className="mb-2">
                    Test Pay Order
                  </Button>

                  {/* PayPal Buttons (SDK is provided at root) */}
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  />
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}

              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button type="button" className="btn btn-block" onClick={deliverHandler}>
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default OrderScreen;
