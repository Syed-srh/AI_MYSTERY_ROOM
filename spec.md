Here is the comprehensive specification sheet for **AI Mystery Room**, designed to serve as the Single Source of Truth (SSOT) for spec-driven development.

# Product Specification Sheet: AI Mystery Room

## 1. Project Overview

**AI Mystery Room** is an interactive web application that transforms a user-provided scenario or story into a playable detective challenge. The backend leverages AI to generate a complete, fake investigation containing suspects, a definitive culprit, and a variety of clues (e.g., WhatsApp message logs, generated images, and camera recording transcripts). The user must review the evidence and correctly identify the culprit.

## 2. Technology Stack

* **Frontend:** React.js (utilizing a modular, component-driven architecture)
* **Styling:** Tailwind CSS (for rapid UI prototyping and responsive design)
* **Backend:** Node.js with Express.js
* **Database:** MongoDB (using Mongoose for schema modeling)
* **AI Integration:** Google Gemini API (handling narrative generation, clue creation, and logic structuring)
* **Authentication/Security (if user accounts are added):** JSON Web Tokens (JWT) for session management and `bcrypt` for password hashing.
* **Utilities:** `date-fns` for formatting timestamps on the generated WhatsApp messages and camera logs.

## 3. Core Features & User Flow

1. **Scenario Input (The Hook):** A clean landing page where the user submits a text prompt (e.g., "A tech billionaire's prototype was stolen at a gala").
2. **AI Generation Engine:**
* The backend sends the prompt to the Gemini API.
* Gemini returns structured JSON containing: the victim, 3-4 suspects, 1 culprit, and a set of evidence (mock WhatsApp chats, image prompts, security cam transcripts).


3. **Investigation Dashboard (The Game):**
* An interactive UI displaying the "Case File".
* **Evidence Tabs:** Users can switch between different proof types (Messages, Images, Camera Feeds).


4. **Culprit Selection (The Resolution):** A selection form where the user submits their accusation. The app validates this against the backend's hidden truth and displays a win/loss screen with the AI's explanation of the mystery.

## 4. System Architecture

### 4.1 Database Schema (MongoDB / Mongoose)

**Mystery Model:**

* `_id`: ObjectId
* `userScenario`: String (The original prompt)
* `storyline`: String (The AI-generated context)
* `suspects`: Array of Objects `[{ id, name, description, motive }]`
* `culpritId`: String (Hidden from frontend during gameplay)
* `evidence`: Object
* `whatsappLogs`: Array of Objects `[{ sender, receiver, timestamp, message }]`
* `images`: Array of Objects `[{ url, description }]` *(Can use Gemini to generate image prompts, then pipe to an image generation API, or use placeholder illustrations)*
* `camRecordings`: Array of Objects `[{ timestamp, transcript/description }]`


* `status`: String (enum: 'generating', 'ready', 'solved', 'failed')

### 4.2 REST API Endpoints

* **`POST /api/mystery/generate`**
* **Payload:** `{ "scenario": "string" }`
* **Action:** Calls Gemini to generate the case. Saves to MongoDB.
* **Response:** `{ "mysteryId": "12345", "status": "generating" }`


* **`GET /api/mystery/:id`**
* **Action:** Fetches the mystery details for the dashboard.
* **Response:** Returns the `Mystery` object (excluding `culpritId`).


* **`POST /api/mystery/:id/accuse`**
* **Payload:** `{ "suspectId": "string" }`
* **Action:** Compares provided ID with the database's `culpritId`.
* **Response:** `{ "success": boolean, "explanation": "string" }`



## 5. AI Prompting Strategy (Gemini)

To ensure the Codex/AI assistant builds the integration correctly, the system prompt sent to Gemini from the Node.js backend must force a strict JSON response.

**System Prompt Template for Gemini:**

> "You are a mystery game generator. Based on the user's scenario: '{user_scenario}', create a murder/theft investigation. You must return ONLY a valid JSON object with the following structure:
> * 'storyline': A brief intro.
> * 'suspects': Array of 3 people with names and motives.
> * 'culprit': The exact name of the guilty suspect.
> * 'evidence': An object containing 'whatsappLogs' (array of text exchanges), 'camRecordings' (array of textual descriptions of video footage), and 'imageClues' (visual descriptions of evidence). Ensure the clues logically point to the culprit without being too obvious."
> 
> 

## 6. Development Milestones for Codex

1. **Setup & Initialization:** Scaffold the MERN stack application, configure Tailwind CSS, and set up environment variables for MongoDB and the Gemini API key.
2. **Backend AI Integration:** Build the Express routes and implement the Gemini API call using the structured prompt above. Ensure the response is parsed and saved to MongoDB.
3. **Frontend UI Components:** Build the React components for the Scenario Input form, the Loading state (while AI generates), and the interactive Investigation Dashboard.
4. **Gameplay Loop & State Management:** Connect the frontend to the backend endpoints, handling the data flow from scenario submission to culprit accusation.