import React from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  CheckCircle2,
  XCircle,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";

export default function UserInfoCard({ user }) {
  if (!user) return null;

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
      <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
        <User className="w-4 h-4 text-green-600" />
        Customer Information
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* NAME */}
        <div className="flex items-start gap-3">
          <div className="border border-gray-200 rounded-lg p-1">
            <User className="w-4 h-4 text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Full Name</p>
            <p className="text-sm font-medium text-gray-800">
              {user.name || "N/A"}
            </p>
          </div>
        </div>

        {/* EMAIL */}
        <div className="flex items-start gap-3">
          <div className="border border-gray-200 rounded-lg p-1">
            <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm font-medium text-gray-800">
              {user.email || "N/A"}
            </p>
          </div>
        </div>

        {/* PHONE */}
        <div className="flex items-start gap-3">
         <div className="border border-gray-200 rounded-lg p-1">
            <Phone className="w-4 h-4 text-gray-500 " />
          </div>
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="text-sm font-medium text-gray-800">
              {user.phone || "N/A"}
            </p>
          </div>
        </div>

        {/* GENDER */}
        <div className="flex items-start gap-3">
          <div className="border border-gray-200 rounded-lg p-1">
            <Shield className="w-4 h-4 text-gray-500 " />
          </div>
          <div>
            <p className="text-xs text-gray-500">Gender</p>
            <p className="text-sm font-medium text-gray-800">
              {user.gender || "N/A"}
            </p>
          </div>
        </div>

        {/* VERIFIED */}
        <div className="flex items-start gap-3">
          {user.isVerified ? (
            <div className="border border-gray-200 rounded-lg p-1">
             <CheckCircle2 className="w-4 h-4 text-green-500 " />
          </div>
           
          ) : (
            <div className="border border-gray-200 rounded-lg p-1">
            <XCircle className="w-4 h-4 text-red-500 " />
          </div>
            
          )}
          <div>
            <p className="text-xs text-gray-500">Verification</p>
            <p className="text-sm font-medium text-gray-800">
              {user.isVerified ? "Verified" : "Not Verified"}
            </p>
          </div>
        </div>

        {/* JOINED DATE */}
        <div className="flex items-start gap-3">
          <div className="border border-gray-200 rounded-lg p-1">
            <Calendar className="w-4 h-4 text-gray-500 " />
          </div>
          <div>
            <p className="text-xs text-gray-500">Joined</p>
            <p className="text-sm font-medium text-gray-800">
              {user.createdAt
                ? format(new Date(user.createdAt), "MMM dd, yyyy")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* ADDRESSES */}
      {user.addresses?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-500  uppercase tracking-wider mb-2">
            Addresses
          </p>

          <div className="space-y-2">
  {user.addresses.map((addr, idx) => (
    <div key={idx} className="flex items-start gap-2">
      <MapPin className="w-4 h-4 mt-0.5" />
      <div>
        <span className="text-xs font-medium text-green-600 capitalize">
          {addr.type || "address"}
        </span>
        <p className="text-sm">
          {addr.addl1
            ? `${addr.addl1}, ${addr.addl2 || ""}, ${addr.city}, ${addr.state} - ${addr.pincode}`
            : "N/A"}
        </p>
      </div>
    </div>
  ))}
</div>
        </div>
      )}
    </div>
  );
}