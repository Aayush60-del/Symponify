import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../context/ToastContext'

const toastStyles = {
  success: {
    bg: 'bg-[var(--surface-elevated)]',
    border: 'border-green-500/30',
    text: 'text-[var(--text)]',
    icon: 'OK',
    iconColor: 'text-green-400',
  },
  error: {
    bg: 'bg-[var(--surface-elevated)]',
    border: 'border-red-500/30',
    text: 'text-[var(--text)]',
    icon: '!',
    iconColor: 'text-red-400',
  },
  info: {
    bg: 'bg-[var(--surface-elevated)]',
    border: 'border-[var(--line)]',
    text: 'text-[var(--text)]',
    icon: 'i',
    iconColor: 'text-[var(--accent)]',
  },
  warning: {
    bg: 'bg-[var(--surface-elevated)]',
    border: 'border-yellow-500/30',
    text: 'text-[var(--text)]',
    icon: '!',
    iconColor: 'text-yellow-400',
  },
  default: {
    bg: 'bg-[var(--surface-elevated)]',
    border: 'border-[var(--line)]',
    text: 'text-[var(--text)]',
    icon: '-',
    iconColor: 'text-[var(--accent)]',
  },
}

const toastVariants = {
  initial: { opacity: 0, y: -50, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
}

const Toast = ({ id, message, type = 'default', onClose }) => {
  const style = toastStyles[type] || toastStyles.default

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`${style.bg} ${style.border} ${style.text} border rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg max-w-md`}
      role="status"
      aria-live="polite"
    >
      <span className={`${style.iconColor} font-bold text-sm flex-shrink-0`}>
        {style.icon}
      </span>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={() => onClose(id)}
        className={`${style.iconColor} hover:opacity-70 flex-shrink-0`}
        aria-label="Close notification"
      >
        x
      </button>
    </motion.div>
  )
}

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2"
      role="region"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
