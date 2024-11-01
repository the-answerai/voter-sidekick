export function handleFollowUpQuestionLoading(
    questions: string[],
) {
    // console.log({ questions });
    try {
        const chatbotElement = document.querySelector("aai-fullchatbot");
        if (!chatbotElement) {
            throw new Error("<aai-fullchatbot> element not found");
        }

        const shadowRoot = (chatbotElement as any).shadowRoot;
        if (!shadowRoot) {
            throw new Error("Shadow DOM not found for the chatbot element");
        }

        const chatbotChatViewEl = shadowRoot.querySelector(
            ".chatbot-chat-view",
        ) as HTMLElement;
        if (!chatbotChatViewEl) {
            throw new Error(
                "chatbotChatViewEl element not found in the chatbot shadow DOM",
            );
        }

        // Get the last <div> in chatbotChatViewEl
        const divElements = chatbotChatViewEl.querySelectorAll("div");

        if (!divElements) {
            throw new Error(
                "divElements not found in the chatbotChatViewEl shadow DOM",
            );
        }

        const lastDiv = divElements[divElements.length - 1];

        if (!lastDiv) {
            throw new Error(
                "lastDiv not found in the divElements shadow DOM",
            );
        }

        // Clear the contents of lastDiv
        // lastDiv.innerHTML = "";
        // lastDiv.style.border = "10px red solid";

        // questions?.forEach((question) => {
        //     const div = document.createElement("div");
        //     div.innerHTML =
        //         `<div data-modal-target="defaultModal" data-modal-toggle="defaultModal" class="flex justify-start mb-2 items-start animate-fade-in host-container hover:brightness-90 active:brightness-75">
        //             <span class="px-2 py-1 ml-1 whitespace-pre-wrap max-w-full chatbot-host-bubble" data-testid="host-bubble" style="width: max-content; max-width: 160px; font-size: 13px; border-radius: 15px; cursor: pointer; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
        //                 ${question}
        //             </span>
        //         </div>`;
        //     lastDiv.appendChild(div);
        // });

        // Get all child divs of the last div
        // const childDivs = Array.from(lastDiv.children).filter((child) =>
        //     child.tagName.toLowerCase() === "div"
        // );

        // if (!childDivs.length) {
        //     throw new Error(
        //         "No immediate child divs found in the lastDiv shadow DOM",
        //     );
        // }

        // // Add a border to each child div
        // childDivs?.forEach((child) => {
        //     child.style.border = "10px red solid";
        //     // child.classList.add('bordered');
        // });
    } catch (error) {
        console.log("Error handling follow-up question:", error);
        throw new Error("Failed to process follow-up questions");
    }
}
