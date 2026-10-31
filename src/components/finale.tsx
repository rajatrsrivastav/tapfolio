import { profile } from "@/content/profile";
import { CardBack, CardFace } from "@/components/card";
import { FlipButton } from "@/components/flip-button";
import { DownloadIcon } from "@/components/icons";
import { CopyLinkButton } from "@/components/share-actions";
import { cardQrSvg } from "@/lib/qr";
import { availableResumes, cardUrl } from "@/lib/site";

/**
 * The closing shot: the card rises again and turns over. Its back carries the
 * QR code, so a visitor can hold up their phone and pass the page on.
 */
export async function Finale({ share }: { share: { url: string; title: string; text: string } }) {
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
            <p className="hud text-fog">Keep in touch</p>
            <h2
              id="finale-title"
              className="mt-3 text-[clamp(1.75rem,6.4vw,3rem)] leading-[1.05] font-light tracking-[-0.015em] text-paper"
            >
              let’s keep talking
            </h2>
          </div>

          <div className="finale-card relative grid place-items-center">
            <div className="card-frame">
              <div className="card-pose">
                <div className="card-body">
                  <CardFace />
                  <CardBack className="card-back">
                    <div className="absolute inset-0 flex items-center gap-[5cqw] p-[6cqw]">
                      <div className="flex min-w-0 flex-1 flex-col self-stretch">
                        <p className="font-wide text-[3.7cqw] leading-none font-extrabold text-paper">{profile.givenName}</p>
                        <p className="mt-auto text-[1.9cqw] font-semibold tracking-[0.3em] text-field uppercase">
                          Scan to open
                        </p>
                        <p className="mt-[1.4cqw] text-[4.4cqw] leading-[1.05] font-light text-paper">
                          My work, resume and contact
                        </p>
                        <p className="mt-[2cqw] text-[2.4cqw] font-medium break-all text-fog">{shortUrl}</p>
                      </div>
                      <div
                        role="img"
                        aria-label={`QR code that opens ${cardUrl}`}
                        className="aspect-square h-full shrink-0 overflow-hidden rounded-[2.4cqw] bg-white p-[1cqw] [&_svg]:size-full"
                        dangerouslySetInnerHTML={{ __html: svg }}
                      />
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
              <CopyLinkButton share={share} />
            </div>
          </div>
        </div>
      </div>
      <p className="sr-only">
        Find {profile.name}’s contact details and resume in the toolbar at the bottom of the
        screen.
      </p>
    </section>
  );
}
