"use client";

import { m, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faExclamationTriangle,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { toastVariants } from "@/lib/animation-variants";

export interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface AnimatedToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const iconMap = {
  success: faCircleCheck,
  error: faExclamationTriangle,
  warning: faExclamationTriangle,
  info: faInfoCircle,
};

const bgMap = {
  success: "#059669",
  error: "#EF4444",
  warning: "#D97706",
  info: "#3B82F6",
};

export default function AnimatedToastContainer({
  toasts,
  onDismiss,
}: AnimatedToastContainerProps) {
  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 1080, maxWidth: 380 }}
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <m.div
            key={toast.id}
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            layout
            className="d-flex align-items-center mb-2 shadow-lg"
            role="alert"
            style={{
              background: bgMap[toast.type],
              color: "#FFFFFF",
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <FontAwesomeIcon
              icon={iconMap[toast.type]}
              style={{ marginRight: 10, fontSize: 16 }}
            />
            <span className="flex-grow-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              style={{
                background: "none",
                border: "none",
                color: "#FFFFFF",
                marginLeft: 12,
                cursor: "pointer",
                opacity: 0.7,
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
