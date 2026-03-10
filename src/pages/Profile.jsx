import React, { useState, useEffect, useContext } from 'react';
import './Profile.css';
import Toggle from '../components/Toggle';
import Toast from '../components/Toast';
import { ThemeContext } from '../context/ThemeContext';
const API_URL_PROFILE = import.meta.env.VITE_API_URL_PROFILE;
// SVG Icons
const SunIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
);

const MoonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

const BellIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const SignOutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const KeyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
);

const Profile = ({ onLogout }) => {

  const [isEditing, setIsEditing] = useState(false);

    // Dark Mode الآن من ThemeContext
    const { darkMode, setDarkMode } = useContext(ThemeContext);

    const [pushNotifications, setPushNotifications] = useState(true);

const [student, setStudent] = useState({
    username: '',   // بدل name
    isOnline: true,
    bus_id: ''
});

const [editForm, setEditForm] = useState({
    username: '',       // بدل name
    bus_id: '',
    currentPassword: '', // جديد لتغيير كلمة المرور
    newPassword: '',     // جديد لتغيير كلمة المرور
    confirmPassword: ''  // جديد لتأكيد كلمة المرور
});

const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [nameError, setNameError] = useState({ hasError: false, suggestedName: '' });
    const [passwordError, setPasswordError] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

const fetchProfile = async () => {
  try {
const token = localStorage.getItem("token"); // قراءة JWT
const res = await fetch(`${API_URL_PROFILE}`, {
  method: "GET",
  headers: { Authorization: `Bearer ${token}` },
});
    const data = await res.json();

    if (res.ok) {
      setStudent(prev => ({
        ...prev,
        username: data.username,
        bus_id: data.bus_id,
        studentId: data.bus_id,
      }));

      setPushNotifications(data.notifications_enabled ?? true);

      setEditForm({
        username: data.username,
        bus_id: data.bus_id || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      if (data.dark_mode !== undefined) {
        setDarkMode(data.dark_mode);
      }
    } else {
      console.error("Failed to fetch profile:", data.message);
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
  } finally {
    setLoading(false);
  }
};
    const handlePreferenceUpdate = async (key, value) => {
        // تحديث Dark Mode أو Notifications
        if (key === 'dark_mode') setDarkMode(value);
        if (key === 'notifications_enabled') setPushNotifications(value);

        try {

          await fetch(`${API_URL_PROFILE}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ [key]: value }),
});
     } catch (error) {
            console.error('Error updating preference:', error);
            if (key === 'dark_mode') setDarkMode(!value);
            if (key === 'notifications_enabled') setPushNotifications(!value);
            setToast({ show: true, message: `Failed to save setting: ${error.message}`, type: 'error' });
        }
    };
        const handleEditClick = () => {
        setIsEditing(true);
        setShowPasswordFields(false); // Reset password fields visibility
    };

    const handleCloseModal = () => {
        setIsEditing(false);
        setNameError({ hasError: false, suggestedName: '' });
        setPasswordError(false);
        // Reset sensitive fields
        setEditForm(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear name error when user starts typing in name field
        if (name === 'username' && nameError.hasError) {
            setNameError({ hasError: false, suggestedName: '' });
        }
        // Validate password length in real-time
        if (name === 'newPassword') {
            if (value.length > 0 && value.length < 4) {
                setPasswordError(true);
            } else {
                setPasswordError(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for empty fields
        if (!editForm.username.trim() || (!showPasswordFields && !editForm.bus_id.trim())) {
            setToast({ show: true, message: "Please fill in all required fields.", type: 'error' });
            return;
        }

        // Password validation
        if (showPasswordFields && editForm.newPassword) {
            // Check password length
            if (editForm.newPassword.length < 4) {
                setPasswordError(true);
                return;
            }
            if (editForm.newPassword !== editForm.confirmPassword) {
                setToast({ show: true, message: "New passwords do not match!", type: 'error' });
                return;
            }
            if (!editForm.currentPassword) {
                setToast({ show: true, message: "Please enter your current password.", type: 'error' });
                return;
            }
        }

        // Check if any changes were made
        if (
            editForm.username === student.username &&
            editForm.bus_id === student.bus_id &&
            (!showPasswordFields || !editForm.newPassword)
        ) {
            setToast({ show: true, message: "No changes made to update.", type: 'error' });
            return;
        }

        try {
const body = {
    username: editForm.username, // بدل name
    bus_id: editForm.bus_id
};

if (showPasswordFields && editForm.newPassword) {
    body.currentPassword = editForm.currentPassword;
    body.newPassword = editForm.newPassword;
}
const res = await fetch(`${API_URL_PROFILE}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(body),
});
            const data = await res.json();

            if (res.ok) {
setStudent(prev => ({
    ...prev,
    username: data.username, // بدل name
    bus_id: data.bus_id
}));

setEditForm({
    username: data.username,  // بدل name
    bus_id: data.bus_id || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});                setNameError({ hasError: false, suggestedName: '' });
                setToast({ show: true, message: "Profile updated successfully!", type: 'success' });
            } else {
                // Check if it's a duplicate name error
                if (res.status === 400 && data.message && data.message.includes('already taken')) {
                    // Generate a suggested name
                    const baseName = editForm.username;
                    const randomNum = Math.floor(Math.random() * 999) + 1;
                    const suggestedName = `${baseName}${randomNum}`;

                    setNameError({
                        hasError: true,
                        suggestedName: suggestedName
                    });
                } else {
                    setToast({ show: true, message: data.message || 'Failed to update profile', type: 'error' });
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setToast({ show: true, message: `An error occurred: ${error.message}`, type: 'error' });
        }
    };

    const handleSignOut = () => {
        if (onLogout) {
            onLogout();
        }
    };

    if (loading) return <div className="profile-page"><div className="profile-container">Loading...</div></div>;

    return (
        <div className={`profile-page ${darkMode ? 'dark-mode' : ''}`}>
            <div className="profile-container">
                {/* Header */}
                <header className="profile-header">
                    <h3 className="page-title">Profile</h3>
                </header>

                {/* Student Profile Card */}
                <div className="student-card">
                    <div className="avatar-wrapper">
                        <div className="avatar-ring">
                            <div className="avatar avatar-placeholder">
                                {student.username.charAt(0)}
                            </div>
                        </div>
                        {student.isOnline && <span className="online-indicator"></span>}
                    </div>
                    <div className="student-info">
                        <h2 className="student-name">{student.username}</h2>
                        <div className="student-id-bus">
                            <span className="status-dot"></span>
<span className="id-label">ID Bus:</span> {student.bus_id}     
                   </div>
                    </div>
                </div>

                {/* Preferences Section */}
                <section className="settings-section">
                    <h3 className="section-title">PREFERENCES</h3>
                    <div className="settings-group">
                        <Toggle
                            id="dark-mode"
                            label="Dark Mode"
                            icon={darkMode ? <MoonIcon /> : <SunIcon />}
                            checked={darkMode}
                            onChange={(val) => handlePreferenceUpdate('dark_mode', val)}
                        />
                        <div className="setting-divider"></div>
                        <Toggle
                            id="push-notifications"
                            label="Notifications"
                            icon={<BellIcon />}
                            checked={pushNotifications}
                            onChange={(val) => handlePreferenceUpdate('notifications_enabled', val)}
                        />
                    </div>
                </section>

                {/* Account Section */}
                <section className="settings-section">
                    <h3 className="section-title">ACCOUNT</h3>
                    <div className="settings-group">
                        <button className="settings-item" onClick={handleEditClick}>
                            <div className="settings-item-content">
                                <span className="settings-icon"><SettingsIcon /></span>
                                <span className="settings-label">General Settings</span>
                            </div>
                            <span className="chevron">›</span>
                        </button>
                        <div className="setting-divider"></div>
                        <button className="settings-item destructive" onClick={handleSignOut}>
                            <div className="settings-item-content">
                                <span className="settings-icon destructive"><SignOutIcon /></span>
                                <span className="settings-label">Sign Out</span>
                            </div>
                        </button>
                    </div>
                </section>

                {/* Footer */}
                <footer className="app-footer">
                    <p className="app-version">Bus App v1.1.0</p>
                </footer>
            </div>


            {/* Edit Modal */}
            {isEditing && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>General Settings</h3>
                        <form onSubmit={handleSubmit}>
                            {!showPasswordFields && (
                                <>
                                    <div className="form-group">
                                        <label>Name</label>
                                        {nameError.hasError && (
                                            <div className="name-error-box">
                                                <p className="error-message">⚠️ The name already exists</p>
                                                <p className="suggestion-text">
                                                    Try: <span
                                                        className="suggested-name"
                                                        onClick={() => {
                                                            setEditForm(prev => ({ ...prev, username: nameError.suggestedName }));
                                                            setNameError({ hasError: false, suggestedName: '' });
                                                        }}
                                                    >
                                                        {nameError.suggestedName}
                                                    </span>
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="text"
                                            name="username"
                                            value={editForm.username}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Bus ID</label>
                                        <input
                                            type="text"
                                            name="bus_id"
                                            value={editForm.bus_id}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="change-password-btn"
                                        onClick={() => setShowPasswordFields(true)}
                                    >
                                        <span style={{ marginRight: '8px', color: '#10B981', display: 'flex' }}><KeyIcon /></span> Change Password
                                    </button>
                                </>
                            )}

                            {showPasswordFields && (
                                <div className="password-fields">
                                    <div className="form-group">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={editForm.currentPassword}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>New Password</label>
                                        {passwordError && (
                                            <div className="password-error-box">
                                                <p className="error-message">⚠️ Password must be at least 4 characters</p>
                                            </div>
                                        )}
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={editForm.newPassword}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={editForm.confirmPassword}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="modal-actions">
                                <button type="button" onClick={handleCloseModal} className="cancel-btn">Cancel</button>
                                <button type="submit" className="save-btn">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Toast
                message={toast.message}
                type={toast.type}
                show={toast.show}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
            />
        </div>
    );
};

export default Profile;