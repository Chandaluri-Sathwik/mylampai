"use client";
import React, { useState, DragEvent, ChangeEvent, useRef } from "react";
import StepOneTwo from "./StepOneTwo"; // Adjust the path if necessary
import { useInterviewStore } from "@/utils/store";
import PDFViewer from "./StepThree";

const Page: React.FC = () => {
  const { resumeFile, setResumeFile, setJobDescriptionFile, structuredData } =
    useInterviewStore();
  const [step, setStep] = useState(1);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualJobDescription, setManualJobDescription] = useState("");
  const [profile, setProfile] = useState<string>("SOFTWARE");
  const [selectedOption, setSelectedOption] = useState("");
  const [customProfile, setCustomProfile] = useState("");

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
    setFile: (file: File) => void
  ) => {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const handleResumeUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const triggerFileInput = (inputId: string) => {
    const inputElement = document.getElementById(
      inputId
    ) as HTMLInputElement | null;
    if (inputElement) {
      inputElement.click();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleNextClick = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBackClick = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleJobDescriptionUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target?.files?.[0];
    if (file) {
      setJobDescriptionFile(file);
    }
  };

  const handleManualEntryToggle = () => {
    setIsManualEntry(true);
    setJobDescriptionFile(null);
  };

  const handleUploadJDToggle = () => {
    setIsManualEntry(false);
    setManualJobDescription("");
  };

  const handleManualJDUpload = () => {
    if (manualJobDescription.trim()) {
      setJobDescriptionFile(
        new File([manualJobDescription], "manual-jd.txt", {
          type: "text/plain",
        })
      );
    }
  };

  console.log("structured Data", structuredData);

  const pdfUrl = "./Resume.pdf";

  return (
    <div className="w-full m-auto min-h-[calc(100vh-4rem)]">
      {step === 1 || step === 2 ? (
        <StepOneTwo
          step={step}
          setStep={setStep}
          handleDrop={handleDrop}
          handleResumeUpload={handleResumeUpload}
          triggerFileInput={triggerFileInput}
          handleDragOver={handleDragOver}
          handleNextClick={handleNextClick}
          handleBackClick={handleBackClick}
          handleJobDescriptionUpload={handleJobDescriptionUpload}
          handleManualEntryToggle={handleManualEntryToggle}
          handleUploadJDToggle={handleUploadJDToggle}
          handleManualJDUpload={handleManualJDUpload}
          isManualEntry={isManualEntry}
          manualJobDescription={manualJobDescription}
          setManualJobDescription={setManualJobDescription}
          customProfile={customProfile}
          setCustomProfile={setCustomProfile}
        />
      ) : (
        <PDFViewer profile={profile} />
      )}
    </div>
  );
};

export default Page;
