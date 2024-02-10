import { jobTypes } from "@/lib/job-types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Select from "./ui/select";
import prisma from "@/lib/prisma";
import { Button } from "./ui/button";
import { JobFilterValues, jobFilterSchema } from "@/lib/validation";
import { redirect } from "next/navigation";
import FormSubmitButton from "./FormSubmitButton";

interface JobFilterSidebarProps {
  defaultValues: JobFilterValues;
}

async function filterJobs(formData: FormData) {
  "use server";
  // 1. Convert formData to object.
  // 2. Validate values with Zod.
  // 3. Build search params object with validated values.
  //    a. If value is defined, add to search params.
  // 4. Redirect to /?searchParams.
  const values = Object.fromEntries(formData.entries());
  const { q, location, type, remote } = jobFilterSchema.parse(values);

  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(location && { location }),
    ...(remote && { remote: "true" }), // Convert boolean to string.
  });

  redirect(`/?${searchParams.toString()}`);
}

export default async function JobFilterSidebar({
  defaultValues,
}: JobFilterSidebarProps) {
  /** Get distinct job types from DB, filter out null values(when locationType = remote, locaiton = null). */
  const distinctLocations = (await prisma.job
    .findMany({
      where: {
        approved: true,
      },
      select: {
        location: true,
      },
      distinct: ["location"],
    })
    .then((locations) =>
      locations.map(({ location }) => location).filter(Boolean),
    )) as string[];

  return (
    <aside className="sticky top-0 h-fit rounded-lg border bg-background p-4 md:w-[260px]">
      <form action={filterJobs}>
        <div className="space-y-4">
          {/* Search Query */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input
              id="q"
              name="q"
              type="text"
              placeholder="Title, company, etc."
              defaultValue={defaultValues.q}
            />
          </div>
          {/* Type */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select
              id="type"
              name="type"
              defaultValue={defaultValues.type || ""}
            >
              <option value="">All Types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          {/* Location */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Select
              id="location"
              name="location"
              defaultValue={defaultValues.location || ""}
            >
              <option value="">All Locations</option>
              {distinctLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </div>
          {/* isRemote */}
          <div className="flex items-center gap-2">
            <input
              id="remote"
              name="remote"
              type="checkbox"
              className="scale-125 accent-black"
              defaultChecked={defaultValues.remote}
            />
            <Label htmlFor="remote">Remote</Label>
          </div>
          <FormSubmitButton type="submit">Filter Jobs</FormSubmitButton>
        </div>
      </form>
    </aside>
  );
}
