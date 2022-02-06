import React from 'react';

const Modal = function ({
  isShowing, title, onClose, children
}) {
  if (!isShowing) {
    return null;
  }
  return (
    <div className="modal-component">
      <div className="modal-component-content">
        <div className="modal-component-header">
          <button
            name="close-modal"
            type="button"
            onClick={onClose}
            className="close">&times;
          </button>
          <h2>{title}</h2>
        </div>
        <div className="modal-component-body">
          {children}
        </div>
        <div className="modal-component-footer" />
      </div>
    </div>
  );
};

export default Modal;
