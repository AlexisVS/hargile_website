import React, {useEffect, useRef, useState} from 'react'
import {useTranslations} from "next-intl";

interface ReadMoreProps {
    id: string
    text: string
    amountOfWords?: number
    classNames?: string
    style?: React.CSSProperties
}

export const ReadMore = ({id, text, amountOfWords = 36, classNames, style}: ReadMoreProps) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [shortHeight, setShortHeight] = useState<number | null>(null)
    const [fullHeight, setFullHeight] = useState<number | null>(null)
    const shortTextRef = useRef<HTMLDivElement>(null)
    const fullTextRef = useRef<HTMLDivElement>(null)
    const t = useTranslations('components.read-more')

    const splittedText = text.replace('/\n/gi', '').split(' ').map((e: string) => e + ' ')
    const itCanOverflow = splittedText.length > amountOfWords
    const beginText = itCanOverflow
        ? splittedText.slice(0, amountOfWords - 1).join(' ')
        : text
    const endText = splittedText.slice(amountOfWords - 1).join(' ')

    useEffect(() => {
        // Measure both heights on first render
        if (fullTextRef.current && fullHeight === null) {
            setFullHeight(fullTextRef.current.clientHeight)
        }
        if (shortTextRef.current && shortHeight === null) {
            setShortHeight(shortTextRef.current.clientHeight)
        }
    }, [fullHeight, shortHeight])

    const handleKeyboard = (e: KeyboardEvent | any) => {
        if (e.code === 'Space' || e.code === 'Enter') {
            setIsExpanded(!isExpanded)
        }
    }

    // If heights are not yet measured, render both versions to measure them but make them invisible
    if (fullHeight === null || shortHeight === null) {
        return (
            <>
                <div ref={fullTextRef} style={{visibility: 'hidden', position: 'absolute', ...style}}>
                    <p className={classNames} style={{fontWeight: 200}}>
                        {text.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line === '' && <br/>}
                                <span className={classNames}>{line}</span>
                            </React.Fragment>
                        ))}
                    </p>
                </div>
                <div ref={shortTextRef} style={{visibility: 'hidden', position: 'absolute'}}>
                    <p className={classNames} style={{fontWeight: 200}}>
                        {beginText.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line === '' && <br/>}
                                <span className={classNames}>{line}</span>
                            </React.Fragment>
                        ))}
                        <span>... </span>
                        <span
                            style={{paddingLeft: '1rem'}}
                            className='text-sky-400 cursor-pointer'
                        >
                            show more
                        </span>
                    </p>
                </div>
            </>
        )
    }

    return (
        <p
            id={id}
            className={classNames}
            style={{
                fontWeight: 200,
                height: fullHeight + 'px',
                transition: 'height 1s ease',
                overflow: 'hidden',
                textAlign: 'justify',
                ...style
            }}
        >
            {beginText.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                    {line === '' && <br/>}
                    <span className={classNames}>{line}</span>
                </React.Fragment>
            ))}
            {itCanOverflow && (
                <>
                    {!isExpanded && <span>... </span>}
                    <span style={{textAlign: 'justify'}} className={`${!isExpanded && 'hidden'}`}
                          aria-hidden={!isExpanded}>{endText}</span>

                    <span
                        style={{
                            paddingLeft: '1rem',
                            mixBlendMode: "plus-lighter",
                            fontWeight: 300,
                            textAlign: 'justify'
                        }}
                        className='text-sky-400 cursor-pointer'
                        role="button"
                        tabIndex={0}
                        aria-expanded={isExpanded}
                        aria-controls={id}
                        onKeyDown={handleKeyboard}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? t('less') : t('more')}
                    </span>
                </>
            )}
        </p>
    )
}
