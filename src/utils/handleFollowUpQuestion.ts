export function handleFollowUpQuestion(question: string, chatProps: any) {
  try {
    const chatbotElement = document.querySelector("aai-fullchatbot");
    if (!chatbotElement) {
      throw new Error("<aai-fullchatbot> element not found");
    }

    if (typeof (chatbotElement as any).sendMessage === "function") {
      (chatbotElement as any).sendMessage(question);
      focusInput(chatbotElement);
    } else {
      const shadowRoot = (chatbotElement as any).shadowRoot;
      if (!shadowRoot) {
        throw new Error("Shadow DOM not found for the chatbot element");
      }

      let inputElement = shadowRoot.querySelector(
        'input[type="text"]',
      ) as HTMLInputElement || shadowRoot.querySelector(
        "textarea",
      ) as HTMLTextAreaElement;

      if (!inputElement) {
        throw new Error("Input element not found in the chatbot shadow DOM");
      }

      inputElement.value = question;
      inputElement.dispatchEvent(
        new Event("input", { bubbles: true, composed: true }),
      );

      inputElement.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          key: "Enter",
          composed: true,
        }),
      );

      // const sendButton = shadowRoot.querySelector(
      //   'button[type="submit"]',
      // ) as HTMLButtonElement;
      // if (sendButton) {
      //   sendButton.click();
      // } else {
      //   const form = shadowRoot.querySelector("form");
      //   if (form) {
      //     form.dispatchEvent(
      //       new Event("submit", { bubbles: true, composed: true }),
      //     );
      //   } else {
      //     throw new Error(
      //       "No send button or form found in the chatbot shadow DOM",
      //     );
      //   }
      // }

      // setTimeout(() => focusInputAndMoveCursor(inputElement), 0);
    }

    if (chatProps?.chatflowConfig?.handleUserMessage) {
      chatProps.chatflowConfig.handleUserMessage(question);
    }
  } catch (error) {
    console.error("Error handling follow-up question:", error);
    throw new Error("Failed to process follow-up question");
  }
}

function focusInput(chatbotElement: Element) {
  setTimeout(() => {
    const shadowRoot = (chatbotElement as any).shadowRoot;
    if (shadowRoot) {
      const inputElement = shadowRoot.querySelector(
        'input[type="text"]',
      ) as HTMLInputElement;
      if (inputElement) {
        focusInputAndMoveCursor(inputElement);
      }
    }
  }, 0);
}

function focusInputAndMoveCursor(inputElement: HTMLInputElement) {
  inputElement.focus();
  const length = inputElement.value.length;
  inputElement.setSelectionRange(length, length);
}
