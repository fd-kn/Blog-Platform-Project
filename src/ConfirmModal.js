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
                //   {/* <div className=" fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                //     <div className="border-2 border-black bg-blue-200 w-1/2 p-4 rounded-lg">
                //       <p>Are you sure you want to publish this blog?</p>
                //       <button>Yes</button>
                //       <button>No</button>
                //     </div>
                //   </div> */}

    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="border-2 border-black bg-blue-200 w-1/2 p-4 rounded-lg">
        <p>{message}</p>
        <button className='pr-2' onClick={handleConfirm}>Confirm</button>
        <button className='pr-2' onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmModal;
