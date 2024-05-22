import problems from "../data/problems.json";

interface Question {
    title: string;
    difficulty: string;
    topicTags: { name: string, slug: string }[];
    paidOnly: boolean;
    acRate: number;
}


const randomQuestions = ( 
                    {
                        difficulty = "Mixed" , 
                        topic = "",
                        paidOnly = false, 
                        n = 1 
                    } : {
                        difficulty?: string,
                        topic?: string,
                        paidOnly?: boolean,
                        n?: number
                    }
    ): Question[] =>  {
        const filteredProblems = problems.questions.filter( question => {
            return (  difficulty === "Mixed" ? true : question.difficulty === difficulty ) 
                    && ( topic === "" ? true : question.topicTags.some( tag =>  tag.name.toLowerCase() === topic.toLowerCase()))
                    && ( paidOnly === question.paidOnly )
            ;
        } );
        const questions = [];
        for (let i = 0; i < n; i++) {
            const randomIndex = Math.floor(Math.random() * filteredProblems.length);
            questions.push(  filteredProblems[randomIndex] );
        }

        return questions;
}

export default randomQuestions;
