import React from 'react';
import './Toggle.css';

const Toggle = ({ id, label, icon, checked, onChange, disabled = false }) => {
    return (
        <div className={`toggle-container ${disabled ? 'disabled' : ''}`}>
            <div className="toggle-label-wrapper">
                {icon && <span className="toggle-icon">{icon}</span>}
                <span className="toggle-label">{label}</span>
            </div>
            <button
                role="switch"
                aria-checked={checked}
                aria-label={label}
                className={`toggle-switch ${checked ? 'active' : ''}`}
                onClick={() => !disabled && onChange(!checked)}
                disabled={disabled}
            >
                <span className="toggle-track">
                    <span className="toggle-knob"></span>
                </span>
            </button>
        </div>
    );
};

export default Toggle;
