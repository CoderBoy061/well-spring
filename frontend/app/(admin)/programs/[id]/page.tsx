import { ProgramDetailScreen } from "@/components/programs/program-detail-screen";

export default async function ProgramPage(props: PageProps<"/programs/[id]">) {
  const { id } = await props.params;

  return <ProgramDetailScreen programId={id} />;
}
