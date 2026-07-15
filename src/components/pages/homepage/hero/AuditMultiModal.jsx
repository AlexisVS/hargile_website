'use client'

import {Fragment, useState} from 'react'
import {Dialog, DialogPanel, DialogTitle} from '@headlessui/react'
import {useTranslations} from "next-intl";

export default function AuditMultiModal({onClose}) {
    const t = useTranslations('components.audit-modal');
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        url: '',
        isForOwnCompany: '',
        industry: '',
    })
    const [loading, setLoading] = useState(false)
    const [auditError, setAuditError] = useState(null);

    const {firstName, lastName, email, isForOwnCompany, industry} = formData
    const isFormComplete = !!(firstName && lastName && email && isForOwnCompany && industry)

    const handleChange = (e) => {
        const {name, value} = e.target

        setFormData((prev) => ({...prev, [name]: value}))
    }

    const handleStartAudit = async () => {
        setLoading(true);
        setStep(2);

        const parsedUrl = (url) => url.startsWith('http://') || url.startsWith('https://')
            ? new URL(url).href
            : new URL(`https://${url}`).href;


        try {
            const res = await fetch('/api/audit', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({url: parsedUrl(formData.url)}),
            });

            if (!res.ok || res.error) {
                const errorMessage = res.error?.message || 'Unknown error during audit.';
                const errorCode = res.error?.code || res.status;
                const errorPayload = {error: {message: errorMessage, code: errorCode}};
                localStorage.setItem('auditResult', JSON.stringify(errorPayload));
                setAuditError(errorPayload.error.message);
                setLoading(false);
                return;
            }

            const result = await res.json();
            localStorage.setItem('auditResult', JSON.stringify(result));
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    }

    return (
        <Dialog open={true} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-md" aria-hidden="true"/>

            <div
                className="fixed w-32 h-32 top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/20 opacity-20 blur-3xl transform scale-150"></div>

            <div className="fixed inset-0 flex items-center justify-center !p-4">
                <DialogPanel
                    className="w-full max-w-xl rounded-lg shadow-2xl overflow-hidden border border-sky-500/20 bg-sky-800/20 backdrop-blur-lg">
                    <div className="h-1 w-1/3 !mb-4"></div>

                    <div className="!p-8">
                        <DialogTitle className="text-2xl font-bold text-white !mb-6 flex items-center">
                            {step === 1 ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-sky-400"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                                    </svg>
                                    {t('modal-title')}
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 !mr-2 text-sky-400"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    {t('contact')}
                                </>
                            )}
                        </DialogTitle>

                        {step === 1 && (
                            <div className="space-y-6">
                                <p className="text-gray-300 !mb-6">{t('modal-description')}</p>

                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 flex items-center !pl-4 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-400"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                                        </svg>
                                    </div>
                                    <input
                                        name="url"
                                        value={formData.url}
                                        onChange={handleChange}
                                        placeholder={t('modal-url-placeholder')}
                                        className="w-full !py-4 !pl-12 !pr-4 bg-gray-800/60 text-white placeholder-gray-400 border border-sky-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        aria-label={t('start-audit')}
                                        onClick={handleStartAudit}
                                        disabled={!formData.url}
                                        className={`!px-6 !py-3 rounded-lg flex items-center font-medium transition-all duration-300 !mt-4 ${
                                            formData.url
                                                ? 'bg-gradient-to-r from-sky-600 to-sky-800 text-white shadow-lg hover:shadow-sky-500/25 hover:translate-y-[-2px] cursor-pointer'
                                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {t('start-audit')}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <div
                                    className={`!p-4 rounded-lg !mb-6 flex items-center ${auditError ? 'bg-red-900/30' : loading ? 'bg-sky-900/30' : 'bg-green-900/30'}`}>
                                    {loading ? (
                                        <>
                                            <div className="relative h-6 w-6 !mr-3">
                                                <div
                                                    className="h-6 w-6 rounded-full border-2 border-sky-400 border-t-transparent animate-spin"></div>
                                            </div>
                                            <p className="text-sky-200 !my-2">
                                                {t('analyzing')}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            {auditError ?
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth="1.5" stroke="currentColor"
                                                     className="h-6 w-6 !mr-3 text-red-400">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
                                                </svg> :
                                                <svg className="h-6 w-6 !mr-3 text-green-400" fill="none"
                                                     viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>

                                            }
                                            <p className={`${auditError ? 'text-red-300' : 'text-green-300'} !my-2`}>
                                                {auditError ? t('error') : t('analysis-complete')}
                                            </p>
                                        </>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 !mb-1">
                                            {t('first-name')} <span className="text-sky-400">*</span>
                                        </label>
                                        <input
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="John"
                                            className="w-full !p-3 bg-gray-800/60 text-white border border-sky-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 !mb-1">
                                            {t('last-name')} <span className="text-sky-400">*</span>
                                        </label>
                                        <input
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Doe"
                                            className="w-full !p-3 bg-gray-800/60 text-white border border-sky-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="!mt-5">
                                    <label className="block text-sm font-medium text-gray-300 !mb-1">
                                        Email <span className="text-sky-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 flex items-center !pl-3 pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-400"
                                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                                            </svg>
                                        </div>
                                        <input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            className="w-full !p-3 !pl-10 bg-gray-800/60 text-white border border-sky-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="!mt-5">
                                    <label className="block text-sm font-medium text-gray-300 !mb-1">
                                        {t('company')} <span className="text-sky-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="isForOwnCompany"
                                            value={formData.isForOwnCompany}
                                            onChange={handleChange}
                                            className="w-full !p-3 bg-gray-800/60 text-white border border-sky-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent appearance-none !pr-10"
                                        >
                                            <option value="">{t('select')}</option>
                                            <option value={t('yes')}>{t('yes')}</option>
                                            <option value={t('no')}>{t('no')}</option>
                                        </select>
                                        <div
                                            className="absolute inset-y-0 right-0 flex items-center !pr-3 pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-400"
                                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M19 9l-7 7-7-7"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="!mt-5">
                                    <label className="block text-sm font-medium text-gray-300 !mb-1">
                                        {t('industry')} <span className="text-sky-400">*</span>
                                    </label>
                                    <input
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleChange}
                                        placeholder="e.g. E-commerce, SaaS, Healthcare..."
                                        className="w-full !p-3 bg-gray-800/60 text-white border border-sky-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    {!auditError && (
                                        <button
                                            aria-label={'Show audit result'}
                                            disabled={!isFormComplete || loading}
                                            onClick={() => {
                                                if (!loading && isFormComplete) {
                                                    localStorage.setItem('auditFormData', JSON.stringify(formData));
                                                    window.location.href = '/audit/result';
                                                }
                                            }}
                                            className={`w-full !py-4 !mt-5 rounded-lg flex items-center justify-center font-semibold transition-all duration-300 ${
                                                isFormComplete && !loading
                                                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg hover:shadow-sky-500/25 hover:translate-y-[-2px] cursor-pointer'
                                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            {loading ? (
                                                <>
                                                    <div
                                                        className="h-5 w-5 !mr-2 !my-2 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                                                    {t('processing')}
                                                </>
                                            ) : (
                                                <>
                                                    <div className="cursor-pointer">{t('view-results')}</div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2"
                                                         fill="none"
                                                         viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2} d="M9 5l7 7-7 7"/>
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {auditError && (
                                        <div className="text-center !mt-6">
                                            <button
                                                aria-label={'Go to the previous page'}
                                                onClick={() => {
                                                    setAuditError(null);
                                                    setStep(1);
                                                    setLoading(false);
                                                }}
                                                className="bg-red-600 hover:bg-red-700 text-white font-semibold !px-6 !py-3 rounded-lg transition cursor-pointer"
                                            >
                                                {t('back-url')}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {(!isFormComplete || loading) && (
                                    <div className="text-center text-sm text-yellow-300 font-medium !mt-5">
                                        {loading ? (
                                            t('wait')
                                        ) : (
                                            t('incomplete')
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}
