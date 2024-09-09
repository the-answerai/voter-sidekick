const getUserIntentGoal = async (chatHistory: any[], latestMessage: string) => {
  try {
    const response = await fetch('https://public.flowise.theanswer.ai/api/v1/prediction/046d001b-7d42-4a83-bc0b-c1298ecc6604', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: "Briefly describe the user's intent and goal for this conversation so that we can provide the best possible response.",
        overrideConfig: {
            promptValues: {
                latestMessage: latestMessage,
                chatHistory: chatHistory
            }
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch intent and goals');
    }
    debugger

    const data = await response.json();

    return data?.text || '';
  } catch (error) {
    console.error('Error fetching intent and goals:', error);
    return [];
  }
};

export default getUserIntentGoal;
