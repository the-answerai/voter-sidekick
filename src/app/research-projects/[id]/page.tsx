import ProjectResearch from "@/components/ProjectResearch";

export default function ResearchPage({ params }: { params: { id: string } }) {
  const projectId = parseInt(params.id, 10);
  return <ProjectResearch projectId={projectId} />;
}
