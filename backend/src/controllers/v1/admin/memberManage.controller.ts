import { Request, Response } from "express";
import path from "path";
import { sendError, sendSuccess } from "../../../common/sender.common";
import { DeletedEnum, VerifiedEnum } from "../../../constants/admin.enums";
import {
  CommonErrorMessage,
  CommonSuccessMessage,
} from "../../../constants/error.messages";
import { ModuleName } from "../../../constants/permissions.constants";
import Member, { IMember } from "../../../models/member/member.model";
import { deleteFile } from "../../../multer/deleteFile";
import { UpdateMemberToLogout } from "../../../utils/loginHistory.utils";

// Create New Member
export const CreateMember = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.MEMBER_MANAGEMENT;
  try {
    const {
      fullName,
      email,
      phoneNumber,
      street,
      city,
      state,
      pincode,
      country,
      isAddressVerified,
      gender,
      bio,
    } = req.body;

    const existingMember = await Member.findOne({ email }).lean();

    if (existingMember?.isDeleted) {
      deleteFile(req?.file?.filename);
      return sendError(req, res, "This account is deleted");
    }

    if (existingMember?.isVerified) {
      deleteFile(req?.file?.filename);
      return sendError(req, res, "Account already exists", 400);
    }

    // 🔍 Check verified phone linked to someone else
    const verifiedWithPhone = await Member.findOne(
      {
        email: { $ne: email },
        phoneNumber,
        isVerifiedNumber: VerifiedEnum.VERIFIED,
        isDeleted: DeletedEnum.NOT_DELETED,
      },
      "_id"
    ).lean();

    if (verifiedWithPhone) {
      deleteFile(req?.file?.filename);
      return sendError(req, res, "Phone number in use", 400);
    }

    // ⚠️ Update phone if needed
    if (existingMember?.phoneNumber !== phoneNumber) {
      await Member.updateOne({ email }, { phoneNumber });
    }

    const newMember = new Member({
      fullName,
      email,
      phoneNumber,
      address: { street, city, state, pincode, country, isAddressVerified },
      gender,
      bio,
      isVerified: VerifiedEnum.VERIFIED,
      isVerifiedEmail: VerifiedEnum.VERIFIED,
      isVerifiedNumber: VerifiedEnum.VERIFIED,
    });

    if (req.file?.filename) {
      const fileName = req.file?.filename;
      newMember.profilePic = `/members/${fileName}`;
    }

    const savedMember: IMember = await newMember.save();
    return sendSuccess(req, res, savedMember, "Member Created Successfully");
  } catch (error: any) {
    deleteFile(req?.file?.filename);
    sendError(req, res, (error as Error).message);
  }
};

