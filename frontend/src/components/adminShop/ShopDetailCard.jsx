import React ,{useState} from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Calculator, Truck } from "lucide-react";

export default function ShopDetailCard({
  detail,
  index,
  changeEnabled,
  onEdit,
  onDelete,
}) {
    const [showModal, setShowModal] = useState(false);
  const isGST = detail.chargeType === "gst";
  const isDelivery = detail.chargeType === "delivery";

  const sgst = detail?.subCharges?.find((i) => i.name === "SGST")?.value;
  const cgst = detail?.subCharges?.find((i) => i.name === "CGST")?.value;
  const handleDelete = async () => {
    await onDelete(detail);
    setShowModal(false);
  };



  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group relative bg-card rounded-2xl p-5 border border-border/50 hover:shadow-lg transition-all duration-300 overflow-visible"
      >

        {/* ================= ACTION ICONS ================= */}
        {changeEnabled && (
          <div
            className="
              absolute top-4 right-4 flex gap-2
              opacity-0 invisible
              group-hover:opacity-100 group-hover:visible
              transition-all duration-200
              z-[999]
            "
          >
            {/* EDIT */}
            <button
              onClick={() => onEdit(detail)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-md text-indigo-600 hover:bg-indigo-50"
            >
              <Pencil className="w-4 h-4" />
            </button>

            {/* DELETE */}
            <button
              onClick={() => setShowModal(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-md text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= CONTENT ================= */}
        <div className="flex items-start gap-3">

          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              isGST
                ? "bg-purple-100 text-purple-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {isGST ? (
              <Calculator className="w-5 h-5" />
            ) : (
              <Truck className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-base">
              {isGST ? "GST Charges" : "Delivery Charge"}
            </h3>

            <div className="mt-2 text-sm text-muted-foreground space-y-1">
              {isDelivery && (
                <p>
                  Value: <span className="text-foreground font-medium">{detail.value}</span>
                </p>
              )}

              {isGST && (
                <>
                  <p>SGST: <span className="font-medium">{sgst ?? 0}%</span></p>
                  <p>CGST: <span className="font-medium">{cgst ?? 0}%</span></p>
                </>
              )}
            </div>
          </div>

        </div>
      </motion.div>

      {/* ================= CONFIRM MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowModal(false)}
          />

          {/* BOX */}
          <div className="relative bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-2">
              Delete Confirmation
            </h2>

            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete this charge?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border text-sm"
              >
                No
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm"
              >
                Yes, Delete
              </button>

            </div>
          </div>

        </div>
      )}
    </>
  );

}