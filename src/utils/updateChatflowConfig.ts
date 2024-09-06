import { ChatFullPageProps } from "@/types";

export const updateChatflowConfig = (
  prevConfig: ChatFullPageProps,
  updatedFilter: Record<string, string>
): ChatFullPageProps => {
  const updatedConfig: ChatFullPageProps = { ...prevConfig };
  if (Object.keys(updatedFilter).length > 0) {
    updatedConfig.pineconeMetadataFilter = updatedFilter;
  } else {
    delete updatedConfig.pineconeMetadataFilter;
  }
  return updatedConfig;
};
