import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-6">
      <h1 className="font-wide text-3xl font-extrabold">Page not found</h1>
      <p className="text-fog">This address doesn’t exist. The profile is one tap away.</p>
      <Link
        href="/"
        className="inline-flex min-h-12 w-fit items-center rounded-xl bg-field px-5 font-semibold text-night hover:bg-[#c4b9ff]"
      >
        Open the profile
      </Link>
    </main>
  );
}
