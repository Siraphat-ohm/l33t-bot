import Logger from "./logger";
import problems from "../data/problems.json";
import { ColorResolvable } from "discord.js";

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Mixed';

interface Question {
    title: string;
    difficulty: string;
    topicTags: { name: string, slug: string }[];
    paidOnly: boolean;
    acceptanceRate: number;
    color: ColorResolvable;
}

const colors = {
    'Easy': '#00FF00',
    'Medium': '#FFFF00',
    'Hard': '#FF0000'
}

const randomQuestion = ( difficulty : Difficulty = "Mixed" , topic = "" , paidOnly = false, n = 1 ): Question[] =>  {
        const filteredProblems = problems.questions.filter( question => {
            return (  difficulty === "Mixed" ? true : question.difficulty === difficulty ) 
                    && ( topic === "" ? true : question.topicTags.some( tag =>  tag.slug === topic))
                    && ( paidOnly === question.paidOnly )
            ;
        } );
        const questions = [];
        for (let i = 0; i < n; i++) {
            const randomIndex = Math.floor(Math.random() * filteredProblems.length);
            const question = filteredProblems[randomIndex];
            questions.push( {
                title: question.title,
                difficulty: question.difficulty,
                topicTags: question.topicTags,
                paidOnly: question.paidOnly,
                acceptanceRate: question.acRate,
                color: colors[question.difficulty as keyof typeof colors] as ColorResolvable
            } );
        }

        return questions;
}

export default randomQuestion;