// Get All Members
export const GetMembers = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.MEMBER_MANAGEMENT;
  try {
    const { page = 1, pageSize = 10, status, search = "" } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const filter: any = {};
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status !== undefined && status !== null) {
      filter.isVerified = { $eq: Number(status) };
    }

    const result = await Member.aggregate([
      { $match: { ...filter } },
      { $sort: { createdAt: -1, updatedAt: -1 } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: Number(pageSize) },
            {
              $project: {
                fullName: 1,
                email: 1,
                phoneNumber: 1,
                profilePic: 1,
                gender: 1,
                bio: 1,
                authType: 1,
                address: 1,
                socialAuthId: 1,
                isVerifiedEmail: 1,
                isVerifiedNumber: 1,
                isVerified: 1,
                isDeleted: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const members = result[0]?.data || [];
    const total = result[0]?.total[0]?.count || 0;

    sendSuccess(
      req,
      res,
      {
        data: members,
        total,
        page: Number(page),
        pageSize: Math.ceil(total / Number(pageSize)),
      },
      CommonSuccessMessage.admin.member.memberRetrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.member.fetchFailed,
      500,
      error
    );
  }
};

// Update Member by Id
export const UpdateMemberById = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.MEMBER_MANAGEMENT;
  try {
    const hasBodyData =
      req.body &&
      Object.values(req.body).some(
        (value) => value !== undefined && value !== null && value !== ""
      );
    const hasFileData = req?.file && req?.file?.filename;

    if (!hasBodyData && !hasFileData) {
      deleteFile(req.file?.path);
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.management.oneFieldRequired,
        400
      );
    }

    const { phoneNumber, email } = req.body;
    const { id } = req.params;

    const memberToUpdate = await Member.findById(id).lean();
    if (!memberToUpdate) {
      deleteFile(req?.file?.filename);
      return sendError(req, res, CommonErrorMessage.admin.member.notFound, 400);
    }

    if (memberToUpdate?.isDeleted) {
      deleteFile(req?.file?.filename);
      return sendError(req, res, "This account is deleted", 400);
    }

    // 🔍 Check phone linked to someone else
    if (phoneNumber) {
      const verifiedWithPhone = await Member.findOne(
        {
          phoneNumber,
          email: { $ne: memberToUpdate?.email },
          isVerifiedNumber: VerifiedEnum.VERIFIED,
          isDeleted: DeletedEnum.NOT_DELETED,
        },
        "_id"
      ).lean();

      if (verifiedWithPhone) {
        deleteFile(req?.file?.filename);
        return sendError(req, res, "Phone number in use", 400);
      }
    }

    // 🔍 Check email linked to someone else
    if (email) {
      const isEmailInUse = await Member.findOne(
        {
          _id: { $ne: id },
          email,
          isDeleted: DeletedEnum.NOT_DELETED,
        },
        "_id"
      ).lean();

      if (isEmailInUse) {
        deleteFile(req?.file?.filename);
        return sendError(
          req,
          res,
          "Email is already linked to verified account",
          400
        );
      }
    }
    const updatedValue: any = {};

    Object.entries(req.body).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (
          key == "street" ||
          key == "city" ||
          key == "state" ||
          key == "country" ||
          key == "isAddressVerified"
        ) {
          // Initialize address object if it doesn't exist
          if (!updatedValue.address) {
            updatedValue.address = {};
          }
          updatedValue.address[key] = value;
        } else {
          updatedValue[key] = value;
        }
      }
    });

    // Preserve existing address fields that aren't being updated
    if (updatedValue.address && Object.keys(updatedValue.address).length > 0) {
      const existingAddress = memberToUpdate.address || {};
      updatedValue.address = {
        ...existingAddress,
        ...updatedValue.address,
      };
    }

    // deleting the old image
    if (req.file?.filename) {
      const fullPath = path.join(
        process.cwd(),
        "public",
        String(memberToUpdate?.profilePic)
      );
      deleteFile(fullPath);
      const fileName = req.file?.filename;
      updatedValue.profilePic = `/members/${fileName}`;
    }

    const updatedMember = await Member.findByIdAndUpdate(
      id,
      {
        $set: { ...updatedValue },
      },
      { new: true, lean: true }
    );

    if (!updatedMember) {
      deleteFile(req?.file?.filename);
      sendError(req, res, CommonErrorMessage.admin.member.updateFailed, 400);
    }

    return sendSuccess(
      req,
      res,
      updatedMember,
      CommonSuccessMessage.admin.member.updateSuccess
    );
  } catch (error: any) {
    deleteFile(req?.file?.filename);
    sendError(
      req,
      res,
      (error as Error).message || CommonErrorMessage.admin.member.updateFailed,
      500
    );
  }
};

// Delete Member
export const DeleteMember = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.MEMBER_MANAGEMENT;

  try {
    const { id } = req.params;
    const memberToDelete: any = await Member.findOne({
      _id: id,
      isDeleted: DeletedEnum.NOT_DELETED,
    }).lean();

    if (!memberToDelete) {
      return sendError(req, res, CommonErrorMessage.admin.member.notFound, 400);
    }

    // Update member isDeleted to 1 (delete)
    const deleteMember = await Member.findByIdAndUpdate(
      id,
      { $set: { isDeleted: DeletedEnum.DELETED } },
      { new: true, lean: true }
    ).lean();

    if (!deleteMember) {
      return sendError(req, res, CommonErrorMessage.admin.member.deleteFailed);
    }

    // logout the member from it's active session
    UpdateMemberToLogout({ memberIds: String(deleteMember?._id) });

    return sendSuccess(
      req,
      res,
      deleteMember,
      CommonSuccessMessage.admin.member.deleteSuccess
    );
  } catch (error: any) {
    return sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.member.deleteFailed,
      500
    );
  }
};

// Get the Member by Id
export const GetMemberById = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.MEMBER_MANAGEMENT;

  try {
    const { id } = req.params;
    const member = await Member.findById(id).lean();

    if (!member) {
      return sendError(req, res, CommonErrorMessage.admin.member.notFound, 400);
    }

    sendSuccess(
      req,
      res,
      member,
      CommonSuccessMessage.admin.member.memberRetrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.member.notFound,
      500,
      error
    );
  }
};
