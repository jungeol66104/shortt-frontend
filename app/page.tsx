"use client"

import React, {useEffect, useState} from 'react';
import {ref, get, runTransaction} from 'firebase/database';
import { db } from '@/lib/firebase';
import ShareButton from "@/components/shareButton";

export default function Page() {
    const [vote, setVote] = useState('before'); // 0: before vote, 1: option A, 2: option B
    const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
    const [question, setQuestion] = useState<question | null>(null);
    const [isEnd, setIsEnd] = useState(false);

    const option1Votes = Number(question?.options.option1.votes)
    const option2Votes = Number(question?.options.option2.votes)
    const totalVotes = option1Votes + option2Votes;
    const option1Proportion = parseFloat(((option1Votes / totalVotes || 0) * 100).toFixed(2))
    const option2Proportion = parseFloat(((option2Votes / totalVotes || 0) * 100).toFixed(2))

    const updateVotes = async (optionId: string) => {
        try {
            const votesRef = ref(db, `questions/${currentQuestionId}/options/${optionId}/votes`);
            await runTransaction(votesRef, (currentVotes) => {
                return (currentVotes || 0) + 1;
            });
        } catch (error) {console.error('Error updating votes:', error);}
    }

    // const updateSkips = async () => {
    //     try {
    //         const skipsRef = ref(db, `questions/${currentQuestionId}/skips`);
    //         await runTransaction(skipsRef, (currentSkips) => {
    //             return (currentSkips || 0) + 1;
    //         });
    //     } catch (error) {console.error('Error updating skips:', error);}
    // }

    const updateViews = async (questionId: string) => {
        try {
            const viewsRef = ref(db, `questions/${questionId}/views`);
            await runTransaction(viewsRef, (currentViews) => {
                return (currentViews || 0) + 1;
            });
        } catch (error) {console.error('Error updating views:', error);}
    }

    const fetchQuestion = async (questionId: string) => {
        try {
            const questionRef = ref(db, `questions/${questionId}`);
            const snapshot = await get(questionRef);
            if (snapshot.exists()) {
                if (currentQuestionId !== questionId) await updateViews(questionId)
                return snapshot.val()
            }
            else setIsEnd(true)
        } catch (error) {console.error('Error fetching question:', error)}
    };

    useEffect(() => {
        fetchQuestion('question1').then((question: question) => {
            setQuestion(question)
            setCurrentQuestionId('question1')
        })
    }, []);

    const handleVote = async (optionId: string) => {
        if (vote !== 'before') return

        await updateVotes(optionId);

        if (currentQuestionId) {
            const updatedQuestion = await fetchQuestion(currentQuestionId);
            setQuestion(updatedQuestion);
            setVote(optionId);
        }
    };

    // const handleNext = async () => {
    //     if (vote === 'before') await updateSkips()
    //
    //     const newQuestionId = currentQuestionId?.replace(/(\d+)$/, (match) => String(parseInt(match) + 1))
    //
    //     if (newQuestionId) {
    //         const newQuestion = await fetchQuestion(newQuestionId);
    //         setQuestion(newQuestion);
    //         setCurrentQuestionId(newQuestionId)
    //         setVote('before')
    //     }
    // };

    return (
        <div className={'w-full h-full bg-neutral-800'}>
            <div className={'z-10 fixed top-[50px] left-1/2 transform -translate-x-1/2 w-full max-w-[640px] flex'}>
                <div className={'absolute w-full flex'}>
                    <div className={'w-5 h-5 bg-black'}>
                        <div className={'w-full h-full bg-neutral-800 border-t-[0.1px] border-l-[0.1px] border-neutral-600 rounded-tl-xl'}></div>
                    </div>
                    <div className={'w-[calc(100%-40px)] border-t-[0.1px] border-neutral-600'}></div>
                    <div className={'w-5 h-5 bg-black'}>
                        <div className={'w-full h-full bg-neutral-800 border-t-[0.1px] border-r-[0.1px] border-neutral-600 rounded-tr-xl'}></div>
                    </div>
                </div>
            </div>
            <div className={'relative pt-8 pb-5 px-5 w-full min-h-full h-fit bg-neutral-800 border-x-[0.1px] border-b-0 border-neutral-600 rounded-xl rounded-b-none'}>
                {isEnd && <div className={'w-full h-full flex items-center justify-center'}>축하해요! 준비한 게임은 여기까지입니다.</div>}
                {!isEnd && question &&
                    <div className={'shrink-0 h-full flex flex-col items-center justify-between gap-14'}>
                        <div className={'w-full flex flex-col items-center gap-5'}>
                            <div className={'flex flex-col items-center gap-2'}>
                                <div className={'px-3 py-1 font-semibold text-green-600 rounded-full border-[0.11px] border-green-600'}>스포츠</div>
                                <div className={'font-semibold text-xs text-red-600'}>오늘의 숏</div>
                            </div>
                            <h1 className={'max-w-[540px] text-2xl font-semibold leading-9'}>{question?.title}</h1>
                        </div>
                        <div className={'description'}></div>
                        <div className={'w-full flex flex-col items-center gap-10'}>
                            <div className={'w-full max-w-[540px] flex flex-col gap-3'}>
                                <div onClick={() => handleVote('option1')} className={`${vote === 'option1' ? 'bg-neutral-600 font-semibold' : 'bg-neutral-900'} ${vote === 'before' && 'cursor-pointer hover:bg-neutral-600'} p-5 flex items-center justify-between border-[0.1px] border-neutral-600 rounded-xl text-lg`}>
                                    <span>{question?.options.option1.content}</span>
                                    {vote !== 'before' && <span>{option1Proportion}%</span>}
                                </div>
                                <div onClick={() => handleVote('option2')} className={`${vote === 'option2' ? 'bg-neutral-600 font-semibold' : 'bg-neutral-900'} ${vote === 'before' && 'cursor-pointer hover:bg-neutral-600'} p-5 flex items-center justify-between border-[0.1px] border-neutral-600 rounded-xl text-lg`}>
                                    <span>{question?.options.option2.content}</span>
                                    {vote !== 'before' && <span>{option2Proportion}%</span>}
                                </div>
                            </div>
                            <div>투표하고 결과를 확인해보세요!</div>
                            <ShareButton />
                        </div>
                        <div></div>
                    </div>
                }
                {/*<div className={'sticky bottom-0 left-0 w-full h-[50px] flex items-center justify-between gap-3'}>*/}
                {/*    <div></div>*/}
                {/*    <div className={'flex items-center justify-center gap-3'}>*/}
                {/*        <ShareButton />*/}
                {/*        <button onClick={handleNext} className={'px-4 pt-[1px] h-10 bg-white hover:bg-neutral-200 rounded-full text-black font-medium'}>넘어가기</button>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </div>
    );
}

interface question {
    "title": string
    "options": {
        "option1": {
            "content": string
            "votes": number
        }
        "option2": {
            "content": string
            "votes": number
        }
    }
    "link": {
        "title": string
        "url": string
        "tag": string
    }
    "shares": number
    "skips": number
    "views": number
    "date": string
}