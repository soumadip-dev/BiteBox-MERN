import React, { useEffect } from 'react';
import { getOrderById } from '../api/orderApi';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const TrackOrderPage = () => {
  const { orderId } = useParams();

  const handleGetOrder = async orderId => {
    try {
      const response = await getOrderById(orderId);

      if (response?.success === true) {
        toast.success(response?.message || 'Order accepted successfully!');
      } else {
        toast.error(response?.message || 'Failed to accept order');
      }
    } catch (error) {
      toast.error(error?.message || 'An error occurred');
    }
  };

  useEffect(() => {
    handleGetOrder(orderId);
  }, [orderId]);
  return <div>TrackOrderPage</div>;
};

export default TrackOrderPage;
