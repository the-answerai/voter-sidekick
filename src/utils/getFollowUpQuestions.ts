const getFollowUpQuestions = async (chatHistory: any[], latestMessage: string) => {
  try {
    const response = await fetch('https://public.flowise.theanswer.ai/api/v1/prediction/b072dc55-dbb3-4859-b5df-a1b81ab9c41d', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: "Generate 3 follow-up questions based on the chat history and latest message",
        overrideConfig: {
            promptValues: {
                latestMessage: latestMessage,
                chatHistory: chatHistory
            }
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch follow-up questions');
    }

    const data = await response.json();

    // Extract follow-up questions from the response data
    const followUpQuestions = [
      data.json.question1,
      data.json.question2,
      data.json.question3
    ].filter(question => question); // Filter out any undefined or empty questions
    // If we don't have exactly 3 questions, log a warning
    if (followUpQuestions.length !== 3) {
      console.warn(`Expected 3 follow-up questions, but received ${followUpQuestions.length}`);
    }
    return followUpQuestions || [];
  } catch (error) {
    console.error('Error fetching follow-up questions:', error);
    return [];
  }
};

export default getFollowUpQuestions;
