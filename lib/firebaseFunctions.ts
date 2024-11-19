import { ref, set, get, child, update, query, orderByChild, limitToFirst, startAt } from "firebase/database";
import { db } from "./firebase";
import {Question} from "@/types/global";

export const fetchPaginatedQuestions = async (pageNumber: number, pageSize: number) => {
    const page = pageNumber;
    const size = pageSize;

    if (isNaN(page) || isNaN(size) || page <= 0 || size <= 0) throw new Error("Invalid pageNumber or pageSize");

    const questionsRef = ref(db, 'questions');
    const startAfterIndex = (page - 1) * size;

    let questionsQuery;
    if (startAfterIndex > 0) questionsQuery = query(questionsRef, orderByChild('date'), startAt(startAfterIndex), limitToFirst(size));
    else questionsQuery = query(questionsRef, orderByChild('date'), limitToFirst(size));

    try {
        const questionsSnapshot = await get(questionsQuery);
        if (!questionsSnapshot.exists()) return [];

        const questions: Question[] = [];
        questionsSnapshot.forEach(questionSnapshot => {
            const questionData = questionSnapshot.val();
            questions.push({id: questionSnapshot.key, ...questionData});
        });

        return questions.reverse();
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
};