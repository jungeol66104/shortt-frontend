export interface Question {
    "id": string
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