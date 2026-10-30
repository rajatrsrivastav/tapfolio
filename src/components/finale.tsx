import Link from "next/link";
import { profile } from "@/content/profile";
import { CardBack, CardFace } from "@/components/card";
import { FlipButton } from "@/components/flip-button";
import { DownloadIcon } from "@/components/icons";
import { cardQrSvg } from "@/lib/qr";
import { availableResumes, cardUrl } from "@/lib/site";

/**
 * The closing shot: the card rises again and turns over. Its back carries the
 * QR code, so a visitor can hold up their phone and pass the page on.
 */
export async function Finale() {
  const svg = await cardQrSvg();
  const shortUrl = cardUrl.replace(/^https?:\/\//, "");
  const resumes = availableResumes();

  return (
    <section id="finale" data-scene className="stage finale" aria-labelledby="finale-title">
      <div className="stage-pin">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_50%_42%,rgb(124_151_212/0.32),transparent_72%)]"
        />
        <div className="finale-layout relative mx-auto flex h-full max-w-[1180px] flex-col items-center px-5">
          <div className="finale-copy text-center">
            <p className="hud text-fog">Pass it on</p>
            <h2
              id="finale-title"
              className="mt-3 text-[clamp(1.75rem,6.4vw,3rem)] leading-[1.05] font-light tracking-[-0.015em] text-paper"
            >
              tap the card, or scan its back
            </h2>
          </div>

          <div className="finale-card relative grid place-items-center">
            <div className="card-frame">
              <div className="card-pose">
                <div className="card-body">
                  <CardFace />
                  <CardBack className="card-back">
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[6%] p-[10%]">
                      <p className="hud text-[calc(var(--card-w)*0.036)] text-paper/80">Scan to open</p>
                      <div
                        role="img"
                        aria-label={`QR code that opens ${cardUrl}`}
                        className="aspect-square w-[82%] overflow-hidden rounded-[10%] bg-white p-[3%] [&_svg]:size-full"
                        dangerouslySetInnerHTML={{ __html: svg }}
                      />
                      <p className="text-center text-[calc(var(--card-w)*0.043)] leading-tight font-medium break-all text-paper">
                        {shortUrl}
                      </p>
                    </div>
                  </CardBack>
                </div>
              </div>
            </div>
          </div>

          <div className="finale-copy flex flex-col items-center gap-3">
            <FlipButton />
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-[14.5px]">
              {resumes.map((resume) => (
                <a
                  key={resume.id}
                  href={resume.file}
                  download={resume.downloadName}
                  className="inline-flex min-h-11 items-center gap-1.5 font-medium text-field underline-offset-4 hover:underline"
                >
                  <DownloadIcon className="size-4" />
                  Download {resume.label.toLowerCase()}
                </a>
              ))}
              <Link
                href="/qr"
                className="inline-flex min-h-11 items-center font-medium text-field underline-offset-4 hover:underline"
              >
                Print-ready QR code
              </Link>
            </div>
          </div>
        </div>
      </div>
      <p className="sr-only">
        The card’s address is {cardUrl}. {profile.name}’s contact card and resume are in the toolbar at the bottom of the
        screen.
      </p>
    </section>
  );
}
