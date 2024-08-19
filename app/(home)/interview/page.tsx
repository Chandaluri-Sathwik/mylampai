"use client";
import React, { useState, useRef, useEffect } from 'react';
import { IoDocumentAttach } from "react-icons/io5";
import AudioToText from "./recording";
import { FiMic, FiSpeaker, FiVideo, FiMessageSquare } from "react-icons/fi";
import useInterviewStore from './store';
import Image from "next/image"
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaRegFileAlt } from "react-icons/fa";
import { toast } from 'sonner';

const InterviewComponent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { resumeFile, setResumeFile, jobDescriptionFile, setJobDescriptionFile } = useInterviewStore();
  const [step, setStep] = useState(1);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualJobDescription, setManualJobDescription] = useState('');
  const [selectedJobProfile, setSelectedJobProfile] = useState('');
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isSoundTesting, setIsSoundTesting] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isMicTestEnabled, setIsMicTestEnabled] = useState(false);
  const [cvText, setCvText] = useState('');
  const [JD, setJD] = useState('');
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [audioTextInputs, setAudioTextInputs] = useState([]);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
 
  const [textToSpeak, setTextToSpeak] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const rafIdRef = useRef(null);
  

  const allDevicesConfigured = isCameraEnabled && isMicEnabled && isSoundEnabled;

  const websocketRef = useRef<WebSocket | null>(null);


  const waitForSocketConnection = (socket) => {
    return new Promise((resolve) => {
      if (socket.readyState === WebSocket.OPEN) {
        resolve();
      } else {
        socket.onopen = () => {
          console.log("WebSocket connection opened");
          resolve();
        };
      }
    });
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !websocketRef.current) {
      websocketRef.current = new WebSocket("wss://ai-interviewer-c476.onrender.com/ws");

      waitForSocketConnection(websocketRef.current).then(() => {
        console.log("WebSocket is ready to send messages");
      });

      websocketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "cv_uploaded") {
          toast.success("CV uploaded Successfully")
          console.log("CV uploaded:", data.message);
          setCvText(data.cv_text);  // Update the state with CV text
        } else if (data.type === "jd_analyzed") {
          console.log("Job description analyzed:", data.message);
          setJD(data.job_description);  // Update the state with JD text

        } else if (data.type === "interview_question") {
          console.log("Interview question received:", data.question);
          setChatMessages((prevMessages) => [...prevMessages, { user: "Interviewer", message: data.question }]);
          setTextToSpeak(data.question);
        } else if (data.type === "interview_end") {
          console.log("Interview ended:", data.message);
          setChatMessages((prevMessages) => [...prevMessages, { user: "System", message: data.message }]);
        } else if (data.type === "analysis") {
          console.log("Analysis result received:", data.result);
          setChatMessages((prevMessages) => [...prevMessages, { user: "Analysis", message: JSON.stringify(data.result) }]);
        }
      };

      websocketRef.current.onclose = () => {
        console.log("WebSocket connection closed");
      };

      websocketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
  }, [isMounted]);

  const handleSendMessage = (message) => {
    if (message.trim() !== "") {
      setChatMessages((prevMessages) => [...prevMessages, { user: "You", message }]);
      websocketRef.current?.send(JSON.stringify({ type: "answer", answer: message }));
    }
  };
  const handleTextSubmit = (text) => {
    setAudioTextInputs((prevInputs) => [...prevInputs, text]); // Store the audio-to-text input
    websocketRef.current?.send(
      JSON.stringify({
        type: "answer",
        answer: text,
      })
    );
    setChatMessages((prevMessages) => [...prevMessages, { user: "You", message: text }]);
  };

  const handleUploadJDToggle = () => {
    setIsManualEntry(false);
    setManualJobDescription("");
  };

  const handleSpeak = () => {
    if (!textToSpeak) return;

    console.log("Speak function called with text:", textToSpeak);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    setIsSpeaking(true);

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (textToSpeak) {
      console.log("Text to Speak:", textToSpeak);
      handleSpeak();
    }
  }, [textToSpeak]);




