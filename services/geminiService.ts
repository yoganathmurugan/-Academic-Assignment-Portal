
import { GoogleGenAI } from "@google/genai";
import { Type } from "@google/genai";

if (!process.env.API_KEY) {
  // A mock API key is set here for demonstration purposes.
  // In a real application, this should be a valid key from an environment variable.
  process.env.API_KEY = "MOCK_API_KEY_REPLACE_WITH_REAL_ONE"; 
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AssignmentIdea {
    title: string;
    description: string;
}

export interface AIGradeResponse {
    suggestedGrade: number;
    feedback: string;
}

export async function generateAssignmentIdeas(subject: string, topic: string): Promise<AssignmentIdea[]> {
    const topicPromptPart = topic
        ? `The teacher has suggested an initial topic of interest: "${topic}". The ideas can be for this topic or for other closely related topics within the same unit or module to provide variety.`
        : `The teacher has not provided a specific topic, so suggest ideas covering different important topics from the course.`;

    const prompt = `
        You are an expert curriculum designer for Anna University engineering courses. Your task is to generate assignment ideas for the subject "${subject}".
        ${topicPromptPart}
        
        Based on the typical Anna University syllabus for "${subject}", generate 3 creative and distinct assignment ideas. 
        Focus on practical application or critical thinking.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        ideas: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: {
                                        type: Type.STRING,
                                        description: "A concise title for the assignment."
                                    },
                                    description: {
                                        type: Type.STRING,
                                        description: "A one or two sentence description of the assignment task."
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse.ideas || [];

    } catch (error) {
        console.error("Error generating assignment ideas:", error);
        // In case of a real API key error, Gemini might not respond.
        // We return a mock response for UI demonstration.
        return [
            { title: "Mock Idea 1: Project Proposal", description: "Develop a detailed project proposal on the selected topic, including timeline and resources." },
            { title: "Mock Idea 2: Case Study Analysis", description: "Analyze a real-world case study related to the topic and present your findings." },
            { title: "Mock Idea 3: Practical Implementation", description: "Build a small working prototype or simulation demonstrating key concepts of the topic." },
        ];
    }
}

export async function gradeSubmission(
    assignment: { title: string; description: string; totalMarks: number },
    submissionContent: string // This will be the base64 data URL
): Promise<AIGradeResponse> {
    
    let decodedContent = '';
    try {
        const base64String = submissionContent.split(',')[1];
        if (base64String) {
            decodedContent = atob(base64String);
        } else {
            decodedContent = "Invalid file content format.";
        }
    } catch (e) {
        console.error("Base64 decoding failed:", e);
        decodedContent = "Could not decode file content. It may not be a text file.";
    }

    const prompt = `
        You are an expert teaching assistant for a college course. Your task is to grade a student's assignment submission.

        Assignment Details:
        - Title: "${assignment.title}"
        - Description: "${assignment.description}"
        - Maximum Marks: ${assignment.totalMarks}

        Student's Submission Content:
        ---
        ${decodedContent}
        ---

        Based on the assignment requirements and the student's submission, please provide a suggested grade and constructive feedback.
        The grade must be an integer between 0 and ${assignment.totalMarks}.
        The feedback should be concise, helpful, and 2-3 sentences long.
    `;

    try {
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestedGrade: {
                            type: Type.INTEGER,
                            description: `A suggested grade for the submission, from 0 to ${assignment.totalMarks}.`
                        },
                        feedback: {
                            type: Type.STRING,
                            description: "Concise, constructive feedback for the student."
                        }
                    }
                }
            }
        });

        const jsonResponse = JSON.parse(response.text);
        
        const grade = Math.max(0, Math.min(jsonResponse.suggestedGrade, assignment.totalMarks));

        return {
            suggestedGrade: grade,
            feedback: jsonResponse.feedback || "No feedback was generated."
        };

    } catch (error) {
        console.error("Error generating AI grade:", error);
        return {
            suggestedGrade: Math.round(assignment.totalMarks * 0.8),
            feedback: "This is a mock AI analysis. The submission appears to cover the main points of the assignment effectively. Good work."
        };
    }
}