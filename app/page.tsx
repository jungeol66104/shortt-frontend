'use client'

import React, {useEffect} from 'react';
import {Question} from "@/types/global";
import {fetchPaginatedQuestions} from "@/lib/firebaseFunctions";
import ShareButton from "@/components/shareButton";

const HomePage = () => {
    const [questions, setQuestions] = React.useState<Question[] | null>([]);
    const [pageNumber, setPageNumber] = React.useState(1);

    useEffect(() => {
        fetchPaginatedQuestions(pageNumber, 10).then(fetchedQuestions => {
            setQuestions(fetchedQuestions)
            setPageNumber(1) // dummy for ts error
        })
    }, [pageNumber]);

    return (
        <div className={`hideScroll overflow-y-scroll snap-y snap-mandatory w-full h-full flex flex-col items-center gap-10`}>
            {!questions && <div></div>}
            {questions && questions.map((question) => {
                return (
                    <div key={question.id} className={`snap-start snap-always py-8 px-5 w-full max-w-[640px] h-fit flex flex-col items-center gap-10 bg-neutral-800 border-[0.1px] border-b-0 border-neutral-600 rounded-xl`}>
                        <div className={'w-full flex flex-col items-center gap-5'}>
                            <div className={'flex flex-col items-center gap-2'}>
                                <div className={'px-3 py-1 font-semibold text-green-600 rounded-full border-[0.11px] border-green-600'}>스포츠</div>
                                <div className={'font-semibold text-xs text-red-500'}>오늘의 숏</div>
                            </div>
                            <h1 className={'max-w-[540px] text-2xl font-semibold leading-9'}>{question?.title}</h1>
                        </div>
                        <div className={'cursor-pointer p-5 h-max flex gap-3 hover:bg-neutral-700 border-[0.1px] border-neutral-500 rounded-xl'}>
                            <div className={'w-[2px] bg-neutral-500 rounded-full'}></div>
                            <div className={'flex items-center gap-3'}>{question?.link.title}</div>
                        </div>
                        <div className={'w-full flex flex-col items-center gap-10'}>
                            <div className={'w-full max-w-[540px] flex flex-col gap-3'}>
                                <div className={`bg-neutral-900 cursor-pointer hover:bg-neutral-600 relative px-5 py-7 flex flex-col border-[0.1px] border-neutral-600 rounded-xl text-lg`}>
                                    <span>{question?.options.option1.content}</span>
                                </div>
                                <div className={`bg-neutral-900 cursor-pointer hover:bg-neutral-600 relative px-7 py-7 flex flex-col border-[0.1px] border-neutral-600 rounded-xl text-lg`}>
                                    <span>{question?.options.option2.content}</span>
                                </div>
                            </div>
                            <div className={'flex flex-col items-center gap-3'}>
                                <div className={'material-symbols-outlined text-[20px]'}>&#xe175;</div>
                                <span>투표하고 결과를 확인해보세요!</span>
                            </div>
                            <ShareButton/>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default HomePage;

