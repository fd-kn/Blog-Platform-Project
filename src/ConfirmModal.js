import React from 'react';

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="border-2 border-black bg-white p-4 rounded-lg">
        <p className='flex justify-center text-lg pb-4'>{message}</p>

        <button className='mx-6 p-2 rounded-lg bg-blue-200  hover:bg-blue-400
         hover:scale-110 duration-300' onClick={handleConfirm}>
          Confirm
        </button>

        <button className='mx-6 p-2 rounded-lg bg-blue-200  hover:bg-blue-400
          hover:scale-110 duration-300' onClick={handleCancel}>
          Cancel
        </button>

      </div>
    </div>
  );
};

export default ConfirmModal;
