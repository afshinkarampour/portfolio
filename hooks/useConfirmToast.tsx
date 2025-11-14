import React from "react";
import { toast } from "sonner";

type ConfirmOptions = {
  confirmLabel?: string;
  cancelLabel?: string;
  className?: string;
  confirmVariant?: "danger" | "primary";
};

export const useConfirmToast = () => {
  const confirmToast = (
    message: string,
    opts: ConfirmOptions = {}
  ): Promise<boolean> => {
    const {
      confirmLabel = "Yes",
      cancelLabel = "No",
      className = "",
      confirmVariant = "danger",
    } = opts;

    const confirmClasses = {
      danger: "bg-red-500 hover:bg-red-600 focus:ring-red-500",
      primary: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500",
    };

    return new Promise((resolve) => {
      toast.custom(
        (t: any) => (
          <div
            className={`flex flex-col gap-4 bg-white dark:bg-neutral-700 p-6 rounded-xl shadow-xl border border-gray-300 dark:border-gray-600 min-w-[400px] max-w-[500px] mx-auto ${className}`}
          >
            <p className="font-medium text-base text-gray-900 dark:text-gray-100 text-center">
              {message}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                className={`px-6 py-2 text-sm font-medium text-white rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmClasses[confirmVariant]}`}
                autoFocus
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
          closeButton: true,
          position: "top-center",
        }
      );
    });
  };

  return { confirmToast };
};
