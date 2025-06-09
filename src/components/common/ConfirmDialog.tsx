import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
}) => {
  if (!isOpen) return null;
  
  const getTypeClasses = () => {
    switch (type) {
      case 'danger':
        return 'bg-error-500 text-white';
      case 'warning':
        return 'bg-warning-500 text-white';
      case 'info':
        return 'bg-primary-500 text-white';
      default:
        return 'bg-error-500 text-white';
    }
  };
  
  const getConfirmButtonClasses = () => {
    switch (type) {
      case 'danger':
        return 'bg-error-500 hover:bg-error-600 focus:ring-error-500 text-white';
      case 'warning':
        return 'bg-warning-500 hover:bg-warning-600 focus:ring-warning-500 text-white';
      case 'info':
        return 'bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 text-white';
      default:
        return 'bg-error-500 hover:bg-error-600 focus:ring-error-500 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-slide-up">
        <div className={`flex items-center gap-3 p-4 ${getTypeClasses()} rounded-t-lg`}>
          <AlertTriangle size={24} />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        
        <div className="p-6">
          <p className="text-neutral-700">{message}</p>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="btn btn-outline"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              className={`btn ${getConfirmButtonClasses()}`}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;