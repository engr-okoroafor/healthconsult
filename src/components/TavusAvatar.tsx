import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Loader, AlertCircle, Activity, Heart, Brain, Stethoscope } from 'lucide-react';
import { tavusService } from '../services/tavusService';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  description: string;
  icon: string;
  tavus_replica_id: string;
  tavus_persona_id: string;
  is_premium: boolean;
}

interface TavusAvatarProps {
  doctor: Doctor;
  symptoms?: string;
  onConversationStart?: (conversationId: string) => void;
  onConversationEnd?: () => void;
  className?: string;
}

const TavusAvatar: React.FC<TavusAvatarProps> = ({
  doctor,
  symptoms,
  onConversationStart,
  onConversationEnd,
  className = ''
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [replicaStatus, setReplicaStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (isConnected) {
      intervalRef.current = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isConnected]);

  useEffect(() => {
    if (doctor && tavusService.isConfigured()) {
      loadReplicaStatus();
    }
  }, [doctor]);

  // Initialize audio visualization
  useEffect(() => {
    if (isConnected && !isMuted) {
      initializeAudioVisualization();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isConnected, isMuted]);

  const initializeAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average / 255);
          if (isConnected) {
            requestAnimationFrame(updateAudioLevel);
          }
        }
      };
      updateAudioLevel();
    } catch (error) {
      console.error('Failed to initialize audio visualization:', error);
    }
  };

  const loadReplicaStatus = async () => {
    if (!doctor) return;
    
    try {
      const status = await tavusService.getReplicaStatus(doctor.tavus_replica_id);
      setReplicaStatus(status);
      if (status.thumbnail_video_url) {
        setAvatarUrl(status.thumbnail_video_url);
      }
    } catch (error) {
      console.error('Failed to load replica status:', error);
    }
  };

  const startConversation = async () => {
    if (!tavusService.isConfigured()) {
      setError('Tavus API key not configured. Please check your settings.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const conversation = await tavusService.startConsultation(
        doctor.tavus_replica_id,
        doctor.tavus_persona_id
      );

      setConversationId(conversation.conversation_id);
      setIsConnected(true);
      setSessionDuration(0);
      setIsListening(true);
      
      if (onConversationStart) {
        onConversationStart(conversation.conversation_id);
      }

      // Initialize video stream if available
      if (conversation.video_url && videoRef.current) {
        videoRef.current.src = conversation.video_url;
      }
    } catch (error: any) {
      console.error('Failed to start conversation:', error);
      setError(error.message || 'Failed to start conversation');
    } finally {
      setIsConnecting(false);
    }
  };

  const endConversation = async () => {
    if (!conversationId) return;

    setIsConnecting(true);
    setIsListening(false);
    try {
      await tavusService.endConsultation(conversationId);
      setIsConnected(false);
      setConversationId(null);
      setSessionDuration(0);
      
      if (onConversationEnd) {
        onConversationEnd();
      }
    } catch (error: any) {
      console.error('Failed to end conversation:', error);
      setError(error.message || 'Failed to end conversation');
    } finally {
      setIsConnecting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative bg-gradient-to-br from-slate-900 via-blue-900/20 to-cyan-900/20 rounded-3xl border border-cyan-400/30 shadow-2xl shadow-cyan-500/20 overflow-hidden ${className}`}>
      {/* Futuristic Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(34, 211, 238, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Header with Medical HUD */}
      <div className="relative p-6 border-b border-cyan-400/20 bg-gradient-to-r from-slate-800/50 to-blue-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/30">
                {doctor.icon}
              </div>
              {isConnected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-slate-900"></div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">{doctor.name}</h3>
              <p className="text-cyan-400 font-medium">{doctor.specialty}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Activity className="h-3 w-3 text-green-400" />
                <span className="text-xs text-green-400">AI-Powered Medical Assistant</span>
              </div>
            </div>
          </div>
          
          {/* Medical Status Indicators */}
          <div className="flex items-center space-x-4">
            {isConnected && (
              <>
                <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg px-3 py-2">
                  <Heart className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-white font-mono">{formatTime(sessionDuration)}</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg px-3 py-2">
                  <Brain className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-purple-400">ACTIVE</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Audio Visualization */}
        {isConnected && isListening && (
          <div className="mt-4 flex items-center justify-center space-x-1">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-full"
                animate={{
                  height: [4, 8 + (audioLevel * 20), 4],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Video Interface */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-blue-900 overflow-hidden">
        {/* Holographic Scan Lines */}
        <div className="absolute inset-0 pointer-events-none"></div>

        {!isConnected && !isConnecting && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-md">
              <motion.div
                className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/50"
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(34, 211, 238, 0.5)",
                    "0 0 25px rgba(34, 211, 238, 0.6)",
                    "0 0 20px rgba(34, 211, 238, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-3xl">{doctor.icon}</span>
              </motion.div>
              
              <h4 className="text-2xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {doctor.name}
              </h4>
              <p className="text-cyan-200 mb-6 leading-relaxed">{doctor.description}</p>
              
              {symptoms && (
                <motion.div 
                  className="bg-slate-800/60 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-4 mb-6 text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Stethoscope className="h-4 w-4 text-cyan-400" />
                    <p className="text-xs text-cyan-400 font-medium">PATIENT SYMPTOMS</p>
                  </div>
                  <p className="text-sm text-white">{symptoms.substring(0, 150)}...</p>
                </motion.div>
              )}
              
              <motion.button
                onClick={startConversation}
                disabled={isConnecting}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg shadow-cyan-500/20 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isConnecting ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Initializing Neural Link...</span>
                  </>
                ) : (
                  <>
                    <Phone className="h-5 w-5" />
                    <span>Begin Medical Consultation</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        )}

        {isConnecting && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
            <div className="text-center text-white">
              <motion.div
                className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-xl font-bold mb-2">Establishing Neural Connection</p>
              <p className="text-cyan-400">Connecting to Dr. {doctor.name}...</p>
              <div className="mt-4 flex justify-center space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {isConnected && (
          <>
            {avatarUrl ? (
              <video
                ref={videoRef}
                src={avatarUrl}
                className="w-full h-full object-cover"
                autoPlay
                muted={isMuted}
                style={{ display: isVideoEnabled ? 'block' : 'none' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-transparent to-blue-400/10 animate-pulse"></div>
                <div className="text-center z-10">
                  <motion.div
                    className="text-8xl mb-6 filter drop-shadow-2xl"
                    animate={{ 
                      textShadow: [
                        "0 0 20px rgba(34, 211, 238, 0.8)",
                        "0 0 40px rgba(34, 211, 238, 1)",
                        "0 0 20px rgba(34, 211, 238, 0.8)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {doctor.icon}
                  </motion.div>
                  <p className="text-cyan-400 font-mono text-lg mb-2">Medical AI Avatar Online</p>
                  <div className="flex justify-center space-x-2">
                    <Activity className="h-4 w-4 text-yellow-400 animate-pulse" />
                    <span className="text-yellow-400 text-sm">Neural Processing Active</span>
                  </div>
                </div>
              </div>
            )}
            
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    className="text-6xl mb-4 filter drop-shadow-lg"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {doctor.icon}
                  </motion.div>
                  <p className="text-cyan-400 font-mono text-sm">Video Disabled - Audio Only</p>
                </div>
              </div>
            )}

            {/* Medical HUD Overlay */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
              <div className="bg-slate-900/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-xs text-cyan-400">
                  <Activity className="h-3 w-3" />
                  <span>VITAL SIGNS MONITORING</span>
                </div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-sm border border-green-400/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-xs text-green-400">
                  <Brain className="h-3 w-3" />
                  <span>AI ANALYSIS ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Enhanced Controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
              <motion.button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full transition-all duration-300 backdrop-blur-sm border ${
                  isMuted 
                    ? 'bg-red-500/80 border-red-400 hover:bg-red-400/80' 
                    : 'bg-slate-800/80 border-cyan-400/50 hover:bg-slate-700/80'
                } text-white shadow-lg`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </motion.button>
              
              <motion.button
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                className={`p-4 rounded-full transition-all duration-300 backdrop-blur-sm border ${
                  !isVideoEnabled 
                    ? 'bg-red-500/80 border-red-400 hover:bg-red-400/80' 
                    : 'bg-slate-800/80 border-cyan-400/50 hover:bg-slate-700/80'
                } text-white shadow-lg`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </motion.button>
              
              <motion.button
                onClick={endConversation}
                disabled={isConnecting}
                className="p-4 rounded-full bg-red-500/80 hover:bg-red-400/80 border border-red-400 text-white transition-all duration-300 backdrop-blur-sm shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <PhoneOff className="h-5 w-5" />
              </motion.button>
            </div>
          </>
        )}
      </div>

      {/* Error Display with Medical Styling */}
      {error && (
        <motion.div 
          className="p-4 bg-red-900/50 border-t border-red-500/50 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-300">Medical System Error</p>
              <p className="text-xs text-red-400 mt-1">{error}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TavusAvatar;