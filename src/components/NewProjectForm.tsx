
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PracticeSong, Instrument, Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Music, ArrowRight, Upload, FileMusic } from "lucide-react";
import { getPracticeSongsByInstrument, createProject } from "@/services/mockData";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";

interface NewProjectFormProps {
  studentId: number;
  instrument: Instrument;
  onProjectCreated: (project: Project) => void;
  onCancel: () => void;
}

export function NewProjectForm({ 
  studentId, 
  instrument, 
  onProjectCreated, 
  onCancel 
}: NewProjectFormProps) {
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const [customSongTitle, setCustomSongTitle] = useState("");
  const [customSongComposer, setCustomSongComposer] = useState("");
  const [customSongTempo, setCustomSongTempo] = useState("120");
  const [customSongDifficulty, setCustomSongDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [uploadedSheetMusic, setUploadedSheetMusic] = useState<File | null>(null);
  const [uploadedSheetMusicURL, setUploadedSheetMusicURL] = useState<string | null>(null);
  const [isCustomSong, setIsCustomSong] = useState(false);
  
  const availableSongs = getPracticeSongsByInstrument(instrument);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedSheetMusic(file);
      
      // Create a URL for preview
      const objectUrl = URL.createObjectURL(file);
      setUploadedSheetMusicURL(objectUrl);
      
      // If we're uploading a custom sheet, switch to custom song mode
      setIsCustomSong(true);
      
      // Try to extract a title from the filename
      const fileName = file.name.split('.')[0].replace(/_/g, ' ');
      if (!customSongTitle) {
        setCustomSongTitle(fileName);
      }
      
      toast.success("Sheet music uploaded successfully!");
    }
  }, [customSongTitle]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });
  
  const handleCreateProject = () => {
    if (isCustomSong) {
      if (!customSongTitle || !uploadedSheetMusicURL) {
        toast.error("Please provide a title and upload sheet music");
        return;
      }
      
      // Create a project with custom uploaded sheet music
      const newProject = createProject({
        title: customSongTitle,
        studentId,
        instrument,
        sheetMusicUrl: uploadedSheetMusicURL,
        tempo: parseInt(customSongTempo) || 120,
      });
      
      toast.success(`Project "${customSongTitle}" created successfully!`);
      onProjectCreated(newProject);
    } else {
      if (!selectedSongId) {
        toast.error("Please select a song");
        return;
      }
      
      const selectedSong = availableSongs.find(song => song.id === selectedSongId);
      if (!selectedSong) return;
      
      const newProject = createProject({
        title: selectedSong.title,
        studentId,
        instrument,
        sheetMusicUrl: selectedSong.sheetMusicUrl,
        tempo: selectedSong.tempo,
      });
      
      toast.success(`Project "${selectedSong.title}" created successfully!`);
      onProjectCreated(newProject);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Start a New Project</h2>
        <p className="text-gray-600">
          Select a piece to practice and record. Your mentor will provide feedback on your performances.
        </p>
      </div>
      
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Button 
            variant={!isCustomSong ? "default" : "outline"}
            size="sm"
            onClick={() => setIsCustomSong(false)}
          >
            Choose from Library
          </Button>
          <Button 
            variant={isCustomSong ? "default" : "outline"}
            size="sm"
            onClick={() => setIsCustomSong(true)}
          >
            Upload Sheet Music
          </Button>
        </div>
        
        {isCustomSong ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="songTitle" className="mb-2 block">Song Title</Label>
                <Input 
                  id="songTitle" 
                  placeholder="Enter song title" 
                  value={customSongTitle}
                  onChange={(e) => setCustomSongTitle(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="composer" className="mb-2 block">Composer (Optional)</Label>
                <Input 
                  id="composer" 
                  placeholder="Enter composer name" 
                  value={customSongComposer}
                  onChange={(e) => setCustomSongComposer(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="tempo" className="mb-2 block">Tempo (BPM)</Label>
                <Input 
                  id="tempo" 
                  type="number"
                  min="40"
                  max="240"
                  placeholder="120"
                  value={customSongTempo}
                  onChange={(e) => setCustomSongTempo(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="difficulty" className="mb-2 block">Difficulty</Label>
                <Select 
                  value={customSongDifficulty} 
                  onValueChange={(value: "Beginner" | "Intermediate" | "Advanced") => 
                    setCustomSongDifficulty(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Sheet Music</Label>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-300 hover:border-primary/70'
                }`}
              >
                <input {...getInputProps()} />
                
                {uploadedSheetMusicURL ? (
                  <div className="space-y-4">
                    <div className="relative mx-auto max-w-md overflow-hidden rounded-lg border">
                      {uploadedSheetMusic?.type.includes("image") ? (
                        <img 
                          src={uploadedSheetMusicURL} 
                          alt="Uploaded sheet music" 
                          className="w-full h-auto"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-48 bg-gray-100">
                          <FileMusic className="h-16 w-16 text-gray-400" />
                          <p className="ml-2 text-gray-600">PDF Document</p>
                        </div>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="absolute top-2 right-2" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedSheetMusic(null);
                          setUploadedSheetMusicURL(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      {uploadedSheetMusic?.name} ({Math.round(uploadedSheetMusic?.size / 1024)} KB)
                    </p>
                    <p className="text-sm text-gray-500">
                      Click or drag to replace
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <Upload className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-gray-600">Drag and drop sheet music here, or click to select files</p>
                    <p className="text-xs text-gray-500">
                      Supports PNG, JPG, JPEG, and PDF files
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Label>Select a Piece to Practice</Label>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {availableSongs.map((song) => (
                <Card 
                  key={song.id}
                  className={`border cursor-pointer transition-all ${
                    selectedSongId === song.id 
                      ? 'ring-2 ring-primary' 
                      : 'hover:border-primary'
                  }`}
                  onClick={() => setSelectedSongId(song.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{song.title}</h3>
                        <Badge variant="outline" className="ml-2">
                          {song.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-500 mt-1">{song.composer}</p>
                      
                      <div className="flex items-center mt-3 text-sm">
                        <Music className="h-3 w-3 mr-1 text-gray-500" />
                        <span>{song.instrument}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span>{song.tempo} BPM</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {availableSongs.length === 0 && (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-500">
                  No songs available for {instrument}. Please try another instrument or upload your own sheet music.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          disabled={!selectedSongId && (!isCustomSong || !uploadedSheetMusicURL)}
          onClick={handleCreateProject}
        >
          Create Project
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
