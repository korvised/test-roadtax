import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Fee, Payment } from "../entities"
import { ApiResponse, errorHandler } from "../middlewares"
import { HTTPStatusCode } from "../constants"

export class PaymentControllers {
  static async getAllPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentRepository = AppDataSource.getRepository(Payment)
      const payments = await paymentRepository.find({
        relations: ["fee"]
      })
      return new ApiResponse(res, HTTPStatusCode.Ok).success(payments, "Get payments successfully")
    } catch (err) {
      errorHandler(err, req, res, next)
    }
  }

  static async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { ref, transId, amount } = req.body

      if (!ref || !transId || !amount) return new ApiResponse(res, HTTPStatusCode.BadRequest).error("Missing required fields")

      const feeRepository = AppDataSource.getRepository(Fee)
      const fee = await feeRepository.findOne({
        where: { ref }
      })

      if (!fee) return new ApiResponse(res, HTTPStatusCode.BadRequest).error("Invalid fee ref")

      if (fee.isPaid) return new ApiResponse(res, HTTPStatusCode.BadRequest).error("This ref has already paid")

      const payment = new Payment()
      payment.transId = transId
      payment.amount = amount || 0
      payment.fee = ref

      const paymentRepository = AppDataSource.getRepository(Payment)
      await paymentRepository.save(payment)

      fee.isPaid = true
      await feeRepository.save(fee)

      return new ApiResponse(res, HTTPStatusCode.Created).success(payment, "Create payment successfully")
    } catch (error) {
      errorHandler(error, req, res, next)
    }
  }
}
