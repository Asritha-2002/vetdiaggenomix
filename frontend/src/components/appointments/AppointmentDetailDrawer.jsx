import React from "react";
import { format } from "date-fns";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Dog,
  Cat,
  Bird,
  Star
} from "lucide-react";

import StatusBadge from "./StatusBadge";
import UserInfoCard from "./UserInfoCard";
import ReviewCard from "./ReviewCard";

// ================= PET ICONS =================
const petIcons = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
};

export default function AppointmentDetailDrawer({
  appointment,
  user,
  reviews,
  onClose,
}) {
  if (!appointment) return null;

  const PetIcon = petIcons[appointment.petCategory] || Dog;

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold">Appointment Details</h2>
            <p className="text-xs text-gray-500">
              ID: {appointment._id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-green-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* STATUS + CREATED DATE */}
          <div className="flex items-center justify-between">
            <StatusBadge status={appointment.status} />
            <span className="text-xs text-gray-500">
              Created:{" "}
              {format(new Date(appointment.createdAt), "MMM dd, yyyy")}
            </span>
          </div>

          {/* APPOINTMENT INFO */}
          <div className="bg-gray-50 border border-green-500 bg-green-[#eef9f8] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <PetIcon className="w-5 h-5 text-green-500" />

              <div>
                <p className="font-semibold">{appointment.service}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {appointment.petCategory}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16}  className="text-green-500"/>
                <div className="flex flex-col">
                  <span className="text-gray-500">Date</span>
                  {format(
                  new Date(appointment.dateOfAppointment),
                  "MMM dd, yyyy"
                )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={16} className="text-green-500"/>
                <div className="flex flex-col">
                  <span className="text-gray-500">Time</span>
                  {appointment.time}
                </div>
              </div>

              <div className="flex items-center gap-2 col-span-2">
                <MapPin size={16} className="text-green-500"/>
                <div className="flex flex-col">
                  <span className="text-gray-500">Location</span>
                  {appointment.location}
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <h4 className="font-semibold text-sm mb-2 ">
              BOOKING CONTACT
            </h4>

            <div className="space-y-1 text-black">
              <p className="flex justify-between "><b className="text-gray-400 text-xs">Name</b> {appointment.name}</p>
              <p className="flex justify-between"><b className="text-gray-400 text-xs">Email</b> {appointment.email}</p>
              <p className="flex justify-between"><b className="text-gray-400 text-xs">Phone</b> {appointment.phone}</p>
            </div>
          </div>

          {/* RESCHEDULE REASON */}
          {appointment.rescheduleReason && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl">
              <p className="text-xs font-semibold text-yellow-700">
                Reschedule Reason
              </p>
              <p className="text-sm text-yellow-800">
                {appointment.rescheduleReason}
              </p>
            </div>
          )}

          {/* USER INFO COMPONENT */}
          <UserInfoCard user={user} />

          {/* REVIEWS COMPONENT */}
          <div>

            <div className="flex gap-1 items-center mb-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400"/>
              <h4 className="font-semibold text-sm">
              Customer Reviews
            </h4>
            </div>
            <ReviewCard reviews={reviews} />
          </div>
        </div>
      </div>
    </>
  );
}