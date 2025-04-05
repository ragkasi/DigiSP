
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, MicOff, Music, VolumeX, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
// Note frequency data (standard A440 tuning)
const NOTE_FREQUENCIES = {
  "C": 261.63,
  "C#": 277.18,
  "D": 293.66,
  "D#": 311.13,
  "E": 329.63,
  "F": 349.23,
  "F#": 369.99,
  "G": 392.00,
  "G#": 415.30,
  "A": 440.00,
  "A#": 466.16,
  "B": 493.88
};

export function Tuner() {
  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState<string | null>(null);
  const [detectedFreq, setDetectedFreq] = useState<number | null>(null);
  const [targetNote, setTargetNote] = useState<string>("A");
  const [centsOff, setCentsOff] = useState<number>(0);
  const [audioSupported, setAudioSupported] = useState(true);
  const [inputVolume, setInputVolume] = useState(0); // For volume meter
  const [permissionDenied, setPermissionDenied] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const volumeCheckRef = useRef<number | null>(null);
  const lastDetectionRef = useRef<number>(0);
  
  // Check if audio is supported
  useEffect(() => {
    if (!navigator.mediaDevices || !window.AudioContext) {
      setAudioSupported(false);
      toast.error("Audio functionality not supported in this browser");
    }
    
    return () => {
      stopTuner();
      if (volumeCheckRef.current) {
        clearInterval(volumeCheckRef.current);
      }
    };
  }, []);
  
  // Calculate the cents difference between frequencies
  const calculateCents = (frequency: number, referenceFrequency: number): number => {
    return Math.round(1200 * Math.log2(frequency / referenceFrequency));
  };
  
  // Find the closest note to a given frequency
  const findClosestNote = (frequency: number): { note: string; cents: number } => {
    if (frequency === 0) return { note: "", cents: 0 };
    
    // A4 is our reference at 440Hz (MIDI note 69)
    const A4 = 440;
    const A4_INDEX = 69;
    
    // Convert frequency to MIDI note number (logarithmic scale)
    const noteNum = 12 * Math.log2(frequency / A4) + A4_INDEX;
    
    // Round to get the closest MIDI note
    const noteInt = Math.round(noteNum);
    
    // Calculate cents offset
    const cents = Math.round((noteNum - noteInt) * 100);
    
    // Calculate octave and note name
    const octave = Math.floor(noteInt / 12) - 1;
    const noteName = NOTES[noteInt % 12];
    
    return { note: `${noteName}${octave}`, cents };
  };
  
  // Calculate input volume level
  const calculateVolume = (buffer: Float32Array): number => {
    let sum = 0;
    // Get the RMS of the signal
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    const rms = Math.sqrt(sum / buffer.length);
    // Scale to a 0-100 value
    return Math.min(100, Math.max(0, rms * 100 * 5)); // Amplify by 5x for better visualization
  };
  
  // Start the tuner
  const startTuner = async () => {
    try {
      console.log("Requesting microphone access...");
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      console.log("Microphone access granted");
      setPermissionDenied(false);
      streamRef.current = stream;
      
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      // Create analyzer node
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 4096; // Larger FFT size for better frequency resolution
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      // Connect microphone to analyzer
      micStreamRef.current = audioContextRef.current.createMediaStreamSource(stream);
      micStreamRef.current.connect(analyserRef.current);
      
      // Start analyzing pitch
      setIsListening(true);
      analyzePitch();
      
      // Start volume checking
      volumeCheckRef.current = window.setInterval(() => {
        if (analyserRef.current) {
          const bufferLength = analyserRef.current.fftSize;
          const buffer = new Float32Array(bufferLength);
          analyserRef.current.getFloatTimeDomainData(buffer);
          
          const volume = calculateVolume(buffer);
          setInputVolume(volume);
          
          // If we haven't detected a note in 2 seconds but have volume, show a hint
          const now = Date.now();
          if (volume > 10 && !detectedNote && (now - lastDetectionRef.current) > 2000) {
            console.log("Sound detected but no pitch found. Try a clearer note.");
          }
        }
      }, 100);
      
      toast.success("Tuner started");
    } catch (err: any) {
      console.error("Error accessing microphone:", err);
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionDenied(true);
        toast.error("Microphone access denied. Please allow microphone access in your browser settings.");
      } else {
        toast.error("Unable to access microphone: " + (err.message || "Unknown error"));
        setAudioSupported(false);
      }
    }
  };
  
  // Stop the tuner
  const stopTuner = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (volumeCheckRef.current) {
      clearInterval(volumeCheckRef.current);
      volumeCheckRef.current = null;
    }
    
    // Disconnect and stop all audio processing
    if (micStreamRef.current) {
      micStreamRef.current.disconnect();
      micStreamRef.current = null;
    }
    
    // Stop and release the microphone stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    
    // Suspend audio context
    if (audioContextRef.current && audioContextRef.current.state === "running") {
      audioContextRef.current.suspend();
    }
    
    setIsListening(false);
    setDetectedNote(null);
    setDetectedFreq(null);
    setCentsOff(0);
    setInputVolume(0);
  };
  
  // Toggle tuner on/off
  const toggleTuner = () => {
    if (isListening) {
      stopTuner();
      toast.success("Tuner stopped");
    } else {
      startTuner();
    }
  };
  
  // Improved pitch detection using YIN algorithm
  const analyzePitch = () => {
    if (!analyserRef.current || !isListening) return;
    
    const bufferLength = analyserRef.current.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyserRef.current.getFloatTimeDomainData(buffer);
    
    // Improved YIN-inspired autocorrelation for pitch detection
    const detectPitch = (buffer: Float32Array): number => {
      const threshold = 0.12; // Lower threshold to make more sensitive
      const minFreq = 65;  // Lower minimum frequency (low C on guitar ~65 Hz)
      const maxFreq = 1200; // Maximum detectable frequency
      
      // Calculate maximum period we're looking for based on minimum frequency
      const maxPeriod = Math.floor(audioContextRef.current!.sampleRate / minFreq);
      
      // Calculate energy of the signal (sum of squared values)
      let energy = 0;
      for (let i = 0; i < buffer.length; i++) {
        energy += buffer[i] * buffer[i];
      }
      
      // Lower the energy threshold to detect softer sounds
      if (energy < 0.005) {
        return 0;
      }
      
      // Initialize difference function array
      const differences = new Float32Array(maxPeriod);
      
      // Step 1: Calculate square difference for each lag
      for (let lag = 0; lag < maxPeriod; lag++) {
        let squareDiff = 0;
        for (let i = 0; i + lag < buffer.length; i++) {
          const diff = buffer[i] - buffer[i + lag];
          squareDiff += diff * diff;
        }
        differences[lag] = squareDiff;
      }
      
      // Step 2: Normalize the difference function with cumulative mean
      differences[0] = 1; // Avoid division by zero
      let runningSum = 0;
      for (let lag = 1; lag < maxPeriod; lag++) {
        runningSum += differences[lag];
        differences[lag] = differences[lag] * lag / runningSum;
      }
      
      // Step 3: Find the first dip below threshold
      let bestPeriod = 0;
      for (let lag = 2; lag < maxPeriod; lag++) {
        if (differences[lag] < threshold) {
          // Look for local minimum in this region
          let localMin = lag;
          while (lag + 1 < maxPeriod && differences[lag + 1] < differences[lag]) {
            lag++;
            if (differences[lag] < differences[localMin]) {
              localMin = lag;
            }
          }
          bestPeriod = localMin;
          break;
        }
      }
      
      // Calculate frequency from period
      if (bestPeriod !== 0) {
        const frequency = audioContextRef.current!.sampleRate / bestPeriod;
        if (frequency >= minFreq && frequency <= maxFreq) {
          return frequency;
        }
      }
      
      return 0; // No clear frequency detected
    };
    
    const frequency = detectPitch(buffer);
    
    if (frequency > 0) {
      const { note, cents } = findClosestNote(frequency);
      
      lastDetectionRef.current = Date.now();
      
      // Check if detected note matches the target (ignoring octave)
      const baseDetectedNote = note.substring(0, note.length - 1); // Strip octave
      const isTargetNote = baseDetectedNote === targetNote;
      
      setDetectedNote(note);
      setDetectedFreq(frequency);
      setCentsOff(isTargetNote ? cents : 0);
    } else {
      // No valid pitch detected
      setDetectedNote(null);
      setDetectedFreq(null);
      setCentsOff(0);
    }
    
    // Continue analyzing
    animationFrameRef.current = requestAnimationFrame(analyzePitch);
  };
  
  // Calculate accuracy for UI display
  const getAccuracyColor = () => {
    if (!detectedNote) return "bg-gray-200 h-2";
    
    const absOffset = Math.abs(centsOff);
    if (absOffset < 5) return "bg-green-500 h-2"; // Perfect
    if (absOffset < 15) return "bg-green-400 h-2"; // Very Good
    if (absOffset < 30) return "bg-green-300 h-2"; // Good
    if (absOffset < 50) return "bg-yellow-400 h-2"; // Close
    return "bg-red-500 h-2"; // Off
  };
  
  // Get feedback message
  const getFeedbackMessage = () => {
    if (permissionDenied) {
      return "Microphone access denied";
    }
    
    if (!isListening) {
      return "Press Start to begin";
    }
    
    if (inputVolume < 5) {
      return "No sound detected. Try playing louder";
    }
    
    if (!detectedNote) {
      return "Play a clear, sustained note...";
    }
    
    // Extract just the note letter without the octave for comparison
    const baseDetectedNote = detectedNote.substring(0, detectedNote.length - 1);
    const isMatchingNote = baseDetectedNote === targetNote;
    
    if (!isMatchingNote) {
      return `Play ${targetNote}`;
    }
    
    const absOffset = Math.abs(centsOff);
    if (absOffset < 5) {
      return "Perfect!";
    } else if (centsOff > 0) {
      return `Sharp by ${absOffset} cents`;
    } else {
      return `Flat by ${absOffset} cents`;
    }
  };
  
  // Get volume meter color based on input level
  const getVolumeMeterColor = () => {
    if (inputVolume < 5) return "bg-gray-200";
    if (inputVolume < 30) return "bg-green-300";
    if (inputVolume < 70) return "bg-green-500";
    return "bg-yellow-500";
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-symphoni-primary to-symphoni-secondary text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium">Instrument Tuner</h3>
          <Music className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-6">
          {/* Target Note Selector */}
          <div className="w-full flex flex-col items-center space-y-2">
            <label className="text-sm text-gray-500">Target Note</label>
            <Select value={targetNote} onValueChange={setTargetNote}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NOTES.map(note => (
                  <SelectItem key={note} value={note}>
                    {note}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Volume Meter */}
          {isListening && (
            <div className="w-full max-w-xs">
              <div className="flex items-center space-x-2">
                <VolumeX className="h-4 w-4 text-gray-400" />
                <div className="h-2 flex-grow rounded-full bg-gray-100 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-100 ${getVolumeMeterColor()}`} 
                    style={{ width: `${inputVolume}%` }}
                  />
                </div>
                <Volume2 className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          )}
          
          {/* Tuner Display */}
          <div className="relative w-full max-w-xs h-40 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
            {/* Detected Note Display */}
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className="text-4xl font-bold">
                {detectedNote ? detectedNote.substring(0, detectedNote.length - 1) : "-"}
              </div>
              {detectedNote && (
                <div className="text-sm text-gray-500 mt-1">
                  {detectedFreq ? `${detectedFreq.toFixed(1)} Hz` : ""}
                </div>
              )}
            </div>
            
            {/* Tuner Needle */}
            <div 
              className="absolute bottom-0 left-1/2 w-1 h-1/2 bg-black origin-bottom transform -translate-x-1/2 transition-transform duration-75"
              style={{ 
                transform: `translateX(-50%) rotate(${centsOff * 0.5}deg)`,
                display: detectedNote ? "block" : "none"
              }}
            />
            
            {/* Scale markings */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="w-4/5 flex justify-between px-4">
                <div className="h-4 w-0.5 bg-gray-400"></div>
                <div className="h-2 w-0.5 bg-gray-300"></div>
                <div className="h-2 w-0.5 bg-gray-300"></div>
                <div className="h-4 w-0.5 bg-gray-400"></div>
                <div className="h-2 w-0.5 bg-gray-300"></div>
                <div className="h-2 w-0.5 bg-gray-300"></div>
                <div className="h-4 w-0.5 bg-gray-400"></div>
              </div>
            </div>
          </div>
          
          {/* Cents Display */}
          <div className="w-full max-w-xs">
            <div className="flex justify-between text-xs mb-1">
              <span>-50 cents</span>
              <span>In Tune</span>
              <span>+50 cents</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className={getAccuracyColor()} style={{ 
                width: detectedNote ? "100%" : "0%",
                transition: "background-color 0.2s ease"
              }}></div>
            </div>
          </div>
          
          {/* Feedback Message */}
          <div className="text-center">
            <p className="font-medium text-lg">{getFeedbackMessage()}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center p-6 pt-0">
        <Button 
          onClick={toggleTuner} 
          disabled={!audioSupported}
          variant={isListening ? "destructive" : "default"}
          className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
          size="lg"
        >
          {isListening ? (
            <>
              <MicOff className="h-5 w-5 mr-2" />
              Stop Tuner
            </>
          ) : (
            <>
              <Mic className="h-5 w-5 mr-2" />
              Start Tuner
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
