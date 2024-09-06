import React, { useState, useMemo } from "react";
import { SourceDocument } from "../types";
import LinkIcon from "./Icons/LinkIcon";
import ExpandIcon from "./Icons/ExpandIcon";
import { formatDate } from "../utils/formatDate";

interface SourceDocumentsSidebarProps {
  documents: SourceDocument[];
}

const SourceDocumentCard: React.FC<{ documents: SourceDocument[] }> = ({
  documents,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [expandedPages, setExpandedPages] = useState<number[]>([]);

  const mainDocument = documents[0];
  const creationDate = formatDate(
    mainDocument.metadata["pdf.info.CreationDate"]
  );
  const modificationDate = formatDate(
    mainDocument.metadata["pdf.info.ModDate"]
  );

  const toggleExpand = (pageNumber: number) => {
    setExpandedPages((prev) =>
      prev.includes(pageNumber)
        ? prev.filter((p) => p !== pageNumber)
        : [...prev, pageNumber]
    );
  };

  const sortedDocuments = useMemo(() => {
    return [...documents].sort(
      (a, b) => a.metadata["loc.pageNumber"] - b.metadata["loc.pageNumber"]
    );
  }, [documents]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        {mainDocument.metadata["pdf.info.Title"]}
        <a
          href={mainDocument.metadata.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700"
        >
          <LinkIcon />
        </a>
      </h3>
      <button
        className="text-blue-500 hover:text-blue-700"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Hide Details" : "Show Details"}
      </button>
      {showDetails && (
        <div className="mt-2 bg-gray-100 dark:bg-gray-700 p-2 rounded">
          <p className="text-sm mb-1">
            Author: {mainDocument.metadata["pdf.info.Author"]}
          </p>
          <p className="text-sm mb-1">Created: {creationDate}</p>
          <p className="text-sm mb-2">Modified: {modificationDate}</p>
          {sortedDocuments.map((doc, index) => {
            const pageNumber = doc.metadata["loc.pageNumber"];
            const isExpanded = expandedPages.includes(pageNumber);
            return (
              <div key={index} className="mt-2 border-t pt-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpand(pageNumber)}
                >
                  <p className="text-sm mb-1">Page: {pageNumber}</p>
                  <ExpandIcon isExpanded={isExpanded} />
                </div>
                <p className={`text-sm ${isExpanded ? "" : "line-clamp-2"}`}>
                  {doc.pageContent}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SourceDocumentsSidebar: React.FC<SourceDocumentsSidebarProps> = ({
  documents,
}) => {
  const groupedDocuments = useMemo(() => {
    const groups: { [key: string]: SourceDocument[] } = {};
    documents.forEach((doc) => {
      const url = doc.metadata.url;
      if (!groups[url]) {
        groups[url] = [];
      }
      groups[url].push(doc);
    });
    return groups;
  }, [documents]);

  return (
    <div className="w-1/4 p-4 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Source Documents</h2>
      {Object.values(groupedDocuments).map((docs, index) => (
        <SourceDocumentCard key={index} documents={docs} />
      ))}
    </div>
  );
};

export default SourceDocumentsSidebar;
