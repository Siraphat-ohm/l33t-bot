import problems from "../data/problems.json";

const getTopics = () => {
    const topics = problems.questions.map((problem) => problem.topicTags.map((tag) => tag.name ));
    const topicList = topics.flat();
    const uniqueTopics = topicList.filter((topic, index) => topicList.indexOf(topic) === index);
    return uniqueTopics;
    
}

export default getTopics;
