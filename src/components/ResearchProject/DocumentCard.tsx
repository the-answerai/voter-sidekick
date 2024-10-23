import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bookmark,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ExternalLink,
} from "lucide-react";
import getFollowUpQuestions from "@/utils/getFollowUpQuestions";

interface Excerpt {
  id: string;
  text: string;
  page: number;
  suggestedQuestions: string[];
}

interface Document {
  id: string;
  title: string;
  author: string;
  date: string;
  isValid: boolean;
  relevance: number;
  excerpts: Excerpt[];
  pdfUrl: string;
  sourceUrl: string;
}

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  // Add other relevant fields
}

interface DocumentCardProps {
  document: Document;
  researchProject: ResearchProject;
  onDocumentClick: () => void;
  onSaveExcerpt: (excerpt: string) => void;
  isSaved?: boolean;
  onRemoveExcerpt?: (excerptId: string) => void;
  customIcon?: React.ReactNode;
  customButtonText?: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  researchProject,
  onDocumentClick,
  onSaveExcerpt,
  isSaved = false,
  onRemoveExcerpt,
  customIcon,
  customButtonText,
}) => {
  const [currentExcerpt, setCurrentExcerpt] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  useEffect(() => {
    if (isDialogOpen) {
      fetchSuggestedQuestions();
    }
  }, [isDialogOpen, currentExcerpt]);

  const fetchSuggestedQuestions = async () => {
    const excerpt = document.excerpts[currentExcerpt];
    const chatHistory = [
      {
        role: "system",
        content: `Research Project: ${researchProject.title}\nDescription: ${researchProject.description}`,
      },
      { role: "user", content: excerpt.text },
    ];
    const questions = await getFollowUpQuestions(chatHistory, excerpt.text);
    setSuggestedQuestions(questions);
  };

  const nextExcerpt = () => {
    if (currentExcerpt < document.excerpts.length - 1) {
      setCurrentExcerpt(currentExcerpt + 1);
    }
  };

  const prevExcerpt = () => {
    if (currentExcerpt > 0) {
      setCurrentExcerpt(currentExcerpt - 1);
    }
  };

  const handleSaveOrRemove = () => {
    if (isSaved && onRemoveExcerpt) {
      onRemoveExcerpt(document.excerpts[currentExcerpt].id);
    } else {
      onSaveExcerpt(document.excerpts[currentExcerpt].text);
    }
  };

  return (
    <Card className="w-full max-w-md mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="truncate">{document.title}</span>
          <Badge variant={document.isValid ? "default" : "destructive"}>
            {document.isValid ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
          </Badge>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {document.author} • {document.date}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">Relevance: {document.relevance}%</p>
        <p className="text-sm line-clamp-3">
          {document.excerpts[0]?.text || "No excerpt available"}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={handleSaveOrRemove}>
          {customIcon ||
            (isSaved ? (
              <Trash2 className="w-4 h-4 mr-2" />
            ) : (
              <Bookmark
                className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`}
              />
            ))}
          {customButtonText || (isSaved ? "Remove" : "Save")}
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setIsDialogOpen(true);
                onDocumentClick();
              }}
            >
              View Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[80vw] max-h-[80vh] w-full h-full p-0 overflow-hidden">
            <DialogHeader className="p-6 border-b">
              <DialogTitle className="flex justify-between items-center">
                <span>{document.title}</span>
                <a
                  href={document.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <ExternalLink className="w-4 h-4 inline-block mr-1" />
                  Original Source
                </a>
              </DialogTitle>
            </DialogHeader>
            <div className="flex h-[calc(80vh-8rem)] overflow-hidden">
              <div className="w-1/2 h-full overflow-hidden border-r">
                <iframe
                  src="https://static.project2025.org/2025_MandateForLeadership_FULL.pdf"
                  className="w-full h-full"
                  title={document.title}
                />
              </div>
              <div className="w-1/2 h-full p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Relevant Excerpts</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevExcerpt}
                      disabled={currentExcerpt === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveOrRemove}
                    >
                      {isSaved ? (
                        <Trash2 className="w-4 h-4" />
                      ) : (
                        <Bookmark
                          className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                        />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextExcerpt}
                      disabled={currentExcerpt === document.excerpts.length - 1}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2">
                  Document Metadata
                </h3>
                <p className="text-sm mb-2">Author: {document.author}</p>
                <p className="text-sm mb-2">Date: {document.date}</p>
                <p className="text-sm mb-4">Relevance: {document.relevance}%</p>

                {document.excerpts.length > 0 ? (
                  <>
                    <div className="bg-gray-100 p-4 rounded-md mb-4">
                      <p className="text-sm">
                        {document.excerpts[currentExcerpt].text}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Page {document.excerpts[currentExcerpt].page}
                      </p>
                    </div>
                    <h4 className="text-md font-semibold mb-2">
                      Suggested Questions
                    </h4>
                    <ul className="list-disc pl-5 mb-4">
                      {suggestedQuestions.map((question, index) => (
                        <li key={index} className="text-sm mb-1">
                          {question}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-gray-500">No excerpts available</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
