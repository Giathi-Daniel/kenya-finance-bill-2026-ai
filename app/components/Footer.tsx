export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#121716] px-4 py-7">
      <div className="container-app flex flex-col gap-3 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <span>Kenya Finance Bill Intelligence</span>
        <a
          href="https://www.parliament.go.ke"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sky-300 hover:text-sky-200"
        >
          Official Parliament website
        </a>
      </div>
    </footer>
  );
}
