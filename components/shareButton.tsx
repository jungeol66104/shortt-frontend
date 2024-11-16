import React, {RefObject, useEffect, useRef, useState} from 'react';

const ShareButton = () => {
    const shareButtonRef : RefObject<HTMLButtonElement> = useRef(null)
    const [showPopup, setShowPopup] = useState(false);

    const getIsTouchable = () => {
        let isTouchable = false
        if (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement) isTouchable = true
        return isTouchable
    }

    useEffect(() => {
        const shareButton = shareButtonRef.current
        if (!shareButton) return

        const handleClickShareButton = async () => {
            const url = location.href;
            const title = document.title;
            const text = document.title;

            if ('share' in navigator && getIsTouchable()) {
                try {await navigator.share({url , text, title})}
                catch (error) {console.error('Error fetching for web share api: ', error)}
            } else {
                navigator.clipboard.writeText(url);
                setShowPopup(true); // Show the popup
                setTimeout(() => {setShowPopup(false)}, 2000);
            }
            return
        }

        shareButton.addEventListener('click', handleClickShareButton)
        shareButton.addEventListener('touchend', handleClickShareButton)
        return () => {
            shareButton.removeEventListener('click', handleClickShareButton)
            shareButton.removeEventListener('touchend', handleClickShareButton)
        }
    });

    return (
        <>
            <button ref={shareButtonRef} className={'px-4 pt-0.5 h-10 bg-sky-500 hover:bg-sky-700 rounded-full font-medium'}>공유하기</button>
            <div className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 px-4 py-2 w-[169px] bg-sky-500 text-white text-sm rounded-md shadow-lg transition-opacity duration-500 ${showPopup ? "opacity-100" : "opacity-0 pointer-events-none"}`}>링크가 복사되었습니다!</div>
        </>
    );
};

export default ShareButton;
