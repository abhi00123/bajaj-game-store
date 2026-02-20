import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable modal overlay with focus trap and keyboard close.
 */
function Modal({ isOpen, onClose, children, closable }) {
    const handleKeyDown = useCallback((e) => {
        if (closable && e.key === 'Escape') onClose();
    }, [closable, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-fade-in"
                onClick={closable ? onClose : undefined}
                aria-hidden="true"
            />
            {/* Panel */}
            <div className="relative z-10 w-full max-w-md animate-scale-in">
                {children}
            </div>
        </div>
    );
}

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    closable: PropTypes.bool,
};

Modal.defaultProps = {
    closable: false,
};

export default Modal;
