import express from "express";
import {
  ModuleName,
  PermissionType,
} from "../../../constants/permissions.constants";
import { GetBookings } from "../../../controllers/v1/admin/adminBooking.controller";
import { checkModulePermission } from "../../../middleware/admin/adminAuth.middleware";
import { PageListQuerySchema } from "../../../schemas/admin/common.schema";
import { validateData } from "../../../utils/validation.utils";

const BookingManagement = express.Router();

// Get Bookings
BookingManagement.get(
  "/",
  checkModulePermission(ModuleName.BOOKING_MANAGEMENT, PermissionType.VIEW),
  validateData({ params: PageListQuerySchema }),
  GetBookings
);

export default BookingManagement;
