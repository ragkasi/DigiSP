
import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Save, MessageSquare } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Feedback } from "@/types";

interface SheetMusicViewerProps {
  sheetMusicUrl: string;
  songTitle: string;
  readOnly?: boolean;
  existingFeedback?: Feedback[];
  onAddFeedback?: (measureNumber: number, comment: string) => void;
}

export function SheetMusicViewer({
  sheetMusicUrl,
  songTitle,
  readOnly = false,
  existingFeedback = [],
  onAddFeedback
}: SheetMusicViewerProps) {
  const [annotations, setAnnotations] = useState<{x: number; y: number}[]>([]);
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (readOnly) return;
    
    if (containerRef.current && imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Estimate the measure number based on x position (simplified)
      const estimatedMeasure = Math.ceil(x / 10);
      
      setAnnotations([...annotations, {x, y}]);
      setActiveAnnotation(annotations.length);
      
      // Set a default comment mentioning the measure number
      setComment(`Measure ${estimatedMeasure}: `);
    }
  };
  
  const handleSaveComment = () => {
    if (activeAnnotation !== null && onAddFeedback) {
      // Estimate measure number based on x position
      const measureNumber = Math.ceil((annotations[activeAnnotation].x) / 10);
      onAddFeedback(measureNumber, comment);
      setActiveAnnotation(null);
      setComment("");
    }
  };
  
  return (
    <Card className="overflow-hidden border">
      <div className="p-4 bg-white border-b">
        <h3 className="font-medium">{songTitle} - Sheet Music</h3>
        {!readOnly && (
          <p className="text-sm text-gray-500 mt-1">
            Click on the sheet music to add annotations
          </p>
        )}
      </div>
      
      <div 
        ref={containerRef} 
        className="relative bg-white p-4 max-h-[600px] overflow-auto"
      >
        <img
          ref={imageRef}
          src={sheetMusicUrl}
          alt={`Sheet music for ${songTitle}`}
          className={`w-full ${!readOnly ? 'cursor-crosshair' : ''}`}
          onClick={handleImageClick}
        />
        
        {/* Render annotation markers */}
        {annotations.map((annotation, index) => (
          <div
            key={index}
            className={`absolute rounded-full ${
              activeAnnotation === index 
                ? 'bg-red-500 h-6 w-6 -ml-3 -mt-3 z-20'
                : 'bg-yellow-500 h-4 w-4 -ml-2 -mt-2 z-10'
            } cursor-pointer transition-all hover:scale-110`}
            style={{
              left: `${annotation.x}%`,
              top: `${annotation.y}%`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveAnnotation(index);
            }}
          >
            <span className="flex items-center justify-center h-full text-white text-xs font-bold">
              {index + 1}
            </span>
          </div>
        ))}
        
        {/* Render existing feedback from mentor */}
        {existingFeedback && existingFeedback.map((feedback, index) => {
          // Calculate position based on measure number (simplified)
          // In a real app, this would need more sophisticated positioning
          const x = (feedback.measureNumber || 1) * 10;
          const y = 20 + (index * 5); // Distribute vertically

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className="absolute bg-blue-500 h-4 w-4 rounded-full -ml-2 -mt-2 z-10 cursor-pointer"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                >
                  <span className="flex items-center justify-center h-full text-white text-xs font-bold">
                    {index + 1}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{feedback.comment}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      
      {/* Active annotation comment input */}
      {activeAnnotation !== null && !readOnly && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex gap-2">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment..."
              className="flex-1"
              autoFocus
            />
            <Button 
              onClick={handleSaveComment} 
              disabled={!comment.trim()}
              size="sm"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
