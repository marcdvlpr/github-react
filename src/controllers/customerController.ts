import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Customer, Food, Offer, Order, Transaction } from '../models';
import { CustomerRegisterInput, CustomerLoginInput } from '../validators/customer';
import { IEditCustomerProfileInput, ICartItem, IOrderInput } from '../interfaces';
import {
  generatePasswordHash,
  validatePassword,
  generateOtp,
  requestOtp,
  generateToken
} from '../helpers/auth';
import { validateTransaction } from '../helpers/transaction';

export const customerRegister = async (req: Request, res: Response) => {
  try {
    const customerInputs = plainToClass(CustomerRegisterInput, req.body);

    const validationError = await validate(customerInputs, { validationError: { target: true } });

    if (validationError.length > 0) {
      return res.status(400).json(validationError);
    }

    const { email, phone, password } = customerInputs;

    const customer = await Customer.findOne({ email });

    if (customer) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    const hashPassword = await generatePasswordHash(password);

    const { otp, otpExpiry } = generateOtp();

    const user = await Customer.create({
      email,
      phone,
      password: hashPassword,
      otp,
      otpExpiry,
      firstName: '',
      lastName: '',
      address: '',
      verified: false,
      latitude: 0,
      longitude: 0,
      orders: []
    });

    if (!user) {
      return res.status(400).json({ message: 'Error while creating user' });
    }

    await requestOtp(otp, phone);

    const token = generateToken({
      _id: user._id,
      email: user.email,
      verified: user.verified
    });

    return res.status(201).json({ email: user.email, verified: user.verified, token });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const customerLogin = async (req: Request, res: Response) => {
  try {
    const customerInputs = plainToClass(CustomerLoginInput, req.body);

    const validationError = await validate(customerInputs, { validationError: { target: true } });

    if (validationError.length > 0) {
      return res.status(400).json(validationError);
    }

    const { email, password } = customerInputs;

    const customer = await Customer.findOne({ email }).select('+password');

    if (!customer) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const isMatch = await validatePassword(password, customer.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const token = generateToken({
      _id: customer._id,
      email: customer.email,
      verified: customer.verified
    });

    return res.status(200).json({ email: customer.email, verified: customer.verified, token });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const customerVerify = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { otp } = req.body;

    const customer = await Customer.findById(user?._id);

    if (!customer) {
      return res.status(404).json({ message: 'User does not exist!' });
    }

    if (customer.otpExpiry <= new Date() || customer.otp !== parseInt(otp)) {
      return res.status(404).json({ message: 'You need to request a new OTP!' });
    }

    customer.verified = true;

    const updateUser = await customer.save();

    const token = generateToken({
      _id: updateUser._id,
      email: updateUser.email,
      verified: updateUser.verified
    });

    return res.status(200).json({
      email: updateUser.email,
      verified: updateUser.verified,
      token
    });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const customerRequestOtp = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const customer = await Customer.findById(user?._id);

    if (!customer) {
      return res.status(404).json({ message: 'User does not exist!' });
    }

    const { otp, otpExpiry } = generateOtp();
    customer.otp = otp;
    customer.otpExpiry = otpExpiry;

    await customer.save();
    await requestOtp(otp, customer.phone);

    return res.status(200).json({ message: 'OTP sent to your mobile number!' });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getCustomerProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const profile = await Customer.findById(user?._id);

    if (!profile) {
      return res.status(404).json({ message: 'User does not exist!' });
    }

    return res.status(200).json(profile);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const editCustomerProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { firstName, lastName, address }: IEditCustomerProfileInput = req.body;

    const profile = await Customer.findById(user?._id);

    if (!profile) {
      return res.status(404).json({ message: 'User does not exist!' });
    }

    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.address = address;

    await profile.save();

    return res.status(200).json(profile);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { txId, amount, items }: IOrderInput = req.body;

    const { status, transaction } = await validateTransaction(txId);

    if (!status || !transaction) {
      return res.status(404).json({ message: 'Error while create order!' });
    }

    const customer = await Customer.findById(user?._id);

    if (!customer) {
      return res.status(404).json({ message: 'User does not exist!' });
    }

    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

    let cartItems = Array();
    let netAmount = 0.0;
    let merchantId = '';

    const foods = await Food.find().where('_id').in(items.map(item => item._id)).exec();

    foods.map(food => {
      items.map(({ _id, quantity }) => {
        if (String(food._id) === _id) {
          merchantId = food.merchantId;
          netAmount += food.price * quantity;
          cartItems.push({ food, quantity });
        }
      })
    });

    if (cartItems) {
      const currentOrder = await Order.create({
        orderId,
        merchantId,
        items: cartItems,
        totalAmount: netAmount,
        paidAmount: amount,
        orderDate: new Date(),
        orderStatus: 'Waiting',
        remarks: '',
        deliveryId: '',
        readyTime: 45
      })

      customer.cart = [] as any;
      customer.orders.push(currentOrder);

      transaction.merchantId = merchantId;
      transaction.orderId = orderId;
      transaction.status = 'CONFIRMED';

      await transaction.save();

      const customerResult = await customer.save();

      return res.status(200).json(customerResult);
    }
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const customer = await Customer.findById(user?._id).populate('orders');

    if (!customer || customer.orders.length <= 0) {
      return res.status(404).json({ message: 'Orders not found!' });
    }

    return res.status(200).json(customer.orders);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate('items.food');

    if (!order) {
      return res.status(404).json({ message: 'Order not founds!' });
    }

    return res.status(200).json(order);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const customer = await Customer.findById(user?._id);

    if (!customer) {
      return res.status(404).json({ message: 'User does not exist!' });
    }

    let cartItems = Array();

    const { _id, quantity }: ICartItem = req.body;

    const food = await Food.findById(_id);

    if (!food) {
      return res.status(404).json({ message: 'Unable to add to cart!' });
    }

    cartItems = customer.cart;

    if (cartItems.length === 0) {
      cartItems.push({ food, quantity });
    }

    const existFoodItems = cartItems.filter(item => String(item.food._id) === _id);

    if (existFoodItems.length <= 0) {
      cartItems.push({ food, quantity });
    }

    const index = cartItems.indexOf(existFoodItems[0]);
    quantity > 0 ? cartItems[index] = { food, quantity } : cartItems.splice(index, 1);

    customer.cart = cartItems as any;

    const { cart } = await customer.save();

    return res.status(200).json(cart);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const customer = await Customer.findById(user?._id).populate('cart.food');

    if (!customer) {
      return res.status(404).json({ message: 'User does not exist!' });
    }

    const { cart } = customer;

    if (cart.length === 0) {
      return res.status(404).json({ message: 'Your cart is empty!' });
    }

    return res.status(200).json(cart);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const deleteCart = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const customer = await Customer.findById(user?._id).populate('cart.food');

    if (!customer) {
      return res.status(404).json({ message: 'User does not exist!' });
    }

    if (customer.cart.length === 0) {
      return res.status(404).json({ message: 'Cart is already empty!' });
    }

    customer.cart = [] as any;

    const { cart } = await customer.save();

    return res.status(200).json(cart);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const verifyOffer = async (req: Request, res: Response) => {
  try {
    const offerId = req.params.id;
    const offer = await Offer.findById(offerId);

    if (!offer?.isActive) {
      return res.status(404).json({ message: 'Offer is not valid!' });
    }

    return res.status(200).json({ message: 'Offer is valid', offer });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const createPayment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { amount, paymentMode, offerId } = req.body;

    let payableAmount = Number(amount);

    if (offerId) {
      const offer = await Offer.findById(offerId);

      if (offer?.isActive && offer?.minValue <= payableAmount) {
        payableAmount = payableAmount - offer.offerAmount;
      }
    }

    const transaction = await Transaction.create({
      customer: user?._id,
      merchantId: '',
      orderId: '',
      orderValue: payableAmount,
      offerUsed: offerId || 'NA',
      status: 'OPEN',
      paymentMode,
      paymentResponse: 'Payment is cash on delivery'
    });

    return res.status(200).json(transaction);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};
