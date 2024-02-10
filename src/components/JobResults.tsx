import { JobFilterValues } from "@/lib/validation";
import JobListItem from "./JobListItem";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface JobResultsProps {
  filterValues: JobFilterValues;
}

export default async function JobResults({
  filterValues: { location, q, type, remote },
}: JobResultsProps) {
  // Build a search string for the Prisma query (supported by Postgres FullTextSearch).
  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

  const searchFilter: Prisma.JobWhereInput = searchString
    ? {
        OR: [
          { title: { search: searchString } },
          { companyName: { search: searchString } },
          { type: { search: searchString } },
          { locationType: { search: searchString } },
          { location: { search: searchString } },
        ],
      }
    : {};

  const where: Prisma.JobWhereInput = {
    AND: [
      searchFilter,
      type ? { type } : {},
      location ? { location } : {},
      remote ? { locationType: "remote" } : {},
      { approved: true },
    ],
  };

  // Get all jobs which are approved.
  const jobs = await prisma?.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grow space-y-4">
      {jobs.map((job) => (
        <JobListItem key={job.id} job={job} />
      ))}
      {jobs.length === 0 && (
        <p className="m-auto text-center">{"No jobs found :("}</p>
      )}
    </div>
  );
}
