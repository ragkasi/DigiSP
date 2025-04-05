
import { cn } from "@/lib/utils";
import { Person } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Music } from "lucide-react";

interface ProfileCardProps {
  person: Person;
  type: "mentor" | "student";
  isMatched?: boolean;
}

export function ProfileCard({ person, type, isMatched = false }: ProfileCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 h-full",
        type === "mentor" ? "border-symphoni-primary/30" : "border-symphoni-secondary/30",
        isMatched && "ring-2 ring-symphoni-primary ring-offset-1 shadow-lg"
      )}
    >
      <CardHeader className={cn(
        "p-4",
        type === "mentor" ? "bg-symphoni-primary/10" : "bg-symphoni-secondary/10",
      )}>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12 border-2 border-white/50">
            <AvatarImage src={person.imageUrl} alt={person.name} />
            <AvatarFallback className={cn(
              type === "mentor" ? "bg-symphoni-primary/20" : "bg-symphoni-secondary/20"
            )}>
              {person.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-medium leading-none">{person.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Music className="mr-1 h-3 w-3" />
              <Badge variant="outline" className="bg-white/50">
                {person.instrument}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <div className="text-sm">
          <span className="font-semibold">Availability:</span> {person.availability}
        </div>
        <p className="text-sm text-muted-foreground">{person.bio}</p>
        {isMatched && (
          <div className="mt-2 text-center">
            <Badge 
              className={cn(
                "animate-pulse-gentle",
                type === "mentor" ? "bg-symphoni-primary text-white" : "bg-symphoni-secondary text-white"
              )}
            >
              Matched
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
