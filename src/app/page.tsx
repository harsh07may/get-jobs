import JobFilterSidebar from "@/components/JobFilterSidebar";
import JobResults from "@/components/JobResults";

import H1 from "@/components/ui/h1";
import { JobFilterValues } from "@/lib/validation";

// Home page receives search params from the URL.
interface PageProps {
  searchParams: {
    q?: string;
    type?: string;
    location?: string;
    remote?: string;
  };
}

export default async function Home({
  searchParams: { q, type, location, remote },
}: PageProps) {
  const filterValues: JobFilterValues = {
    q,
    location,
    type,
    remote: remote === "true",
  };
  return (
    <main className="m-auto my-10 max-w-5xl space-x-10 px-3">
      <div className="space-y-5 text-center">
        <H1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Developer jobs
        </H1>
        <p className="text-muted-foreground">Find your dream job.</p>
      </div>
      <section className="flex flex-col gap-4 md:flex-row">
        <JobFilterSidebar defaultValues={filterValues} />
        <JobResults filterValues={filterValues} />
      </section>
    </main>
  );
}
