import { Merchant, Deliver, Order } from '../models';

export const assignOrderForDeliver = async (orderId: string, merchantId: string) => {
  try {
    const merchant = await Merchant.findById(merchantId);

    if (!merchant) {
      throw new Error('Merchant does not exist!');
    }

    const areaCode = merchant.zipCode;
    const merchantLatitude = merchant.latitude;
    const merchantLongitude = merchant.longitude;

    const deliver = await Deliver.find({ zipCode: areaCode, verified: true, isAvailable: true });

    if (deliver) {
      const order = await Order.findById(orderId);

      if (order) {
        order.deliveryId = deliver[0]._id;
        await order.save();
      }
    }
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
  }
};
