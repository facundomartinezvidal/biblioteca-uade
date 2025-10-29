import Image from "next/image";
import {
  User,
  GraduationCap,
  Mail,
  IdCard,
  UserStarIcon,
  IdCardLanyard,
  Phone,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import type { getUserOutput } from "~/server/api/routers/user";

export function ProfileHeader({
  name,
  last_name,
  institutional_email,
  personal_email,
  phone,
  identity_card,
  legacy_number,
  role,
}: getUserOutput) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-100">
              <Image
                src={"/fmartinezvidal-profile.jpeg"}
                alt={`${name} ${last_name}`}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const sibling = target.nextElementSibling as HTMLElement;
                  if (sibling) sibling.style.display = "flex";
                }}
              />
              <div className="absolute inset-0 hidden items-center justify-center text-gray-400">
                <User className="h-6 w-6" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">
                  {name} {last_name}
                </h1>

                <Badge className="text-berkeley-blue border-0 bg-blue-100 text-sm">
                  {role === "estudiante" && (
                    <>
                      <GraduationCap className="mr-1 h-4 w-4" />
                      Estudiante
                    </>
                  )}
                  {role === "admin" && (
                    <>
                      <UserStarIcon className="mr-1 h-4 w-4" />
                      Administrador
                    </>
                  )}
                </Badge>
              </div>
              <p className="mt-1 text-base text-gray-600">
                <span className="inline-flex items-center gap-1">
                  <User className="h-4 w-4" /> {institutional_email}
                </span>
              </p>

              <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1">
                  <IdCardLanyard className="h-4 w-4" /> {legacy_number}
                </span>
                <span className="inline-flex items-center gap-1">
                  <IdCard className="h-4 w-4" /> {identity_card}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-4 w-4" /> {phone}
                </span>
                {personal_email && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-4 w-4" /> {personal_email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