const handleDrop = (event, setFile) => {
    // Prevent the default behavior (Prevent file from being opened in the browser)
    event.preventDefault();
    
    // Get the files from the drop event
    const files = event.dataTransfer?.files;
    
    if (files && files.length > 0) {
        const file = files[0];
        
        if (file && (file.type === "application/pdf" || 
                     file.type === "application/msword" || 
                     file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
            // Update the state with the file
            setFile(file);

            // Optionally, you can trigger the file upload process here
            // For example, you could call handleResumeUpload with the file
            handleResumeUpload({ target: { files: [file] } });
        } else {
            alert("Please upload a valid DOC, DOCX, or PDF file.");
        }
    }
};

// Make sure you define handleResumeUpload in a way that can handle file input
const handleResumeUpload = async (event) => {
    const file = event.target?.files?.[0];
    
    if (file && (file.type === "application/pdf" || 
                 file.type === "application/msword" || 
                 file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {

        setResumeFile(file); // Set the resume file state
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            const binaryData = e.target?.result;
            console.log("Resume binary data:", binaryData); // Debugging log

            if (binaryData) {
                // Ensure WebSocket is ready
                await waitForSocketConnection(websocketRef.current);

                // Send the binary data via WebSocket
                websocketRef.current?.send(
                    JSON.stringify({
                        type: "upload_cv",
                        cv_data: Array.from(new Uint8Array(binaryData)),
                    })
                );

                setCvText("Uploaded");

                // Check if JD is also uploaded before starting the interview
                if (JD) {
                    startInterview();
                }
            }
        };

        reader.readAsArrayBuffer(file);
    } else {
        alert("Please upload a valid DOC, DOCX, or PDF file.");
        setResumeFile(null);
        setCvText(""); // Optionally reset CV text
    }
};


const isResumeUploaded = !!resumeFile; 




  const handleJobDescriptionUpload = async (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setJobDescriptionFile(file);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const binaryData = event.target.result;
        console.log("JD binary data:", binaryData); // Debugging log

        await waitForSocketConnection(websocketRef.current); // Ensure WebSocket is ready
        websocketRef.current?.send(
          JSON.stringify({
            type: "analyze_jd",
            job_description: Array.from(new Uint8Array(binaryData)),
          })
        );
        setJD("Uploaded");

        // Check if CV is also uploaded
        if (cvText) {
          startInterview();
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid DOC, DOCX, or PDF file.");
    }
  };

  const startInterview = () => {
    if (cvText && JD) {
        console.log('Starting interview with:', { cvText, JD });
        waitForSocketConnection(websocketRef.current).then(() => {
            console.log('WebSocket is ready to send start_interview');
            websocketRef.current?.send(
                JSON.stringify({
                    type: "start_interview",
                    pdf_text: cvText, // Use actual cvText
                    job_description: JD, // Use actual JD
                })
            );
            setIsInterviewStarted(true);  // Set interview started state
        }).catch(err => {
            console.error('Failed to start interview:', err);
        });
    } else {
        console.error("CV or JD not uploaded, cannot start interview.");
    }
};



  const handleNextClick = () => {
    if (step === 3 && allDevicesConfigured) {
      if (!cvText || !JD) {
        alert("Please upload both the CV and Job Description before starting the interview.");
        return;
      }
      startInterview();
    } else {
      setStep(step + 1);
    }
  };



  const handleBackClick = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation(); // Prevent default behavior to allow dropping
  };

  const handleManualEntryToggle = () => {
    setIsManualEntry(true);
    setJobDescriptionFile(null);
  };


  const triggerFileInput = (inputId) => {
    // Trigger the file input click
    document.getElementById(inputId)?.click();

    // Check if both CV and Job Description are uploaded
    if (cvText && JD) {
        // Start the interview and set the state
        startInterview();
    } else {
        console.error("CV or JD not uploaded, cannot start the interview.");
    }
};




  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    if ((isCameraEnabled || isInterviewStarted) && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          console.log("Camera enabled: Stream acquired");
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
          alert("Unable to access camera: " + err.message);
        });
    } else if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [isCameraEnabled, isInterviewStarted]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleCameraToggle = () => {
    setIsCameraEnabled(!isCameraEnabled);
  };

  const handleMicToggle = (e) => {
    if (e.target.checked) {
      startMicrophoneTest();
      setIsMicTestEnabled(true);
    } else {
      setIsMicEnabled(false);
      stopMicrophoneTest();
    }
  };

  const handleJobProfileSelect = (event) => {
    setSelectedJobProfile(event.target.value);
  };
  

  const handleSoundToggle = (e) => {
    setIsSoundEnabled(e.target.checked);
    if (e.target.checked) {
      setIsSoundTesting(true);
      playTestSound();
    } else {
      setIsSoundTesting(false);
      stopTestSound();
    }
  };

  const playTestSound = () => {
    if (audioRef.current) {
      console.log("Playing sound");
      audioRef.current.src = "/sounds/audio.mp3";
      audioRef.current.play().then(() => {
        console.log("Sound started successfully");
      }).catch((error) => {
        console.error("Error playing sound: ", error);
      });
    }
  };

  const stopTestSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleMicTestConfirmation = () => {
    setIsMicTestEnabled(false);
    setIsMicEnabled(true);
    stopMicrophoneTest();
  };

  const handleSoundConfirmation = () => {
    stopTestSound();
    setIsSoundEnabled(true);
    setIsSoundTesting(false);
  };

  const startMicrophoneTest = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;
        setMicActive(true);
        updateVolume();
      })
      .catch((err) => {
        console.error("Error accessing microphone: ", err);
        alert("Unable to access microphone: " + err.message);
      });
  };

  const updateVolume = () => {
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    const volume = dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length;
    setVolume(volume);
    rafIdRef.current = requestAnimationFrame(updateVolume);
  };

  const stopMicrophoneTest = () => {
    cancelAnimationFrame(rafIdRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setMicActive(false);
    setVolume(0);
  };

  useEffect(() => {
    return () => {
      stopMicrophoneTest();
    };
  }, []);

  const [activeTab, setActiveTab] = useState('conversation');

  if (!isMounted) {
    return null;
  }

  const handleManualJDUpload = () => {
    if (manualJobDescription.trim() !== "") {
      setJD(manualJobDescription.trim());
  
      // Send the manually entered JD to the WebSocket
      websocketRef.current?.send(
        JSON.stringify({
          type: "analyze_jd",
          job_description: manualJobDescription.trim(),
        })
      );
  
      // You can also add a condition to automatically start the interview if the CV is also uploaded
      if (cvText) {
        startInterview();
      }
    } else {
      alert("Please fill in the job description.");
    }
  };
  

  if (isInterviewStarted) {
    return (
      <div className="min-h-screen flex flex-col relative">
        {/* Navbar */}
        <nav className="flex justify-between items-center bg-white shadow-md p-4">
          <div className="flex items-center">
            <img src="/path_to_your_logo.svg" alt="wiZe Logo" className="h-8 w-8 mr-2" />
            <span className="text-xl font-semibold text-purple-600">wiZe</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 text-sm mr-4" id="status"></span>
            <button className="mr-4" onClick={() => setIsChatOpen(!isChatOpen)}>
              <FiMessageSquare className="w-6 h-6 text-gray-600" />
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={() => window.close()} // Close the tab
            >
              End Interview
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex justify-center items-center bg-gray-100 overflow-hidden h-screen">
          <video
            ref={videoRef}
            className="w-full h-full max-w-screen max-h-screen object-cover rounded-lg shadow-lg transform scale-75"
            autoPlay
            muted
          />
        </div>

        {/* Microphone enabled: Display AudioToText */}
        {isMicEnabled && <AudioToText onTextSubmit={handleTextSubmit} />} {/* Display when mic is enabled */}

        {/* Prompt Box */}
        {isChatOpen && (
          <div className="absolute top-20 right-6 bg-white border border-gray-300 shadow-lg rounded-lg w-96 h-1/2 flex flex-col">
            <div className="flex justify-between items-center bg-purple-600 text-white p-4 rounded-t-lg">
              <span className="font-semibold text-lg">Prompt Box</span>
              <button onClick={() => setIsChatOpen(false)} className="text-white text-2xl">
                &times;
              </button>
            </div>

            {/* Tabs for switching between sections */}
            <div className="flex border-b border-gray-300">
              <button
                className={`flex-1 text-center p-2 ${activeTab === 'conversation' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setActiveTab('conversation')}
              >
                Conversation
              </button>
              <button
                className={`flex-1 text-center p-2 ${activeTab === 'audioToText' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setActiveTab('audioToText')}
              >
                Audio-to-Text
              </button>
            </div>

            {/* Content Sections */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'conversation' && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Conversation</h3>
                  {chatMessages.map((chat, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded-md mb-2">
                      <span className="font-semibold">{chat.user}: </span>
                      <span>{chat.message}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'audioToText' && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Audio-to-Text Inputs</h3>
                  {audioTextInputs.map((text, index) => (
                    <div key={index} className="bg-gray-200 p-2 rounded-md">
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input and Buttons Container */}
            <div className="p-4 bg-gray-100 border-t border-gray-300">
              <input
                id="answerInput"
                type="text"
                placeholder="Type your answer here"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none mb-2"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const answer = e.target.value;
                    handleSendMessage(answer);
                    e.target.value = "";
                  }
                }}
              />
              <div className="flex justify-between">
                <button
                  id="sendAnswerButton"
                  className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 focus:ring-4 focus:ring-primary-foreground transition"
                  onClick={() => {
                    const answer = document.getElementById("answerInput").value;
                    if (answer) {
                      handleSendMessage(answer);
                      document.getElementById("answerInput").value = "";
                    }
                  }}
                >
                  Send Answer
                </button>
                <button
                  id="getAnalysisButton"
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition"
                  onClick={() => {
                    websocketRef.current?.send(
                      JSON.stringify({
                        type: "get_analysis",
                      })
                    );
                  }}
                >
                  Get Analysis
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="md:h-[calc(100vh-4rem)] h-[130vh] bg-primary-foreground flex items-center md:justify-center justify-top w-full border-[#eeeeee] ">
      {/* Step 1: Upload Resume */}
      {step === 1 && (
        <div className="max-w-[1200px] md:gap-4 w-full flex flex-col md:flex-row justify-between ">
          {/* Left Section */}
          <div className="w-full max-w-[90vw] md:max-w-[350px] lg:max-w-[450px] md:w-[50vw] flex flex-col items-center justify-end bg-primary shadow-lg text-white rounded-3xl p-10 relative ml-[5vw] mr-[5vw] md:ml-8 xl:ml-0">
            <Image src={"/images/Globe.svg" } className='w-full h-auto' alt="image" width={100} height={100}></Image>
            <div className="relative flex flex-col items-center mt-auto">
              <h2 className="text-xl font-bold text-center leading-snug">Take the wiZe AI mock Interview</h2>
              <p className="mt-2 text-center text-sm leading-relaxed">
                You&apos;ll be taking a 20-minute interview to have your skills evaluated. Just relax and take the interview. <span className="font-semibold"> All the best!</span>
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:max-w-[500px] max-h-full lg:max-w-[700px] overflow-x-hidden flex flex-col items-center justify-center bg-primary-foreground p-10 mr-8 lg:mr-0">
            <div ><p className='text-2xl font-bold text-primary mb-2'>Get Started!</p></div>

            <div className="flex mx-auto items-center max-w-[450px] justify-center mb-2 w-full">
              {/* Progress Bar */}
              <div className="relative flex-1">
              <div className={`w-8 h-8 ${isResumeUploaded ? 'bg-purple-500' : 'bg-gray-400'} rounded-full flex items-center justify-center`}>
            {isResumeUploaded ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
            ) : (
                <div className="w-3 h-3 bg-white rounded-full"></div>
            )}
        </div>
                <div className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${resumeFile ? 'bg-primary w-full' : 'bg-gray-400 w-full'} z-0`}></div>
              </div>
              {/* Step 2 */}
              <div className="relative flex-1">
                <div className={`w-8 h-8 ${jobDescriptionFile || isManualEntry ? 'bg-primary' : 'bg-gray-400'} rounded-full flex items-center justify-center`}>
                  {(jobDescriptionFile || isManualEntry) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                <div className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${jobDescriptionFile || isManualEntry ? 'bg-primary w-full' : 'bg-gray-400 w-full'} z-0`}></div>
              </div>
              {/* Step 3 */}
              <div className="relative  flex items-center">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>



            <div className="text-center mb-6 mt-3 w-[100%]">
              <h3 className="text-2xl font-bold text-gray-800">Upload your latest CV/Resume</h3>
            </div>

            {/* Upload Section */}
            <div className="bg-white  py-4 px-8 rounded-3xl w-full md:max-w-[350px] lg:max-w-[400px]  shadow-lg text-center">
              <div className="flex items-center justify-center text-primary mb-5 relative top-0 text-[2vw]">
                <IoDocumentAttach />
              </div>

              <div
                className="border-dashed border-2 border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center bg-white "
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, setResumeFile)}
              >
                <p className="text-gray-500 mt-2 text-sm">Drag & Drop or</p>
                <label
                  htmlFor="resumeUpload"
                  className="text-gray-500 cursor-pointer text-sm"
                >
                  Click to <span className="font-semibold text-gray-700 ">Upload Resume</span>
                </label>
                <input
                  id="resumeUpload"
                  type="file"
                  accept=".doc,.docx,.pdf"
                  className="hidden"
                  onChange={handleResumeUpload}
                />

                <div className="text-4xl mt-3 text-gray-300">
                <IoCloudUploadOutline />
                </div>

                <p className="text-gray-400 text-sm mt-3">Supported file formats: DOC, DOCX, PDF. File size limit 10 MB.</p>
              </div>

              {/* Upload Button */}
              <div className="flex justify-center mt-2">
                <button
                  className="bg-primary text-1vw md:w-[20vw] relative text-white font-bold py-3 px-3 rounded-xl hover:bg-primary focus:ring-4 focus:ring-primary-foreground transition"
                  onClick={() => triggerFileInput('resumeUpload')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  Upload Resume
                </button>
              </div>

            </div>
            <div className="mt-8 w-full px-4 flex flex-col items-center">
              <button
                className={`w-[40vw]  xl:w-[32vw] md:max-w-[700px] h-full text-lg font-bold py-6 rounded-lg focus:ring-4 focus:ring-gray-200 transition ${resumeFile ? 'bg-gray-600 text-black hover:bg-gray-800 text-white' : 'bg-gray-300 text-gray-800 cursor-not-allowed'}`}
                disabled={!resumeFile}
                onClick={handleNextClick}
              >
                Next
              </button>
              <button
                className="bg-transparent text-gray-700 w-full font-semibold py-3 mt-2 rounded-lg hover:text-gray-900 focus:ring-4 focus:ring-gray-200 transition"
                onClick={handleBackClick}
                disabled={step === 1}
              >
                Back
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Step 2: Upload Job Description */}
      {step === 2 && (
        <div className="max-w-[1200px] gap-4 w-full flex flex-col md:flex-row justify-between ">
          {/* Left Section */}
          <div className="w-full max-w-[90vw] md:max-w-[350px] lg:max-w-[450px] md:w-[50vw] flex flex-col items-center justify-end bg-primary shadow-lg text-white rounded-3xl p-10 relative ml-[5vw] mr-[5vw] md:ml-8 xl:ml-0">
            <Image src={"/images/Globe.svg" } className='w-full h-auto' alt="image" width={100} height={100}></Image>
            <div className="relative flex flex-col items-center mt-auto">
              <h2 className="text-xl font-bold text-center leading-snug">Take the wiZe AI mock Interview</h2>
              <p className="mt-2 text-center text-sm leading-relaxed">
                You&apos;ll be taking a 20-minute interview to have your skills evaluated. Just relax and take the interview. <span className="font-semibold"> All the best!</span>
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:max-w-[500px]  lg:max-w-[700px] overflow-x-hidden flex flex-col items-center justify-center bg-primary-foreground p-10 mr-8 lg:mr-0">
            <div className="w-full flex flex-col items-center mb-2">
            <div ><p className='text-2xl font-bold text-primary mb-2'>Get Started!</p></div>
            <div className="flex mx-auto items-center max-w-[450px] justify-center mb-2 w-full">
              {/* Progress Bar */}
              <div className="relative flex-1">
                <div className={`w-8 h-8 ${resumeFile ? 'bg-primary' : 'bg-gray-400'} rounded-full flex items-center justify-center`}>
                  {(resumeFile) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                <div className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${resumeFile ? 'bg-primary w-full' : 'bg-gray-400 w-full'} z-0`}></div>
              </div>
              {/* Step 2 */}
              <div className="relative flex-1">
                <div className={`w-8 h-8 ${jobDescriptionFile || isManualEntry ? 'bg-primary' : 'bg-gray-400'} rounded-full flex items-center justify-center`}>
                  {(jobDescriptionFile || isManualEntry) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                <div className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${jobDescriptionFile || isManualEntry ? 'bg-primary w-full' : 'bg-gray-400 w-full'} z-0`}></div>
              </div>
              {/* Step 3 */}
              <div className="relative  flex items-center">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            </div>
            <h3 className="text-2xl mb-6 font-bold text-gray-800">Choose your Interview Profile</h3>

            <div className="bg-white  py-4 px-8 rounded-3xl w-full md:max-w-[350px] lg:max-w-[400px]  shadow-lg text-center">

              <div className="w-full flex justify-center mb-6">
                <button
                  className={`px-6 py-2 font-semibold ${!isManualEntry ? 'text-white bg-primary' : 'text-primary bg-gray-100'} rounded-lg focus:outline-none`}
                  onClick={handleUploadJDToggle}
                >
                  Upload JD
                </button>
                <button
                  className={`px-6 py-2 font-semibold ${isManualEntry ? 'text-white bg-primary' : 'text-primaary bg-gray-100'} rounded-lg focus:outline-none`}
                  onClick={handleManualEntryToggle}
                >
                  Fill Manually
                </button>
              </div>

              {isManualEntry ? (
                <div className="w-full p-4 bg-white rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center mb-8">
                <textarea
                  className="w-full h-28 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-center placeholder:text-gray-500"
                  placeholder="Write or paste here complete job details (Word limit 1000 words)"
                  maxLength={1000}
                  value={manualJobDescription}
                  onChange={(e) => setManualJobDescription(e.target.value)}
                />
                <p className="text-gray-400 text-sm mt-2">Word limit 1000 words.</p>
                <div className="w-full text-center mt-4">
                  <button
                    onClick={handleManualJDUpload}
                    className="bg-purple-500 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:bg-purple-600 focus:outline-none"
                  >
                    Upload JD
                  </button>
                </div>
              </div>
             
              ) : (
                <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white " onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, setJobDescriptionFile)}>
                  <div className="text-4xl mb-3 text-gray-300">
                <IoCloudUploadOutline />
                </div>
                  <p className="text-gray-500 mb-2">Drag & Drop or</p>
                  <label htmlFor="jobDescriptionUpload" className="text-gray-500 cursor-pointer">
                    Click to <span className="font-semibold text-gray-700">Upload Job Description</span>
                  </label>
                  <input id="jobDescriptionUpload" type="file" accept=".doc,.docx,.pdf" className="hidden" onChange={handleJobDescriptionUpload} />
                  <p className="text-gray-400 text-sm mt-3">Supported file formats: DOC, DOCX, PDF. File size limit 10 MB.</p>
                </div>
              )}
              
            </div>
            <div className="mt-8 w-full px-4 flex flex-col items-center">
                <button
                  
                  className={`w-[40vw]  xl:w-[32vw] md:max-w-[700px] h-full text-lg font-bold py-6 rounded-lg focus:ring-4 focus:ring-gray-200 transition ${(jobDescriptionFile || (isManualEntry && manualJobDescription)) ? 'bg-gray-600 text-black hover:bg-gray-800 text-white' : 'bg-gray-300 text-gray-800 cursor-not-allowed'}`}
                  disabled={!jobDescriptionFile && !(isManualEntry && manualJobDescription)}
                  onClick={handleNextClick}
                >
                  Next
                </button>
                <button className="bg-transparent text-gray-700 w-full font-semibold py-3 mt-2 rounded-lg hover:text-gray-900 focus:ring-4 focus:ring-gray-200 transition" onClick={handleBackClick}>
                  Back
                </button>
              </div>
          </div>
        </div>
      )}

      {/* Step 3: Configure Devices */}
      {step === 3 && (
        <div className="max-w-[1200px] gap-4 w-full flex flex-col md:flex-row justify-between ">
          {/* Left Section */}
          <div className="w-full max-w-[90vw] md:max-w-[350px] lg:max-w-[450px] md:w-[50vw] flex flex-col items-center justify-end bg-primary shadow-lg text-white rounded-3xl p-10 relative ml-[5vw] mr-[5vw] md:ml-8 xl:ml-0">
            <video ref={videoRef} autoPlay className="w-full bg-black rounded-lg h-56 mb-2"></video>
            <div className="flex justify-between w-full text-sm mb-32">
              <span className="flex items-center">
                <FiMic className="w-5 h-5 mr-1" />
                Default - External Mic
              </span>
              <span className="flex items-center">
                <FiSpeaker className="w-5 h-5 mr-1" />
                Default - External Speaker
              </span>
              <span className="flex items-center">
                <FiVideo className="w-5 h-5 mr-1" />
                Default - Web Cam
              </span>
            </div>
            <p className="text-center text-lg font-bold leading-relaxed">
              Take the wiZe AI mock Interview
            </p>
            <p className="text-center text-sm mt-2 leading-relaxed">
              You'll be taking a 20-minute interview to have your skills evaluated. Just relax and take the interview. <span className="font-semibold"> All the best!</span>
            </p>
          </div>

          {/* Right Section */}
          <div className="w-full md:max-w-[500px]  lg:max-w-[700px] overflow-x-hidden flex flex-col items-center justify-center bg-primary-foreground p-10 mr-8 lg:mr-0">
            <div ><p className='text-2xl font-bold text-primary mb-2'>Get Started!</p></div>
            <div className="flex mx-auto items-center max-w-[450px] justify-center mb-2 w-full">
              {/* Progress Bar */}
              <div className="relative flex-1">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out bg-primary w-full z-0`}></div>
              </div>
              {/* Step 2 */}
              <div className="relative flex-1">
                <div className={`w-8 h-8 ${jobDescriptionFile || isManualEntry ? 'bg-primary' : 'bg-gray-400'} rounded-full flex items-center justify-center`}>
                  {(jobDescriptionFile || isManualEntry) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                <div className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${jobDescriptionFile || isManualEntry ? 'bg-primary w-full' : 'bg-gray-400 w-full'} z-0`}></div>
              </div>
              {/* Step 3 */}
              <div className="relative">
                <div className={`w-8 h-8 ${allDevicesConfigured ? 'bg-primary' : 'bg-gray-400'} rounded-full flex items-center justify-center`}>
                  {(allDevicesConfigured) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center text-center mt-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Ready to join? Configure Devices</h2>
            </div>
            <div className="bg-white  py-4 px-8 rounded-3xl w-full md:max-w-[350px] lg:max-w-[400px]  shadow-lg text-center">
              {!isMicTestEnabled && !isSoundTesting && (
                <div className="w-full flex flex-col items-center justify-center">


                  <div className="w-full max-w-md flex-col flex gap-4 justify-evenly py-4">
                    <div className="flex items-center justify-between pt-6 pb-6 pr-8 pl-8 border-dashed border-2 border-gray-400 rounded-2xl">
                      <span className="flex items-center gap-2">
                        <FiVideo className="h-6 w-6" />
                        Enable Camera
                      </span>
                      <input
                        type="checkbox"
                        className="form-checkbox h-6 w-6 text-purple-600 "
                        checked={isCameraEnabled}
                        onChange={handleCameraToggle}
                      />
                    </div>
                    <div className="flex items-center justify-between pt-6 pb-6 pr-8 pl-8 border-dashed border-2 border-gray-400 rounded-2xl">
                      <span className="flex items-center gap-2">
                        <FiMic className="h-6 w-6" />
                        Enable Microphone
                      </span>
                      <input type="checkbox" className="form-checkbox h-6 w-6 text-purple-600" checked={isMicEnabled} onChange={handleMicToggle} />
                    </div>
                    <div className="flex items-center justify-between pt-6 pb-6 pr-8 pl-8 border-dashed border-2 border-gray-400 rounded-2xl">
                      <span className="flex items-center gap-2">
                        <FiSpeaker className="h-6 w-6" />
                        Enable Speaker
                      </span>
                      <input type="checkbox" className="form-checkbox h-6 w-6 text-purple-600" checked={isSoundEnabled} onChange={handleSoundToggle} />
                    </div>
                  </div>
                </div>

              )}

              {isMicTestEnabled && (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="w-full px-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Test your microphone</h2>
                    <div className="text-center mb-4">
                      <img src="/path_to_your_image.svg" alt="wiZe AI" className="mx-auto mb-2" />
                      <p className="text-gray-600">You're audible</p>
                    </div>
                    <audio ref={audioRef} src="/path_to_audio_file.mp3" className="hidden"></audio>
                    <div className="relative mb-4">
                      <select className="block w-full py-2 pl-3 pr-10 text-base border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-3xl border-2 py-4">
                        <option>Default - External Speaker</option>
                        <option>Default - Internal Speaker</option>
                        <option>Bluetooth Speaker</option>
                      </select>
                    </div>
                    <p className="text-lg font-semibold text-gray-500 underline cursor-pointer mb-4">Facing issues? Report here.</p>
                    <button
                      className="bg-primary text-white font-bold py-4 px-4 rounded-xl hover:bg-purple-600 focus:ring-4 focus:ring-primary-foreground transition w-64"
                      onClick={handleMicTestConfirmation}
                    >
                      My mic is working
                    </button>
                  </div>
                </div>
              )}

              {isSoundTesting && (
                <div className="w-full h-[95%] flex flex-col items-center justify-center rounder-2xl">
                  <div className="w-full px-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Test your speakers</h2>
                    <div className="text-center mb-4">
                      <img src="/path_to_your_image.svg" alt="wiZe AI" className="mx-auto mb-2" />
                      <p className="text-gray-600">WizeAI is speaking</p>
                    </div>
                    <audio ref={audioRef} src="/path_to_audio_file.mp3" className="hidden" autoPlay></audio>
                    <div className="relative mb-4">
                      <select className="block w-full py-2 pl-3 pr-10 text-base border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-3xl border-2 py-4">
                        <option>Default - External Speaker</option>
                        <option>Default - Internal Speaker</option>
                        <option>Bluetooth Speaker</option>
                      </select>
                    </div>
                    <p className="text-lg font-semibold text-gray-500 underline cursor-pointer mb-4">Facing issues? Report here.</p>
                    <button
                      className="bg-primary text-white font-bold py-4 px-4 rounded-xl hover:bg-purple-600 focus:ring-4 focus:ring-primary-foreground transition w-64"
                      onClick={handleSoundConfirmation}
                    >
                      I can hear the sound
                    </button>
                  </div>
                </div>

              )}
            </div>
            <div className="mt-8 w-full px-4 flex flex-col items-center">
                <button
                  
                  className={`w-[40vw]  xl:w-[32vw] md:max-w-[700px] h-full text-lg font-bold py-6 rounded-lg focus:ring-4 focus:ring-gray-200 transition ${allDevicesConfigured ? 'bg-gray-600 text-black hover:bg-gray-800 text-white' : 'bg-gray-300 text-gray-800 cursor-not-allowed'}`}
                  disabled={!allDevicesConfigured}
                  onClick={handleNextClick}
                >
                  Next
                </button>
                <button className="bg-transparent text-gray-700 w-full font-semibold py-3 mt-2 rounded-lg hover:text-gray-900 focus:ring-4 focus:ring-gray-200 transition" onClick={handleBackClick}>
                  Back
                </button>
              </div>
          </div>

        </div>
      )}
    </div>
  )

};

export default InterviewComponent;
//in this code when i open step 1, the progress bar is already showing completion of the first step even though i have not uploaded any document, similar for other steps. in step 2 the 2nd step of progress bar shows completed when i press to even though i have not uploaded job profile fill manually. maybe problem with useeffect cleanup function. please fix this and rewrite the whole code for me