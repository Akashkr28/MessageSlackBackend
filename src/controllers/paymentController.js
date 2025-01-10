import { StatusCodes } from "http-status-codes";

import { internalErrorResponse } from "../common/responseObjects.js";
import razorpay from '../config/razorpayConfig.js'
import { CURRENCY, RECEIPT_SECRET } from "../config/serverConfig.js";
import { createPaymentService, updatePaymentStatusService } from "../services/paymentService.js";

export const createOrderController = async (req, res) => {
    try {
        const options = {
            amount: req.body.amount,
            currency: CURRENCY,
            receipt: RECEIPT_SECRET,
        };

        const order = await razorpay.orders.create(options);

        await createPaymentService(order.id, order.amount);

        if(!order){
            throw new Error("Order not created");
        }

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Order created successfully",
            data: order
        });

    } catch (error) {
        console.log('Payment controller error', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}

export const capturePaymentController = async (req, res) => {
    try {
        console.log('Request body', req.body);
        await updatePaymentStatusService(req.body.orderId, req.body.status, req.body.paymentId, req.body.signature);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Payment Captured successfully',
            data: ''
        })
    } catch (error) {
        console.log('Error in capturePaymentController', error)
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}