import React, { useState } from "react";
import axios from "axios";
import {
  FiCornerDownRight,
  FiMessageCircle,
  FiSend,
  FiEdit3,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const Reply = ({ review, product, token, onReplySuccess }) => {
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);

  const adminReply = review?.adminReply;

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  // ==========================================
  // SUBMIT REPLY
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Admin authentication required");
      return;
    }

    if (!product?._id) {
      toast.error("Product information is missing");
      return;
    }

    if (!review?._id) {
      toast.error("Review information is missing");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a reply");
      return;
    }

    if (comment.trim().length < 2) {
      toast.error("Reply must contain at least 2 characters");
      return;
    }

    try {
      setSubmitting(true);

      const response = await axios.post(
        backendUrl + "/api/admin/review/reply",
        {
          productId: product._id,
          reviewId: review._id,
          comment: comment.trim(),
        },
        {
          headers: {
            token,
          },
        },
      );

      if (response.data.success) {
        toast.success(
          adminReply
            ? "Reply updated successfully"
            : "Reply added successfully",
        );

        setComment("");
        setEditing(false);

        if (onReplySuccess) {
          onReplySuccess();
        }
      } else {
        toast.error(response.data.message || "Unable to reply");
      }
    } catch (error) {
      console.log("ADMIN REPLY ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to submit reply",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // EXISTING REPLY
  // ==========================================

  if (adminReply?.comment && !editing) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        {/* Reply Header */}

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
              <FiMessageCircle className="text-sm" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-bold text-gray-900 sm:text-sm">
                  {adminReply.signature || "Admin Response"}
                </p>

                <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-600">
                  Admin
                </span>
              </div>

              {adminReply.date && (
                <p className="mt-0.5 text-[11px] text-gray-400">
                  {formatDate(adminReply.date)}
                </p>
              )}
            </div>
          </div>

          {/* Edit Button */}

          <button
            type="button"
            onClick={() => {
              setComment(adminReply.comment);
              setEditing(true);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
          >
            <FiEdit3 />
            Edit
          </button>
        </div>

        {/* Reply Content */}

        <div className="mt-4 border-l-2 border-gray-300 pl-4">
          <div className="flex gap-2">
            <FiCornerDownRight className="mt-1 shrink-0 text-sm text-gray-400" />

            <p className="text-sm leading-6 text-gray-700">
              {adminReply.comment}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // REPLY FORM
  // ==========================================

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      {/* Header */}

      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white">
          <FiMessageCircle className="text-sm" />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-700">
            {adminReply ? "Edit Admin Reply" : "Reply to Customer"}
          </p>

          <p className="text-[11px] text-gray-400">
            Your response will be visible to the customer.
          </p>
        </div>
      </div>

      {/* Form */}

      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="Write your response to this customer..."
          className="
            w-full
            resize-none
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-3
            text-sm
            text-gray-800
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-gray-400
            focus:ring-2
            focus:ring-gray-200
          "
        />

        {/* Bottom */}

        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            {comment.length}/500
          </span>

          <div className="flex gap-2">
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setComment("");
                  setEditing(false);
                }}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="
                flex
                items-center
                gap-2
                rounded-lg
                bg-black
                px-4
                py-2
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-white
                transition
                hover:bg-gray-800
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <FiSend />

              {submitting
                ? "Sending..."
                : adminReply
                  ? "Update Reply"
                  : "Send Reply"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Reply;
