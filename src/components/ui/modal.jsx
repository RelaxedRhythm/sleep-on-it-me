"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const typeStyles = {
  error: "border-rose-200 bg-rose-50 text-rose-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  confirmation: "border-sky-200 bg-sky-50 text-sky-700",
  info: "border-stone-200 bg-white text-stone-700",
};

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  children,
  actions,
  size = "md",
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previouslyFocused = document.activeElement;
    const focusable = dialogRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusable?.[0];
    const lastElement = focusable?.[focusable.length - 1];

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      if (!focusable || focusable.length === 0) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    firstElement?.focus();

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/70 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title || "Dialog"}
        className={`w-full ${sizeClasses[size] || sizeClasses.md} max-h-[90vh] overflow-y-auto rounded-2xl border bg-white p-6 shadow-2xl transition-all duration-200 ease-out ${typeStyles[type] || typeStyles.info}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            {title ? (
              <h3 className="text-lg font-semibold text-stone-800">{title}</h3>
            ) : null}
            {message ? <p className="mt-2 text-sm leading-6 text-stone-600">{message}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-700"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {children ? <div className="mt-5">{children}</div> : null}

        {actions ? <div className="mt-6 flex flex-wrap justify-end gap-2">{actions}</div> : null}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
