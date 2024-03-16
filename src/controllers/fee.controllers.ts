import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Fee } from "../entities"
import { ApiResponse, errorHandler } from "../middlewares"
import { HTTPStatusCode } from "../constants"

export class FeeControllers {
  static async getAllFees(req: Request, res: Response, next: NextFunction) {
    try {
      const feeRepository = AppDataSource.getRepository(Fee)
      const fees = await feeRepository.find({
        relations: ["province"]
      })
      return new ApiResponse(res, HTTPStatusCode.Ok).success(fees, "Get fees successfully")
    } catch (err) {
      errorHandler(err, req, res, next)
    }
  }

  static async getAllFeesByPlateInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { plateNo, province } = req.body

      if (!plateNo || !province) {
        return res.status(HTTPStatusCode.BadRequest).json({ message: "Missing required fields" })
      }

      const feeRepository = AppDataSource.getRepository(Fee)
      const fees = await feeRepository.find({
        select: ["ref", "plateNo", "year", "feeAmount", "fineAmount", "isPaid", "province"],
        relations: ["province"],
        where: { plateNo: plateNo.trim(), province: { code: province.trim() } },
        order: {
          year: "ASC"
        }
      })
      return new ApiResponse(res, HTTPStatusCode.Ok).success(fees, "Get fees successfully")
    } catch (err) {
      errorHandler(err, req, res, next)
    }
  }

  static async createFee(req: Request, res: Response, next: NextFunction) {
    try {
      const { ref, plateNo, year, province, feeAmount, fineAmount } = req.body

      if (!ref || !plateNo || !year || !province || !feeAmount) {
        return new ApiResponse(res, HTTPStatusCode.BadRequest).error("Missing required fields")
      }

      const fee = new Fee()
      fee.ref = ref
      fee.plateNo = plateNo
      fee.year = year
      fee.province = province
      fee.feeAmount = feeAmount
      fee.fineAmount = fineAmount || 0
      const feeRepository = AppDataSource.getRepository(Fee)
      await feeRepository.save(fee)
      return new ApiResponse(res, HTTPStatusCode.Created).success(fee, "Create fee successfully")
    } catch (error) {
      errorHandler(error, req, res, next)
    }
  }

  static async updateFee(req: Request, res: Response, next: NextFunction) {
    try {
      const { ref } = req.body
      const feeRepository = AppDataSource.getRepository(Fee)
      const fee = await feeRepository.findOne({
        where: { ref }
      })

      if (!fee) return res.status(HTTPStatusCode.BadRequest).json({ message: "Fee not found" })

      fee.isPaid = true
      await feeRepository.save(fee)
      return new ApiResponse(res, HTTPStatusCode.Ok).success(fee, "Update fee successfully")

    } catch (err) {
      errorHandler(err, req, res, next)
    }
  }

  static async deleteFee(req: Request, res: Response, next: NextFunction) {
    try {
      const { ref } = req.params
      const feeRepository = AppDataSource.getRepository(Fee)
      const fee = await feeRepository.findOne({
        where: { ref }
      })

      if (!fee) return res.status(HTTPStatusCode.BadRequest).json({ message: "Fee not found" })

      await feeRepository.remove(fee)
      return new ApiResponse(res, HTTPStatusCode.Ok).success(null, "Delete fee successfully")
    } catch (err) {
      errorHandler(err, req, res, next)
    }
  }
}
