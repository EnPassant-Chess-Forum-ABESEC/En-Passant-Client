"use client";

import EditEventPanel from "@/components/admin/events/EditEventPanel";

export default function EditEventModal({
  isOpen,
  event,
  onClose,
  onSuccess,
}) {
  if (!isOpen || !event) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        <EditEventPanel
          key={event._id}
          event={event}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
}
