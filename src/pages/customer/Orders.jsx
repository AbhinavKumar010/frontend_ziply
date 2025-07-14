import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableBody, TableCell, TableRow, Rating, TextField, Snackbar, Alert } from '@mui/material';
import { orderAPI } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackOrder, setFeedbackOrder] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderAPI.getOrderHistory();
        if (response?.data) setOrders(response.data);
      } catch (error) {
        // handle error
      }
    };
    fetchOrders();
  }, []);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const handleFeedback = (order) => {
    setFeedbackOrder(order);
    setFeedbackRating(0);
    setFeedbackComment('');
    setFeedbackOpen(true);
  };

  const handleSubmitFeedback = async () => {
    try {
      await orderAPI.submitFeedback({ orderId: feedbackOrder._id, rating: feedbackRating, comment: feedbackComment });
      setFeedbackOpen(false);
      setSnackbar({ open: true, message: 'Feedback submitted!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to submit feedback', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Order History</Typography>
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} md={6} lg={4} key={order._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6">Order #{order._id}</Typography>
                  <Chip label={order.status.toUpperCase()} color={order.status === 'delivered' ? 'success' : order.status === 'processing' ? 'warning' : order.status === 'shipped' ? 'info' : 'default'} size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Total: ₹{order.totalAmount}</Typography>
                <Button variant="outlined" sx={{ mt: 2 }} onClick={() => handleViewOrder(order)}>View Details</Button>
                {order.status === 'delivered' && (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => handleFeedback(order)}
                    disabled={order.status !== 'delivered'}
                  >
                    Leave Feedback
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={orderDetailsOpen} onClose={() => setOrderDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Order Information</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2"><strong>Order ID:</strong> #{selectedOrder._id}</Typography>
                <Typography variant="body2"><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</Typography>
                <Typography variant="body2"><strong>Status:</strong> {selectedOrder.status}</Typography>
                {selectedOrder.cancellationReason && (
                  <Typography variant="body2" color="error"><strong>Cancellation Reason:</strong> {selectedOrder.cancellationReason}</Typography>
                )}
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Items</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedOrder.items.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.price}</TableCell>
                      <TableCell>₹{item.price * item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="h6">Total Amount</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>₹{selectedOrder.totalAmount}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Leave Feedback</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Rating
              value={feedbackRating}
              onChange={(_, value) => setFeedbackRating(value)}
              size="large"
            />
            <TextField
              label="Comment"
              multiline
              minRows={3}
              value={feedbackComment}
              onChange={e => setFeedbackComment(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitFeedback} disabled={feedbackRating === 0}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Orders; 