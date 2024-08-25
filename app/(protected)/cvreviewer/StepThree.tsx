"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useInterviewStore } from "@/utils/store";
// import * as pdfjsLib from "pdfjs-dist/webpack";
// import "pdfjs-dist/web/pdf_viewer.css";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const baseUrl = "https://cv-judger.onrender.com";

interface PDFViewerProps {
  profile: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ profile }) => {
  const { resumeFile, extractedText, structuredData } = useInterviewStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reviewedData, setReviewedData] = useState<any>({});

  async function analyzeResume(endpoint: string, data: any, query: string) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}${query}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) return result;
      return null;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  const runAnalysis = useCallback(
    async (analysisType: string) => {
      let endpoint = "";
      let data: any = {};
      let query = "";

      let result: any = null;

      switch (analysisType) {
        case "quantification_checker":
          endpoint = "/quantification";
          data = {
            extracted_data: structuredData,
          };
          result = await analyzeResume(endpoint, data, query);
          setReviewedData((prevData: any) => ({
            ...prevData,
            quantification_checker: result.message,
          }));
          break;
        case "resume_score":
          endpoint = "/job_description_resume_score";
          data = {
            cv_text_parameter: {
              cv_text: extractedText,
            },
            job_text_parameter: {
              job_text: profile,
            },
          };
          result = await analyzeResume(endpoint, data, query);
          setReviewedData((prevData) => ({
            ...prevData,
            resume_score: result.message,
          }));
          break;
        case "resume_length":
          endpoint = "/resume_length";
          data = {
            text: extractedText,
            experience: "FRESHER",
          };
          result = await analyzeResume(endpoint, data, query);
          setReviewedData((prevData) => ({
            ...prevData,
            resume_length: result.message,
          }));
          break;
        case "bullet_point_length":
          endpoint = "/bullet_point_length";
          data = {
            extracted_data: structuredData,
          };
          result = await analyzeResume(endpoint, data, query);
          setReviewedData((prevData) => ({
            ...prevData,
            bullet_point_length: result.message,
          }));
          break;
        case "bullet_points_improver":
          endpoint = "/bullet_points_improver";
          data = {
            extracted_data: structuredData,
          };
          result = await analyzeResume(endpoint, data, query);
          setReviewedData((prevData) => ({
            ...prevData,
            bullet_points_improver: result.message,
          }));
          break;
        case "total_bullet_points":
          endpoint = "/total_bullet_list";
          query = `?experience=FRESHER`;
          data = {
            extracted_data: structuredData,
          };
          result = await analyzeResume(endpoint, data, query);
          setReviewedData((prevData) => ({
            ...prevData,
            total_bullet_points: result.message,
          }));
          break;
        case "verb_tense_checker":
          endpoint = "/verb_tense";
          data = {
            extracted_data: structuredData,
          };
          query = "";
          result = await analyzeResume(endpoint, data, query);
          setReviewedData((prevData) => ({
            ...prevData,
            verb_tense_checker: result.message,
          }));
          break;
        case "weak_verb_checker":
          endpoint = "/weak_verb_checker";
          data = {
            extracted_data: structuredData,
          };
          result = await analyzeResume(endpoint, data, query);
          setReviewedData((prevData) => ({
            ...prevData,
            weak_verb_checker: result.message,
          }));
          break;
        case "section_checker":
          endpoint = "/section_checker";
          data = {
            extracted_data: structuredData,
          };
          result = await analyzeResume(endpoint, data, query);
          setReviewedData((prevData) => ({
            ...prevData,
            section_checker: result.message,
          }));
          break;
        case "skill_checker":
          endpoint = "/skill_checker";
          data = {
            extracted_data: structuredData,
          };
          query = `?profile=${profile}`;
          result = await analyzeResume(endpoint, data, query);
          setReviewedData((prevData) => ({
            ...prevData,
            skill_checker: result.message,
          }));
          break;
        case "repetition_checker":
          endpoint = "/repetition";
          data = {
            extracted_data: structuredData,
          };
          query = "";
          result = await analyzeResume(endpoint, data, query);
          setReviewedData((prevData) => ({
            ...prevData,
            repetition_checker: result.message,
          }));
          break;
        case "personal_info":
          endpoint = "/personal_info";
          data = {
            extracted_data: structuredData,
          };
          result = await analyzeResume(endpoint, data, query);
          setReviewedData((prevData) => ({
            ...prevData,
            personal_info: result.message,
          }));
          break;
        case "responsibility_checker":
          endpoint = "/responsibility";
          data = {
            extracted_data: structuredData,
          };
          result = await analyzeResume(endpoint, data, query);
          setReviewedData((prevData) => ({
            ...prevData,
            responsibility_checker: result.message,
          }));
          break;
        case "spelling_checker":
          endpoint = "/spelling_checker";
          data = {
            extracted_data: structuredData,
          };
          result = await analyzeResume(endpoint, data, query);
          setReviewedData((prevData) => ({
            ...prevData,
            spelling_checker: result.message,
          }));
          break;
        default:
          console.log("Unknown analysis type");
          return;
      }
    },
    [structuredData, extractedText, profile],
  );

  console.log("Analysis Result:", reviewedData);

  useEffect(() => {
    runAnalysis("resume_score");
  }, [runAnalysis]);

  // useEffect(() => {
  //   const renderPDF = async () => {
  //     if (resumeFile && canvasRef.current) {
  //       let pdfData: Uint8Array | ArrayBuffer | string | undefined;

  //       if (typeof resumeFile === "string") {
  //         pdfData = base64ToUint8Array(resumeFile);
  //       } else if (resumeFile instanceof Blob || resumeFile instanceof File) {
  //         pdfData = await resumeFile.arrayBuffer();
  //       } else if (
  //         resumeFile instanceof Uint8Array ||
  //         resumeFile instanceof ArrayBuffer
  //       ) {
  //         pdfData = resumeFile;
  //       }

  //       if (pdfData) {
  //         const loadingTask = pdfjsLib.getDocument({ data: pdfData });

  //         loadingTask.promise
  //           .then(async (pdf) => {
  //             const page = await pdf.getPage(1);
  //             const viewport = page.getViewport({ scale: 1.5 });
  //             const canvas = canvasRef.current!;
  //             const context = canvas.getContext("2d")!;
  //             canvas.height = viewport.height;
  //             canvas.width = viewport.width;

  //             const renderContext = {
  //               canvasContext: context,
  //               viewport,
  //             };

  //             await page.render(renderContext).promise;
  //           })
  //           .catch((error) => {
  //             console.error("Error loading PDF:", error);
  //           });
  //       } else {
  //         console.error("No valid data found for the resumeFile");
  //       }
  //     }
  //   };

  //   renderPDF();
  // }, [resumeFile]);

  return (
    <div className="flex h-full justify-between items-stretch gap-2 p-2">
      <div className="w-full max-w-[250px] flex flex-col gap-2">
        <div className="bg-white w-full p-8 rounded-lg">
          <CircularProgressbarWithChildren
            strokeWidth={6}
            value={
              reviewedData.resume_score
                ? reviewedData.resume_score.FINAL_SCORE.toFixed(1)
                : 0
            }
            styles={{ path: { stroke: "#8C52FF", strokeLinecap: "round" } }}
          >
            {reviewedData.resume_score &&
              reviewedData.resume_score.FINAL_SCORE.toFixed(1) + "%"}
          </CircularProgressbarWithChildren>
        </div>
        <div className="bg-white h-full p-4 rounded-lg flex-grow">
          <h2 className="text-xl font-bold">Options</h2>
          <div className="flex flex-col w-full gap-2 py-2">
            <div className="">
              Hard Skill:{" "}
              {reviewedData.resume_score &&
                reviewedData.resume_score.DETAILS.HARD_SKILLS_SCORE.score}
            </div>
            <div className="">
              Soft Skill:{" "}
              {reviewedData.resume_score &&
                reviewedData.resume_score.DETAILS.SOFT_SKILLS_SCORE.score}
            </div>
            <div className="">
              Experience Skill:{" "}
              {reviewedData.resume_score &&
                reviewedData.resume_score.DETAILS.EXPERIENCE_SCORE.score}
            </div>
            <div className="">
              Education Skill:{" "}
              {reviewedData.resume_score &&
                reviewedData.resume_score.DETAILS.EDUCATION_SCORE.score}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white p-2 rounded-lg min-h-[calc(100vh-5rem)]">
        <h2 className="text-xl font-bold">Fixes or Corrections</h2>

        <div className="flex flex-wrap justify-center items-start gap-2 py-2">
          <Dialog>
            <DialogTrigger className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
              Quantification Checker
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Quantification Checker</DialogTitle>
                <DialogDescription>
                  <Accordion type="single" collapsible>
                    <AccordionItem value={`item-1`}>
                      {reviewedData["quantification_checker"] !== undefined && (
                        <AccordionTrigger>
                          Needs Quantification
                        </AccordionTrigger>
                      )}
                      {reviewedData["quantification_checker"] !== undefined &&
                        reviewedData["quantification_checker"][
                          "Not Quantify"
                        ].map((data: string, index: number) => {
                          return (
                            <AccordionContent key={index}>
                              {data}
                            </AccordionContent>
                          );
                        })}
                    </AccordionItem>
                    <AccordionItem value={`item-2`}>
                      {reviewedData["quantification_checker"] !== undefined && (
                        <AccordionTrigger>Quantified</AccordionTrigger>
                      )}
                      {reviewedData["quantification_checker"] !== undefined &&
                        reviewedData["quantification_checker"]["Quantify"].map(
                          (data: string, index: number) => {
                            return (
                              <AccordionContent key={index}>
                                {data}
                              </AccordionContent>
                            );
                          },
                        )}
                    </AccordionItem>
                  </Accordion>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
              Bullet Point Length
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bullet Point Length</DialogTitle>
                <DialogDescription>
                  {reviewedData.bullet_point_length !== undefined &&
                  reviewedData.bullet_point_length.length === 0 ? (
                    reviewedData.bullet_point_length.Result.map(
                      (data: string, ind: number) => {
                        return <div key={ind}>{data}</div>;
                      },
                    )
                  ) : (
                    <div>Nothing to Show</div>
                  )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
              Bullet Points Improver
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle> Bullet Points Improver </DialogTitle>
                <DialogDescription>
                  <Accordion type="single" collapsible>
                    {reviewedData.bullet_points_improver !== undefined &&
                      reviewedData.bullet_points_improver.bulletPoints.map(
                        (data, ind: number) => (
                          <AccordionItem value={`item-${ind + 1}`} key={ind}>
                            <AccordionTrigger className="text-left">
                              Original: {data.original}
                            </AccordionTrigger>
                            <AccordionContent>
                              Improved: {data.improved}
                            </AccordionContent>
                          </AccordionItem>
                        ),
                      )}
                  </Accordion>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
              Total Bullet Points
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle> Total Bullet Points </DialogTitle>
                <DialogDescription>
                  {reviewedData.total_bullet_points &&
                    reviewedData.total_bullet_points.Result}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
              Verb Tense Checker
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle> Verb Tense Checker </DialogTitle>
                <DialogDescription>
                  <Accordion type="single" collapsible>
                    {reviewedData.verb_tense_checker !== undefined && (
                      <div>
                        {" "}
                        {Object.keys(reviewedData.verb_tense_checker).map(
                          (key, ind: number) => (
                            <AccordionItem value={`item-${ind + 1}`} key={ind}>
                              <AccordionTrigger className="text-left">
                                {key}
                              </AccordionTrigger>
                              <AccordionContent>
                                Correction:{" "}
                                {
                                  reviewedData.verb_tense_checker[key]
                                    .correction
                                }
                              </AccordionContent>
                              <AccordionContent>
                                Reason:{" "}
                                {reviewedData.verb_tense_checker[key].reason}
                              </AccordionContent>
                              <AccordionContent>
                                Impact:{" "}
                                {reviewedData.verb_tense_checker[key].impact}
                              </AccordionContent>
                            </AccordionItem>
                          ),
                        )}
                      </div>
                    )}
                  </Accordion>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
              Weak Verb Checker
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle> Weak Verb Checker </DialogTitle>
                <DialogDescription>
                  <Accordion type="single" collapsible>
                    {reviewedData.weak_verb_checker !== undefined &&
                      Object.keys(reviewedData.weak_verb_checker).map(
                        (key, ind: number) => (
                          <AccordionItem value={`item-${ind + 1}`} key={ind}>
                            <AccordionTrigger className="text-left">
                              {key}
                            </AccordionTrigger>
                            <AccordionContent>
                              {reviewedData.weak_verb_checker[key].join(", ")}
                            </AccordionContent>
                          </AccordionItem>
                        ),
                      )}
                  </Accordion>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
              Section Checker
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle> Section Checker </DialogTitle>
                <DialogDescription>
                  <Accordion type="single" collapsible>
                    {reviewedData.section_checker !== undefined &&
                      Object.keys(reviewedData.section_checker).map(
                        (key, ind: number) => (
                          <AccordionItem value={`item-${ind + 1}`} key={ind}>
                            <AccordionTrigger className="text-left">
                              {key}
                            </AccordionTrigger>
                            <AccordionContent>
                              {reviewedData.section_checker[key]}
                            </AccordionContent>
                          </AccordionItem>
                        ),
                      )}
                  </Accordion>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
              Skill Checker
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle> Skill Checker </DialogTitle>
                <DialogDescription>
                  <Accordion type="single" collapsible>
                    {reviewedData.skill_checker !== undefined &&
                      Object.keys(reviewedData.skill_checker).map(
                        (key, ind: number) => (
                          <AccordionItem value={`item-${ind + 1}`} key={ind}>
                            <AccordionTrigger className="text-left">
                              {key}
                            </AccordionTrigger>
                            <AccordionContent>
                              {reviewedData.skill_checker[key].join(", ")}
                            </AccordionContent>
                          </AccordionItem>
                        ),
                      )}
                  </Accordion>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
              Repetition Checker
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle> Repetition Checker </DialogTitle>
                <DialogDescription>
                  <Accordion type="single" collapsible>
                    {reviewedData.repetition_checker !== undefined &&
                      Object.keys(reviewedData.repetition_checker).map(
                        (key, ind: number) => (
                          <AccordionItem value={`item-${ind + 1}`} key={ind}>
                            <AccordionTrigger className="text-left">
                              {key}
                            </AccordionTrigger>
                            {key === "score" ? (
                              <AccordionContent>
                                reviewedData.repetition_checker.score
                              </AccordionContent>
                            ) : (
                              <>
                                <AccordionContent>
                                  {reviewedData.repetition_checker[key].text}
                                </AccordionContent>
                                <AccordionContent>
                                  {reviewedData.repetition_checker[key].reason}
                                </AccordionContent>
                              </>
                            )}
                          </AccordionItem>
                        ),
                      )}
                  </Accordion>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
              Personal Info
            </DialogTrigger>
            <DialogContent>
              <DialogTitle> Personal Info </DialogTitle>
              <DialogDescription>
                <Accordion type="single" collapsible>
                  {reviewedData.personal_info !== undefined &&
                    Object.keys(reviewedData.personal_info).map(
                      (key, ind: number) => (
                        <AccordionItem value={`item-${ind + 1}`} key={ind}>
                          <AccordionTrigger className="text-left">
                            {key}
                          </AccordionTrigger>
                          <AccordionContent>
                            {reviewedData.personal_info[key]}
                          </AccordionContent>
                        </AccordionItem>
                      ),
                    )}
                </Accordion>
              </DialogDescription>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
              Responsibilty
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle> Responsibility Checker </DialogTitle>
                <DialogDescription>
                  <Accordion type="single" collapsible>
                    {reviewedData.responsibility_checker !== undefined &&
                      Object.keys(reviewedData.responsibility_checker).map(
                        (key, ind: number) => (
                          <AccordionItem value={`item-${ind + 1}`} key={ind}>
                            <AccordionTrigger className="text-left">
                              {key}
                            </AccordionTrigger>
                            <AccordionContent>
                              Correction:{" "}
                              {
                                reviewedData.responsibility_checker[key]
                                  .correction
                              }
                            </AccordionContent>
                            <AccordionContent>
                              Reason:{" "}
                              {reviewedData.responsibility_checker[key].reason}
                            </AccordionContent>
                          </AccordionItem>
                        ),
                      )}
                  </Accordion>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
              Spelling Checker
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Spelling Checker</DialogTitle>
                <DialogDescription>
                  {reviewedData.spelling_checker &&
                    reviewedData.spelling_checker.Result.join(", ")}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="w-full bg-primary rounded-lg">
        <h2 className="text-xl font-bold">Uploaded CV Preview</h2>
        <canvas ref={canvasRef} className="w-full h-auto max-h-full"></canvas>
      </div>
    </div>
  );
};

export default PDFViewer;
