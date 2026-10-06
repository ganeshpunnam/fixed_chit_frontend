export default function Modal({ open, onClose, title, size = 'md', children }) {
  if (!open) return null;
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    xxl: 'max-w-4xl',
  };
  const sizeClass = sizeClasses[size] || 'max-w-md';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-lg w-full ${sizeClass} p-6 m-auto transform transition-all max-h-[90vh] flex flex-col`}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 className="text-xl font-semibold text-dark">{title}</h3>
          <button onClick={onClose} className="text-dark hover:text-red-500 text-2xl">&times;</button>
        </div>
        <div className="overflow-y-auto flex-1 text-sm text-gray-800">
          {children}
        </div>
      </div>
    </div>
  );
}