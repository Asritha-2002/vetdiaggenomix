import React from "react";
import { Tags } from "lucide-react";
import VoucherRow from "./VoucherRow";

export default function VoucherTable({
  vouchers = [],
  totalFiltered = 0,
  currentPage = 1,
  totalPages = 1,
  onEdit,
  onToggle,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mx-4">
      
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Vouchers List
          </h3>
          <p className="text-sm text-gray-500">
            Showing {vouchers.length} of {totalFiltered} vouchers
          </p>
        </div>

        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages || 1}
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          
          {/* HEAD */}
          <thead className="bg-gray-100">
            <tr>
              {[
                "Code",
                "Type",
                "Value",
                "Status",
                "Usage",
                "Expiry",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left py-3.5 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-gray-200">
            {vouchers.length === 0 ? (
              
              /* EMPTY STATE */
              <tr>
                <td colSpan={7} className="text-center py-20">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Tags className="w-6 h-6 text-gray-400" />
                  </div>

                  <p className="text-gray-500 font-medium">
                    No vouchers found
                  </p>
                </td>
              </tr>
            ) : (
              
              /* ROWS */
              vouchers.map((voucher, index) => (
                <VoucherRow
                  key={voucher._id || voucher.id} // supports MongoDB + normal id
                  voucher={voucher}
                  index={index}
                  onEdit={onEdit}
                  onToggle={onToggle}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}