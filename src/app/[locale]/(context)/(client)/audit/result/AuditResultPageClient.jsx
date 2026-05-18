'use client'

import {useState} from 'react'
import GaugeChart from "@/components/pages/homepage/hero/GaugeChart";
import {useTranslations} from "next-intl";
import {useLocalStorageState} from "@/hooks/useLocalStorageState";

export default function AuditResultPageClient() {
    const [showCalendar, setShowCalendar] = useState(false);
    const [formData] = useLocalStorageState('auditFormData', null);
    const [auditData] = useLocalStorageState('auditResult', null);
    const t = useTranslations('pages.audit-results.sections')

    if (!formData || !auditData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900/70">
                <div className="flex flex-col items-center space-y-4">
                    <div
                        className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white text-xl font-medium">Loading audit results...</p>
                </div>
            </div>
        )
    }

    const performanceScore = Math.round(auditData.auditResults.lighthouseResult?.categories?.performance?.score * 100);
    const seoScore = Math.round(auditData.auditResults.lighthouseResult?.categories?.seo?.score * 100);
    const accessibilityScore = Math.round(auditData.auditResults.lighthouseResult?.categories?.accessibility?.score * 100);
    const bestPracticeScore = Math.round(auditData.auditResults.lighthouseResult?.categories?.["best-practices"]?.score * 100);

    return (
        <div className="min-h-screen bg-gradient-to-b text-white container !mx-auto">
            <div className="max-w-6xl mx-auto !px-4 !py-12 sm:!px-6 lg:!px-8 container">
                {/* Header with glass effect */}
                <div className="flex items-center !mb-6">
                    <div className="!mr-4 h-12 w-12 rounded-full  flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold  text-transparent bg-clip-text">{t('audit-results.title')}</h1>
                </div>
                <div
                    className="backdrop-blur-md bg-gray-900/70 rounded-xl !p-8 !mb-10 border border-gray-800 shadow-xl">


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                        <div className="space-y-3 !mx-auto">
                            <h2 className="text-xl font-semibold text-violet-300 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 !mr-2" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                {t('audit-results.informations')}
                            </h2>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-center">
                                    <span className="w-36 text-gray-400">{t('audit-results.name')}:</span>
                                    <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="w-36 text-gray-400">Email:</span>
                                    <span
                                        className="font-medium">{formData.email != null ? formData.email : 'N/A'}</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="w-36 text-gray-400">{t('audit-results.company')}: </span>
                                    <span className="font-medium">{formData.isForOwnCompany}</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="w-36 text-gray-400">{t('audit-results.industry')} : </span>
                                    <span className="font-medium">{formData.industry}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-3 !mx-auto">
                            <h2 className="text-xl font-semibold text-violet-300 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 !mr-2" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                                </svg>
                                {t('audit-results.website')}
                            </h2>
                            <div className="flex items-center">
                                <span className="w-32 text-gray-400">URL:</span>
                                <a href={formData.url} target="_blank" rel="noopener noreferrer"
                                   className="font-medium text-violet-400 hover:text-violet-300 transition-colors truncate">
                                    {formData.url}
                                </a>
                            </div>
                            {/*TODO : ADD LANDING PAGE PREVIEW OF THE AUDITED URL*/}
                        </div>
                    </div>
                </div>

                {/* Score Cards */}
                <div className="!mb-12">
                    <div className="flex items-center !mb-6">
                        <h2 className="text-3xl font-bold">Audit Scores</h2>
                        <div
                            className="!ml-4 !px-3 !py-1 !mb-3 bg-violet-600/20 rounded-full border border-violet-600 text-violet-400 text-sm font-medium">
                            Lighthouse v7
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {score: performanceScore, label: "Performance", icon: "M13 10V3L4 14h7v7l9-11h-7z"},
                            {score: seoScore, label: "SEO", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"},
                            {
                                score: accessibilityScore,
                                label: "Accessibility",
                                icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            },
                            {
                                score: bestPracticeScore,
                                label: "Best Practices",
                                icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            },
                        ].map((item, index) => (
                            <div key={index}
                                 className="backdrop-blur-md bg-gray-900/60 rounded-xl !p-6 border border-gray-800 shadow-lg transition-transform hover:transform hover:scale-105">
                                <div className="flex justify-between items-center !mb-4">
                                    <div className="flex items-center content-center">
                                        <div
                                            className="!mr-3 h-8 w-8 rounded-md bg-violet-600/20 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400"
                                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d={item.icon}/>
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white !pt-5">{t(`audit-results.${item.label}`)}</h3>
                                    </div>
                                    <div className={`text-sm font-medium !px-3 !py-2 rounded-full border ${
                                        item.score >= 90 ? 'bg-green-500/20 text-green-400' :
                                            item.score >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                    }`}>
                                        {item.score >= 90 ? t('audit-results.good') : item.score >= 50 ? t('audit-results.average') : t('audit-results.poor')}
                                    </div>
                                </div>

                                <div className="flex justify-center !my-4">
                                    <GaugeChart score={item.score} label={t(`audit-results.${item.label}`)}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detailed Analysis */}
                <div className="space-y-8">
                    {[
                        {
                            title: "Performance",
                            score: performanceScore,
                            description: t('audit-results.description-performance'),
                            warning: performanceScore < 90 && "🚀 Your performance score could be improved. Let us help you optimize your loading speed, scripts, and assets.",
                            icon: "M13 10V3L4 14h7v7l9-11h-7z"
                        },
                        {
                            title: "SEO",
                            score: seoScore,
                            description: t('audit-results.description-seo'),
                            warning: seoScore < 90 && `📈 ${t('audit-results.warning-seo')}`,
                            icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        },
                        {
                            title: t('audit-results.Accessibility'),
                            score: accessibilityScore,
                            description: t('audit-results.description-accessibility'),
                            warning: accessibilityScore < 90 && `♿ ${t('audit-results.warning-accessibility')}`,
                            icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        },
                        {
                            title: t('audit-results.Best\ Practices'),
                            score: bestPracticeScore,
                            description: t('audit-results.description-bestpractices'),
                            warning: bestPracticeScore < 90 && `${t('audit-results.warning-bestpractices')}`,
                            icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        }
                    ].map((section, index) => (
                        <div key={index}
                             className="backdrop-blur-md bg-gray-900/60 rounded-xl !p-6 border border-gray-800 shadow-lg !my-5">
                            <div className="flex items-center !mb-4">
                                <div
                                    className="!mr-3 h-10 w-10 rounded-md bg-violet-600/20 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-400"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d={section.icon}/>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold !my-2">{section.title}</h3>
                                <div className={`!ml-auto text-lg font-bold ${
                                    section.score >= 90 ? 'text-green-400' :
                                        section.score >= 50 ? 'text-yellow-400' :
                                            'text-red-400'
                                }`}>
                                    {section.score}%
                                </div>
                            </div>

                            <p className="text-gray-300 !mb-4">{section.description}</p>

                            {section.warning && (
                                <div className="!mb-4 !p-3 rounded-md bg-yellow-900/20 border border-yellow-800">
                                    <p className="text-yellow-400 !my-2">{section.warning}</p>
                                </div>
                            )}

                            <div className="bg-gray-800/50 rounded-md !p-4 text-sm space-y-4">
                                <p className="text-gray-400 font-medium !mb-2">{t('audit-results.score-breakdown')}</p>

                                {section.title === "Performance" && (
                                    <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                                        <li>{t('audit-results.performances-good')}</li>
                                        <li>{t('audit-results.performances-average')}</li>
                                        <li>{t('audit-results.performances-poor')}</li>
                                    </ul>
                                )}

                                {section.title === "SEO" && (
                                    <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                                        <li>{t('audit-results.seo-good')}</li>
                                        <li>{t('audit-results.seo-average')}</li>
                                        <li>{t('audit-results.seo-poor')}</li>
                                    </ul>
                                )}

                                {section.title === "Accessibility" && (
                                    <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                                        <li>{t('audit-results.access-good')}</li>
                                        <li>{t('audit-results.access-average')}</li>
                                        <li>{t('audit-results.access-poor')}</li>
                                    </ul>
                                )}

                                {section.title === "Best Practices" && (
                                    <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                                        <li>{t('audit-results.best-good')}</li>
                                        <li>{t('audit-results.best-average')}</li>
                                        <li>{t('audit-results.best-poor')}</li>
                                    </ul>
                                )}
                            </div>

                            {section.score < 90 &&
                                <div className="!mt-4 !p-3 rounded-md bg-red-900/20 border border-red-800">
                                    <p className="text-red-400 text-sm !my-2">
                                        {t('audit-results.score-like')} {section.score}{t('audit-results.may-look')}
                                        {section.title === "Performance" ? t('audit-results.may-look-performances') :
                                            section.title === "SEO" ? t('audit-results.may-look-seo') :
                                                section.title === "Accessibility" ? t('audit-results.may-look-access') : t('audit-results.may-look-best')}
                                    </p>
                                </div>
                            }
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div
                    className="!mt-12 backdrop-blur-md bg-violet-600/10 rounded-xl !p-8 border border-violet-800/50 shadow-lg">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="!mb-6 md:!mb-0">
                            <h3 className="text-2xl font-bold text-white !mb-2">{t('audit-results.improve')}</h3>
                            <p className="text-violet-300">{t('audit-results.experts')}</p>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                aria-label={t('audit-results.contact')}
                                onClick={() => setShowCalendar(true)}
                                className="bg-white text-violet-900 hover:bg-gray-100 !px-6 !py-3 !mx-2 rounded-md font-medium transition-colors cursor-pointer"
                            >
                                {t('audit-results.contact')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showCalendar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
                     onClick={() => setShowCalendar(false)}
                >
                    <div
                        className="bg-violet-600/10 border border-violet-800/50 rounded-lg shadow-xl max-w-3xl w-full !mx-4 !p-4"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center !mb-4">
                            <h3 id={'audit-result-title'}
                                className="text-xl font-semibold text-violet-900">{t('audit-results.book')}</h3>
                            <button onClick={() => setShowCalendar(false)}
                                    aria-labelledby={'audit-result-title'}
                                    className="text-gray-400 text-lg cursor-pointer">✕
                            </button>
                        </div>
                        {/*TODO Hide/Bloquer les inputs SCORES*/}
                        <iframe
                            src={`https://calendly.com/charles-delalaing/30min?hide_event_type_details=1&hide_gdpr_banner=1&background_color=403749&text_color=ffffff&primary_color=C183EB&name=${encodeURIComponent(`${formData.firstName} ${formData.lastName}`)}&email=${encodeURIComponent(formData.email || '')}&a1=${encodeURIComponent(formData.url)}&a2=${encodeURIComponent(performanceScore)}%25&a3=${encodeURIComponent(accessibilityScore)}%25&a4=${encodeURIComponent(seoScore)}%25&a5=${encodeURIComponent(bestPracticeScore)}%25&autofill=true`}
                            width="100%"
                            height="475"
                        ></iframe>

                        {/*<iframe*/}
                        {/*    src={`https://calendly.com/worldwidenine/digital-audit-meeting?hide_event_type_details=1&hide_gdpr_banner=1&background_color=403749&text_color=ffffff&primary_color=C183EB&name=${encodeURIComponent(`${formData.firstName} ${formData.lastName}`)}&email=${encodeURIComponent(formData.email || '')}&a1=${encodeURIComponent(formData.url)}&a2=${encodeURIComponent(performanceScore)}%25&a3=${encodeURIComponent(accessibilityScore)}%25&a4=${encodeURIComponent(seoScore)}%25&a5=${encodeURIComponent(bestPracticeScore)}%25`}*/}
                        {/*    width="100%"*/}
                        {/*    height="475"*/}
                        {/*></iframe>*/}
                    </div>
                </div>
            )}
        </div>
    )
}
