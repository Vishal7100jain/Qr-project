"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const admin_enums_1 = require("../../constants/admin.enums");
const enums_1 = require("../../constants/enums");
const blogSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    description: String,
    tags: [String],
    status: {
        type: Number,
        enum: enums_1.BlogStatus,
        default: enums_1.BlogStatus.DRAFT,
    },
    isDeleted: {
        type: Number,
        enum: admin_enums_1.DeletedEnum,
        default: admin_enums_1.DeletedEnum.NOT_DELETED,
    },
    type: { type: Number, default: enums_1.BlogType.normal },
    thumbnail: String,
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: String },
    contentLength: { type: Number, default: 0 },
    hasImage: { type: Boolean, default: false },
    createdByRole: { type: Number, enum: enums_1.RoleEnum, required: true },
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, ref: "BlogCategory" },
    approvedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Admin" },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    createdByModel: {
        type: String,
        required: true,
        enum: ["Admin", "Artist"], // Specify which models can create blogs
    },
    modifiedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    modifiedByModel: {
        type: String,
        required: true,
        enum: ["Admin", "Artist"], // Specify which models can modify blogs
    },
}, { timestamps: true });
blogSchema.pre("save", function (next) {
    this.contentLength = this.content ? this.content.length : 0;
    this.hasImage = !!this.thumbnail;
    next();
});
// Virtual for populating createdBy based on the model type
blogSchema.virtual("createdByRef", {
    ref: function () {
        return this.createdByModel;
    },
    localField: "createdBy",
    foreignField: "_id",
    justOne: true,
});
// Virtual for populating modifiedBy based on the model type
blogSchema.virtual("modifiedByRef", {
    ref: function () {
        return this.modifiedByModel;
    },
    localField: "modifiedBy",
    foreignField: "_id",
    justOne: true,
});
// Apply virtuals when converting to JSON
blogSchema.set("toJSON", { virtuals: true });
// Apply virtuals when converting to Object
blogSchema.set("toObject", { virtuals: true });
const Blog = mongoose_1.default.model("Blog", blogSchema);
exports.default = Blog;
