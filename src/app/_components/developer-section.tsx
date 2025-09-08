"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { GitHubIcon } from "~/components/icons/icons/github-icon";
import { LinkedInIcon } from "~/components/icons/icons/linkedin-icon";
import { XIcon } from "~/components/icons/icons/x-icon";
import { MailIcon } from "~/components/icons/icons/mail-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function DeveloperSection() {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg">
            <Avatar>
              <AvatarImage
                src="https://github.com/facundomartinezvidal.png"
                className="rounded-full"
                alt="@facundomartinezvidal"
              />
              <AvatarFallback>FMV</AvatarFallback>
            </Avatar>
          </div>

          <h3 className="mb-2 text-2xl font-bold text-white">Built by</h3>
          <h4 className="mb-4 text-xl font-semibold text-blue-300">
            Facundo Martinez Vidal
          </h4>

          <p className="mb-6 max-w-2xl leading-relaxed text-white/70">
            Experienced software developer focused on creating efficient and
            reliable web solutions. Dedicated to continuous learning and
            applying best practices in modern web development.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="transform border-white/20 bg-white/10 text-white duration-200 ease-out hover:scale-105 hover:shadow-lg/20 active:scale-95"
              aria-label="Open GitHub profile"
            >
              <Link
                href="https://github.com/facundomartinezvidal"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon className="h-5 w-5" />
                <span>GitHub</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="transform border-white/20 bg-white/10 text-white duration-200 ease-out hover:scale-105 hover:shadow-lg/20 active:scale-95"
              aria-label="Open X profile"
            >
              <Link
                href="https://x.com/facudeveloper"
                target="_blank"
                rel="noopener noreferrer"
              >
                <XIcon className="h-5 w-5" />
                <span>X</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="transform border-white/20 bg-white/10 text-white duration-200 ease-out hover:scale-105 hover:shadow-lg/20 active:scale-95"
              aria-label="Open LinkedIn profile"
            >
              <Link
                href="https://linkedin.com/in/fmartinezvidal"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon className="h-5 w-5" />
                <span>LinkedIn</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="transform border-white/20 bg-white/10 text-white duration-200 ease-out hover:scale-105 hover:shadow-lg/20 active:scale-95"
              aria-label="Send me an email"
            >
              <Link href="mailto:facumartinezvidal@gmail.com">
                <MailIcon className="h-5 w-5" />
                <span>Contact</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
