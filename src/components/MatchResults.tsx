
import { Match } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MatchResultsProps {
  matches: Match[];
  unmatched: {
    mentors: number[];
    students: number[];
  };
}

export function MatchResults({ matches, unmatched }: MatchResultsProps) {
  if (matches.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold">Match Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {matches.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-lg">Successful Matches:</h3>
            <ul className="space-y-2">
              {matches.map((match, index) => (
                <li key={index} className="p-3 bg-symphoni-accent rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-semibold text-symphoni-primary">{match.mentor.name}</span>
                    <span className="mx-2 text-gray-500">(Mentor - {match.mentor.instrument})</span>
                  </div>
                  <span className="mx-4">→</span>
                  <div className="flex items-center">
                    <span className="font-semibold text-symphoni-secondary">{match.student.name}</span>
                    <span className="mx-2 text-gray-500">(Student - {match.student.instrument})</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(unmatched.mentors.length > 0 || unmatched.students.length > 0) && (
          <div className="space-y-3">
            <h3 className="font-medium text-lg">Unmatched Participants:</h3>
            {unmatched.mentors.length > 0 && (
              <div className="p-3 bg-gray-100 rounded-md">
                <p><span className="font-medium">Mentors:</span> {unmatched.mentors.join(", ")}</p>
              </div>
            )}
            {unmatched.students.length > 0 && (
              <div className="p-3 bg-gray-100 rounded-md">
                <p><span className="font-medium">Students:</span> {unmatched.students.join(", ")}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
