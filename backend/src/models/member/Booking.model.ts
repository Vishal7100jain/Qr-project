import mongoose, { Document, Schema } from "mongoose";
import { DeletedEnum } from "../../constants/admin.enums";
import {
  AdminBookingOrderStatus,
  ArtistBookingOrderStatus,
} from "../../constants/enums";
import { BookingType, isVerifiedEnum } from "../../constants/member.enums";

export interface IBooking extends Document {
  serviceType: BookingType;
  memberId: mongoose.Types.ObjectId;
  artistId?: mongoose.Types.ObjectId;
  appointmentDate: Date;
  preferredTime: string;
  occasionType: string;
  styles: string[];
  budget: {
    min: number;
    max: number;
  };
  location: string;
  pincode: number;
  additionalDetails?: string;
  adminStatus: AdminBookingOrderStatus;
  artistStatus: ArtistBookingOrderStatus;
  artistStatusDescription: string;
  blacklistedArtistIds: mongoose.Types.ObjectId[];
  isVerified: isVerifiedEnum;
  isDeleted: DeletedEnum;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema<IBooking>(
  {
    serviceType: {
      type: Number,
      enum: BookingType,
      required: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Member",
    },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    preferredTime: {
      type: String,
      required: true,
    },
    occasionType: {
      type: String,
      required: true,
    },
    styles: {
      type: [String],
      required: true,
    },
    budget: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    additionalDetails: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    isVerified: {
      type: Number,
      enum: isVerifiedEnum,
      required: true,
    },
    isDeleted: {
      type: Number,
      enum: DeletedEnum,
      default: DeletedEnum.NOT_DELETED,
    },
    adminStatus: {
      type: Number,
      enum: AdminBookingOrderStatus,
      default: AdminBookingOrderStatus.PENDING,
    },
    artistStatus: {
      type: Number,
      enum: ArtistBookingOrderStatus,
      default: ArtistBookingOrderStatus.PENDING,
    },
    artistStatusDescription: {
      type: String,
      trim: true,
    },
    blacklistedArtistIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
      },
    ],
  },
  { timestamps: true }
);

// Indexes for better query performance
BookingSchema.index({ artistId: 1 });
BookingSchema.index({ memberId: 1 });
BookingSchema.index({ adminStatus: 1 });

const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;
