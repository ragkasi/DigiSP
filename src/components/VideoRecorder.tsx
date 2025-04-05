
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, Play, Square } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { PracticeSong } from "@/types";

interface VideoRecorderProps {
  song: PracticeSong;
  onRecordingComplete: (videoUrl: string) => void;
}

export function VideoRecorder({ song, onRecordingComplete }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);
  const [deviceAvailable, setDeviceAvailable] = useState(true);
  const [volume, setVolume] = useState(30);
  const [tempo, setTempo] = useState(song.tempo);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const metronomeIntervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize the camera when the component mounts
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        streamRef.current = stream;
        setDeviceAvailable(true);
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setDeviceAvailable(false);
        toast.error("Unable to access camera or microphone");
      }
    };

    initializeCamera();

    return () => {
      // Clean up the stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle the metronome functionality
  useEffect(() => {
    if (isMetronomeOn) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const beatsPerSecond = tempo / 60;
      const intervalMs = 1000 / beatsPerSecond;
      
      const playMetronomeSound = () => {
        if (!audioContextRef.current) return;
        
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        
        const volumeLevel = volume / 100;
        gainNode.gain.value = volumeLevel;
        
        oscillator.frequency.value = 880;
        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + 0.05);
      };
      
      playMetronomeSound();
      metronomeIntervalRef.current = window.setInterval(playMetronomeSound, intervalMs);
      
      return () => {
        if (metronomeIntervalRef.current) {
          clearInterval(metronomeIntervalRef.current);
        }
      };
    }
  }, [isMetronomeOn, tempo, volume]);

  const handleStartRecording = () => {
    if (!streamRef.current) {
      toast.error("No camera access");
      return;
    }
    
    recordedChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current);
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const recordedBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(recordedBlob);
      onRecordingComplete(videoUrl);
    };
    
    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    
    // Start the metronome if it's not already on
    if (!isMetronomeOn) {
      setIsMetronomeOn(true);
    }
    
    toast.success("Recording started!");
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsMetronomeOn(false);
      toast.success("Recording completed!");
    }
  };

  const toggleMetronome = () => {
    setIsMetronomeOn(!isMetronomeOn);
    if (!isMetronomeOn) {
      toast.success(`Metronome started at ${tempo} BPM`);
    } else {
      toast.success("Metronome stopped");
    }
  };

  return (
    <Card className="overflow-hidden border shadow-md">
      <div className="relative">
        {/* Video Preview */}
        <div className="aspect-video bg-black">
          {deviceAvailable ? (
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <p>Camera access required</p>
            </div>
          )}
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/80 text-white px-3 py-1 rounded-full">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm">REC</span>
            </div>
          )}
          
          {/* Metronome visual indicator */}
          {isMetronomeOn && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 text-white px-3 py-1 rounded-full">
              <div className={`h-3 w-3 bg-blue-400 rounded-full ${isMetronomeOn ? 'animate-pulse' : ''}`} />
              <span className="text-sm">{tempo} BPM</span>
            </div>
          )}
        </div>
        
        {/* Sheet Music Display */}
        <div className="bg-white p-4 border-t">
          <h3 className="font-medium mb-2">{song.title} - {song.composer}</h3>
          <div className="bg-gray-100 p-2 rounded-md max-h-60 overflow-y-auto">
            <img 
              src={song.sheetMusicUrl} 
              alt={`Sheet music for ${song.title}`} 
              className="w-full"
            />
          </div>
        </div>
        
        {/* Controls */}
        <div className="p-4 bg-white border-t flex flex-wrap justify-between gap-4">
          <div className="flex gap-2">
            {isRecording ? (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleStopRecording}
              >
                <Square className="h-4 w-4 mr-1" />
                Stop Recording
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="sm"
                onClick={handleStartRecording}
                disabled={!deviceAvailable}
              >
                <Video className="h-4 w-4 mr-1" />
                Start Recording
              </Button>
            )}
            
            <Button
              variant={isMetronomeOn ? "secondary" : "outline"}
              size="sm"
              onClick={toggleMetronome}
            >
              {isMetronomeOn ? "Stop Metronome" : "Start Metronome"}
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col space-y-1 min-w-[150px]">
              <span className="text-xs text-gray-500">Tempo: {tempo} BPM</span>
              <Slider
                value={[tempo]}
                min={40}
                max={220}
                step={1}
                onValueChange={(value) => setTempo(value[0])}
              />
            </div>
            
            <div className="flex flex-col space-y-1 min-w-[100px]">
              <span className="text-xs text-gray-500">Volume: {volume}%</span>
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0])}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
