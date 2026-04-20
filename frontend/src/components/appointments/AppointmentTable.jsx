import React from "react";
import { format } from "date-fns";
import { Eye, Dog, Cat, Bird, MapPin, Clock } from "lucide-react";
import StatusBadge from "./StatusBadge";

// ================= CN =================
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ================= PET ICONS =================
const petIcons = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
};

// ================= TABLE =================
const Table = ({ children }) => (
  <div className="relative w-full overflow-auto">
    <table className="w-full text-sm border border-gray-200">{children}</table>
  </div>
);

const TableHeader = ({ children }) => <thead>{children}</thead>;
const TableBody = ({ children }) => <tbody>{children}</tbody>;

const TableRow = ({ children, onClick }) => (
  <tr
    onClick={onClick}
    className="border border-gray-200 hover:bg-gray-50 cursor-pointer transition"
  >
    {children}
  </tr>
);

const TableHead = ({ children }) => (
  <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">
    {children}
  </th>
);

const TableCell = ({ children, className }) => (
  <td className={`p-3 align-middle ${className || ""}`}>{children}</td>
);

// ================= MAIN =================
export default function AppointmentTable({ appointments, onView }) {
  if (!appointments?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
        <Clock className="w-6 h-6 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-500">No appointments found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <Table>
        {/* HEADER */}
        <TableHeader>
          <tr className="bg-gray-100">
            <TableHead>Customer</TableHead>
            <TableHead>Pet & Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </tr>
        </TableHeader>

        {/* BODY */}
        <TableBody>
          {appointments.map((apt) => {
            const PetIcon = petIcons[apt.petCategory] || Dog;

            return (
              <TableRow key={apt._id} onClick={() => onView(apt)}>
                {/* Customer */}
                <TableCell>
                  <p className="font-semibold">{apt.name}</p>
                  <p className="text-xs text-gray-500">{apt.email}</p>
                </TableCell>

                {/* Pet */}
                <TableCell>
                  <div className="flex items-center gap-2 ">
                    <div className="bg-green-100 p-1 rounded-full"><PetIcon className="w-4 h-4 text-green-800 " /></div>
                    <div>
                      <p className="font-medium">{apt.service}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {apt.petCategory}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Date */}
                <TableCell>
                  <p className="font-medium">
                    {format(new Date(apt.dateOfAppointment), "MMM dd, yyyy")}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {apt.time}
                  </p>
                </TableCell>

                {/* Location */}
                <TableCell className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {apt.location}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusBadge status={apt.status} />
                </TableCell>

                {/* Action */}
                <TableCell className="text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(apt);
                    }}
                    className="text-green-600 flex items-center  gap-1 ml-auto hover:bg-green-100 rounded px-3 py-1 cursor-pointer "
                  >
                    <Eye className="w-4 h-4 mt-1" />
                    View
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}