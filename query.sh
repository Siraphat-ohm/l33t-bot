# /bin/bash

# Read environment variables
source .env

curl --location 'https://leetcode.com/graphql/' \
--header 'Content-Type: application/json' \
--header 'Cookie: LEETCODE_SESSION=${LEETCODE_SESSION}; csrftoken=${csrftoken}' \
--data '{"query":"query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {\n  problemsetQuestionList: questionList(\n    categorySlug: $categorySlug\n    limit: $limit\n    skip: $skip\n    filters: $filters\n  ) {\n    total: totalNum\n    questions: data {\n      acRate\n      difficulty\n      freqBar\n      frontendQuestionId: questionFrontendId\n      isFavor\n      paidOnly: isPaidOnly\n      status\n      title\n      titleSlug\n      topicTags {\n        name\n        id\n        slug\n      }\n      hasSolution\n      hasVideoSolution\n    }\n  }\n}","variables":{"categorySlug":"","skip":0,"limit":50,"filters":{}}}'
