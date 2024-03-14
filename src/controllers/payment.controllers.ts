import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Fee, Payment } from "../entities"
import { ApiResponse, errorHandler } from "../middlewares"

export class PaymentControllers {
  static async getAllPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentRepository = AppDataSource.getRepository(Payment)
      const payments = await paymentRepository.find({
        relations: ["fee"]
      })
      return new ApiResponse(res, 200).success(payments, "Get payments successfully")
    } catch (err) {
      errorHandler(err, req, res, next)
    }
  }

  static async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { ref, transId, amount } = req.body

      if (!ref || !transId || !amount) return

      const feeRepository = AppDataSource.getRepository(Fee)
      const fee = await feeRepository.findOne({
        where: { ref }
      })

      if (!fee) return new ApiResponse(res).error("Invalid fee ref")

      if (fee.isPaid) return new ApiResponse(res).error("This ref has already paid")

      const payment = new Payment()
      payment.transId = transId
      payment.amount = amount || 0
      payment.fee = ref

      const paymentRepository = AppDataSource.getRepository(Payment)
      await paymentRepository.save(payment)


      fee.isPaid = true
      await feeRepository.save(fee)

      return new ApiResponse(res, 201).success(payment, "Create payment successfully")
    } catch (error) {
      errorHandler(error, req, res, next)
    }
  }
}
