import { Response, Request, NextFunction } from "express";

import { AppError } from "../errors/app-error.js";
import { getDistance } from "geolib";

export async function getShippingOptions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const courier =
      "jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana:dse";
    const { origin, destination, weight } = req.body;

    const response = await fetch(
      "https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost",
      {
        method: "POST",
        headers: {
          key: process.env.RAJAONGKIR_API_KEY as string,
        },
        body: new URLSearchParams({
          origin,
          destination,
          weight: weight.toString(),
          courier,
          price: "lowest",
        }),
      }
    );

    if (!response.ok) {
      throw new AppError("Failed to fetch shipping cost", 500);
    }

    const data = await response.json();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export function calculateDistance(
  lat1: number,
  long1: number,
  lat2: number,
  long2: number
) {
  return getDistance(
    { latitude: lat1, longitude: long1 },
    { latitude: lat2, longitude: long2 }
  );
}
