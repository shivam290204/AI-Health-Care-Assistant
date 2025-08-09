# AI Health Assistant 🩺


An AI-powered health assistant designed to make complex medical information accessible. This web app simplifies medical reports, answers health questions, and provides safe, actionable advice with features like a symptom planner and meal generator. It empowers users to understand their health and take a more active role in their well-being.

## 🌟 Features

This application is built as a single-page web app with several key features:

* **Health Chat:** A conversational AI chatbot where users can ask general health-related questions.
* **Medical Report Analyzer:** Allows users to paste text from medical reports to get a simplified summary of key findings, explained in plain language.
* **Lifestyle Advisor:**
    * **Symptom Action Plan:** Users can describe their symptoms to receive a general, safe action plan, including home care suggestions and indicators for when to see a doctor.
    * **AI Meal Planner:** Generates a sample one-day meal plan based on the user's dietary goals, preferences, and health conditions.

## 🛠️ Tech Stack

* **Frontend:** HTML, Tailwind CSS
* **Logic:** JavaScript
* **Core AI:** Google Gemini API

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need a modern web browser and a code editor (like [VS Code](https://code.visualstudio.com/)).

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/shivam290204/Ai-Health-Care-Assistant.git](https://github.com/shivam290204/Ai-Health-Care-Assistant.git)
    ```
2.  **Get a Google Gemini API Key**
    * Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
    * Click "**Create API key**" and copy the generated key.
3.  **Add the API Key to the project**
    * Open the `index.html` file.
    * Find the `<script>` tag at the bottom of the file.
    * Locate the following line:
        ```javascript
        const apiKey = ""; // Handled by environment
        ```
    * Paste your API key inside the quotation marks:
        ```javascript
        const apiKey = "YOUR_API_KEY_HERE";
        ```
4.  **Run the application with a local server**
    * You cannot run this project by opening the HTML file directly in the browser due to CORS policy restrictions on API requests.
    * **If you are using VS Code**, the easiest way is to install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
    * After installation, right-click the `index.html` file and select "**Open with Live Server**". This will open the project in your browser on a local server.

## Usage

Once the application is running in your browser:

1.  Use the **Health Chat** tab for general questions.
2.  Switch to the **Analyze Medical Report** tab to paste and simplify report text.
3.  Navigate to the **Lifestyle Advisor** tab to get a symptom action plan or generate a meal plan.

---

### ⚠️ Important Disclaimer

This AI is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

---

## 🗺️ Roadmap

Based on the initial project plan, future improvements could include:

* **User Accounts:** To save chat history and personalized data.
* **Database Integration:** Using a service like Firebase to store user information securely.
* **B2B Licensing:** Creating a white-label version for hospitals or insurance companies.
* **Chronic Condition Tracking:** Tools for users to monitor ongoing conditions like diabetes or hypertension.

## 📄 License

Distributed under the MIT License. See `LICENSE.txt` for more information.
