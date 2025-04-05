
import { cn } from "@/lib/utils";
import { Mentor } from "@/types";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music, Star, StarHalf, ExternalLink } from "lucide-react";

interface MentorCardProps {
  mentor: Mentor;
  onSelectMentor?: (mentor: Mentor) => void;
  isSelected?: boolean;
}

export function MentorCard({ mentor, onSelectMentor, isSelected = false }: MentorCardProps) {
  // Generate stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    // Half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    // Empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 h-full",
        "border-symphoni-primary/30",
        isSelected && "ring-2 ring-symphoni-primary ring-offset-1 shadow-lg"
      )}
    >
      <CardHeader className={cn(
        "p-4",
        "bg-symphoni-primary/10",
      )}>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12 border-2 border-white/50">
            <AvatarImage src={mentor.imageUrl} alt={mentor.name} />
            <AvatarFallback className="bg-symphoni-primary/20">
              {mentor.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-medium leading-none">{mentor.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Music className="mr-1 h-3 w-3" />
              <Badge variant="outline" className="bg-white/50">
                {mentor.instrument}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-2">
          {renderStars(mentor.starRating)}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        <div className="text-sm">
          <span className="font-semibold">Availability:</span> {mentor.availability}
        </div>
        <p className="text-sm text-muted-foreground">{mentor.bio}</p>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <h4 className="text-sm font-medium mb-2">Student Reviews</h4>
          <div className="space-y-2">
            {mentor.reviews.map((review, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded-md text-left">
                <p className="text-xs font-medium">{review.name}</p>
                <p className="text-xs text-gray-600">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex flex-col space-y-2">
        <a 
          href={mentor.resumeLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-symphoni-secondary flex items-center hover:underline"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          View Music Portfolio
        </a>
        
        {onSelectMentor && (
          <Button 
            onClick={() => onSelectMentor(mentor)} 
            variant={isSelected ? "outline" : "default"}
            className={isSelected ? "border-symphoni-primary text-symphoni-primary" : ""}
            size="sm"
          >
            {isSelected ? "Selected" : "Select This Mentor"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
