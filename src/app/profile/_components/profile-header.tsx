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
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

export function ProfileHeader({
  name,
  last_name,
  institutional_email,
  personal_email,
  phone,
  identity_card,
  legacy_number,
  role,
  subrol,
}: {
  name: string;
  last_name: string;
  institutional_email: string;
  personal_email: string;
  phone: string;
  identity_card: string;
  legacy_number: string;
  role: string;
  subrol?: string | null;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="border-berkeley-blue/20 h-20 w-20 border-2">
              <AvatarFallback className="bg-berkeley-blue/10 text-berkeley-blue text-xl font-semibold">
                {name?.[0]}
                {last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">
                  {name} {last_name}
                </h1>

                <Badge className="text-berkeley-blue border-0 bg-blue-100 text-sm">
                  {role === "ALUMNO" && (
                    <>
                      <GraduationCap className="mr-1 h-4 w-4" />
                      Alumno
                    </>
                  )}
                  {role === "ADMINISTRADOR" && subrol === "BIBLIOTECARIO" && (
                    <>
                      <UserStarIcon className="mr-1 h-4 w-4" />
                      Bibliotecario
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
