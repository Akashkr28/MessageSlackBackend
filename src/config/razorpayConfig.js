import razorpay from 'razorpay';

import { RAZORPAY_KEY_ID, RAZORPAY_SECRET_KEY } from './serverConfig.js';

const instance = new razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_SECRET_KEY
});

export default instance;