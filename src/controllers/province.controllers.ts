import cache from "memory-cache"
import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Province } from "../entities"
import { ApiResponse } from "../middlewares"
import { HTTPStatusCode, PROVINCE_CACHE_KEY } from "../constants"
import { errorHandler } from "../middlewares"

export class ProvinceControllers {
  static async getAllProvinces(req: Request, res: Response, next: NextFunction) {
    try {
      const data = cache.get(PROVINCE_CACHE_KEY)
      if (data) {
        return new ApiResponse(res, HTTPStatusCode.Ok).success(data, "Get provinces successfully")
      } else {
        const provinceRepository = AppDataSource.getRepository(Province)
        const provinces = await provinceRepository.find()
        cache.put(PROVINCE_CACHE_KEY, provinces, 1000)
        return new ApiResponse(res, HTTPStatusCode.Ok).success(provinces, "Get provinces successfully")
      }
    } catch (err) {
      errorHandler(err, req, res, next)
    }
  }

  static async createProvince(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, name } = req.body
      if (!code || !name) return new ApiResponse(res, HTTPStatusCode.BadRequest).error("code and name are required")
      const province = new Province()
      province.code = code
      province.name = name
      const provinceRepository = AppDataSource.getRepository(Province)
      await provinceRepository.save(province)
      return new ApiResponse(res, HTTPStatusCode.Created).success(province, "Create province successfully")
    } catch (error) {
      errorHandler(error, req, res, next)
    }
  }

  static async updateProvince(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.params
      const { name } = req.body
      const provinceRepository = AppDataSource.getRepository(Province)
      const province = await provinceRepository.findOne({
        where: { code }
      })

      if (!province) return res.status(HTTPStatusCode.BadRequest).json({ message: "Province not found" })

      province.name = name
      await provinceRepository.save(province)
      return new ApiResponse(res, HTTPStatusCode.Ok).success(province, "Update province successfully")
    } catch (err) {
      errorHandler(err, req, res, next)
    }
  }

  static async deleteProvince(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.params
      const provinceRepository = AppDataSource.getRepository(Province)
      const province = await provinceRepository.findOne({
        where: { code }
      })

      if (!province) return res.status(HTTPStatusCode.NotFound).json({ message: "Province not found" })

      await provinceRepository.remove(province)
      return new ApiResponse(res, HTTPStatusCode.Ok).success(null, "Delete province successfully")
    } catch (err) {
      errorHandler(err, req, res, next)
    }
  }
}
