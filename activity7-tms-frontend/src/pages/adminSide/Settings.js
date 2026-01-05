import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FeedbackAlert from '../../components/settings/FeedbackAlert';
import PasswordSection from '../../components/settings/PasswordSection';
import ProfileSection from '../../components/settings/ProfileSection';
import { getAccountProfile, updateAccountProfile } from '../../services/api/accountApi';

const initialFormState = {
  userId: '',
  role: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const Settings = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [initialProfile, setInitialProfile] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      const profile = await getAccountProfile();
      const mappedProfile = {
        userId: profile?.userId?.toString() ?? '',
        role: profile?.role ?? '',
        firstName: profile?.firstName ?? '',
        lastName: profile?.lastName ?? '',
        email: profile?.email ?? '',
        password: '',
        confirmPassword: '',
      };

      setFormData(mappedProfile);
      setInitialProfile(mappedProfile);
    } catch (error) {
      setFeedback({ type: 'error', message: error.message || 'Failed to load account information.' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFeedback({ type: '', message: '' });
  }, []);

  const dirtyFields = useMemo(() => {
    const entries = Object.entries(formData).filter(([key, value]) => {
      if (key === 'password' || key === 'confirmPassword') {
        return value.trim() !== '';
      }
      return value !== initialProfile[key];
    });

    return Object.fromEntries(entries);
  }, [formData, initialProfile]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!dirtyFields || Object.keys(dirtyFields).length === 0) {
        setFeedback({ type: 'info', message: 'No changes to save.' });
        return;
      }

      if (dirtyFields.password && dirtyFields.password !== formData.confirmPassword) {
        setFeedback({ type: 'error', message: 'Password fields do not match.' });
        return;
      }

      setIsSaving(true);
      setFeedback({ type: '', message: '' });

      const payload = { ...dirtyFields };
      delete payload.confirmPassword;

      try {
        const updatedProfile = await updateAccountProfile(payload);
        const mappedProfile = {
          userId: updatedProfile?.userId?.toString() ?? formData.userId,
          role: updatedProfile?.role ?? formData.role,
          firstName: updatedProfile?.firstName ?? formData.firstName,
          lastName: updatedProfile?.lastName ?? formData.lastName,
          email: updatedProfile?.email ?? formData.email,
          password: '',
          confirmPassword: '',
        };

        setFormData(mappedProfile);
        setInitialProfile(mappedProfile);
        setFeedback({ type: 'success', message: 'Account settings updated successfully.' });
      } catch (error) {
        setFeedback({ type: 'error', message: error.message || 'Unable to update settings.' });
      } finally {
        setIsSaving(false);
      }
    },
    [dirtyFields, formData.confirmPassword, formData.email, formData.firstName, formData.lastName],
  );

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Account Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">Manage your personal details and credentials.</p>
      </div>

      <FeedbackAlert feedback={feedback} />

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="max-h-[70vh]">
          <div className="settings-scroll-area flex h-full flex-col space-y-6 overflow-y-auto overflow-x-hidden pr-1">
            <ProfileSection formData={formData} onChange={handleChange} isLoading={isLoading} />
            <PasswordSection formData={formData} onChange={handleChange} />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={loadProfile}
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                disabled={isLoading || isSaving}
              >
                Reset
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:bg-indigo-300 dark:hover:bg-indigo-500"
                disabled={isLoading || isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Settings;
