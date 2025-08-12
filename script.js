
        // Tab switching logic
        const tabs = {
            chat: { btn: document.getElementById('tab-chat'), section: document.getElementById('chat-section') },
            report: { btn: document.getElementById('tab-report'), section: document.getElementById('report-section') },
            advisor: { btn: document.getElementById('tab-advisor'), section: document.getElementById('advisor-section') }
        };

        Object.keys(tabs).forEach(key => {
            tabs[key].btn.addEventListener('click', () => {
                // Deactivate all
                Object.values(tabs).forEach(tab => {
                    tab.btn.classList.remove('tab-btn-active');
                    tab.btn.classList.add('tab-btn-inactive');
                    tab.section.classList.add('hidden');
                });
                // Activate clicked
                tabs[key].btn.classList.add('tab-btn-active');
                tabs[key].btn.classList.remove('tab-btn-inactive');
                tabs[key].section.classList.remove('hidden');
            });
        });

        // Chatbot logic
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const chatContainer = document.getElementById('chat-container');
        let chatHistory = [];

        sendBtn.addEventListener('click', handleSendMessage);
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleSendMessage();
        });

        async function handleSendMessage() {
            const userMessage = chatInput.value.trim();
            if (!userMessage) return;

            appendMessage(userMessage, 'user');
            chatInput.value = '';
            
            setLoading(true);
            appendMessage('...', 'ai'); // Show loading indicator

            const systemInstruction = `You are an AI Health Assistant. Provide helpful, safe, and general informational responses. Do NOT provide a medical diagnosis or treatment plan. If a query is complex, sensitive, or requires a diagnosis, strongly advise consulting a healthcare professional. Always conclude your response with the disclaimer: "This is for informational purposes only. Please consult a healthcare professional for medical advice."`;

            try {
                const aiResponse = await callGeminiAPI(userMessage, chatHistory, systemInstruction);
                
                removeLoadingBubble();
                appendMessage(aiResponse, 'ai'); // Append actual response
                
                chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
                chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });

            } catch (error) {
                console.error("Error calling Gemini API:", error);
                removeLoadingBubble();
                appendMessage("Sorry, I'm having trouble connecting. Please try again later.", 'ai'); // Append error
            } finally {
                setLoading(false); // Re-enable inputs
            }
        }
        
        // Report Analyzer logic
        const analyzeBtn = document.getElementById('analyze-btn');
        analyzeBtn.addEventListener('click', async () => {
            const reportText = document.getElementById('report-input').value.trim();
            if (!reportText) return;
            const outputDiv = document.getElementById('analysis-output');
            setLoadingState(analyzeBtn, outputDiv, true, 'Analyzing...');
            try {
                const systemInstruction = `You are an AI medical report analyzer. Your task is to analyze medical report text. Do not include any personal information in your analysis. Summarize the key findings in simple, easy-to-understand language. Explain what the different sections or values mean in a general context. Highlight any results that are outside of the normal range and suggest that these specific points should be discussed with a doctor. Do NOT provide a diagnosis or a treatment plan. Structure the output clearly with headings. Start the entire response with a bolded disclaimer: "**Disclaimer: This is an AI-powered analysis and is not a substitute for professional medical interpretation. Please consult your doctor to discuss your report in full.**"`;
                const analysis = await callGeminiAPI(reportText, [], systemInstruction);
                outputDiv.innerHTML = `<div class="p-4 bg-gray-100 rounded-lg border border-gray-200">${formatResponse(analysis)}</div>`;
            } catch (error) {
                handleApiError(error, outputDiv, "analysis");
            } finally {
                analyzeBtn.disabled = false;
                analyzeBtn.textContent = 'Analyze Report';
            }
        });

        // Symptom Checker Logic
        const symptomBtn = document.getElementById('symptom-btn');
        symptomBtn.addEventListener('click', async () => {
            const symptomText = document.getElementById('symptom-input').value.trim();
            if(!symptomText) return;
            const outputDiv = document.getElementById('symptom-output');
            setLoadingState(symptomBtn, outputDiv, true, 'Generating Plan...');
            try {
                const systemInstruction = `You are an AI Health Assistant. Your task is to create a safe, general action plan based on user-described symptoms. The plan should include: 1. A "Home Care Suggestions" section with safe, general advice (e.g., rest, hydration). 2. A "When to See a Doctor" section with clear indicators of when professional medical help is necessary (e.g., symptoms worsen, high fever persists). Do NOT diagnose the condition. Start with a bolded disclaimer: "**Disclaimer: This is not a medical diagnosis. These are general suggestions. Please consult a healthcare professional for an accurate diagnosis and treatment.**"`;
                const plan = await callGeminiAPI(symptomText, [], systemInstruction);
                outputDiv.innerHTML = `<div class="p-4 bg-gray-100 rounded-lg border border-gray-200">${formatResponse(plan)}</div>`;
            } catch (error) {
                handleApiError(error, outputDiv, "action plan generation");
            } finally {
                symptomBtn.disabled = false;
                symptomBtn.textContent = 'Get Action Plan';
            }
        });

        // Meal Planner Logic
        const mealBtn = document.getElementById('meal-btn');
        mealBtn.addEventListener('click', async () => {
            const goal = document.getElementById('meal-goal').value.trim();
            const prefs = document.getElementById('meal-prefs').value.trim();
            const dislikes = document.getElementById('meal-dislikes').value.trim();
            const conditions = document.getElementById('meal-conditions').value.trim();
            if(!goal) return;
            const outputDiv = document.getElementById('meal-output');
            setLoadingState(mealBtn, outputDiv, true, 'Generating Plan...');
             try {
                const userPrompt = `Create a sample 1-day meal plan for a user with the following details:\n- Goal: ${goal}\n- Dietary Preferences: ${prefs || 'None'}\n- Foods to Avoid: ${dislikes || 'None'}\n- Health Conditions to Consider: ${conditions || 'None'}`;
                const systemInstruction = `You are an AI meal planner. Your task is to create a sample 1-day meal plan based on user goals and preferences. The plan should be structured with "Breakfast", "Lunch", "Dinner", and "Snacks" sections. For each meal, provide a simple recipe or food items. Add a "Tips for Success" section with 2-3 general tips related to the user's goal. Start with a bolded disclaimer: "**Disclaimer: This is a sample plan and not a substitute for advice from a registered dietitian or doctor. Consult a professional for personalized nutritional guidance.**"`;
                const mealPlan = await callGeminiAPI(userPrompt, [], systemInstruction);
                outputDiv.innerHTML = `<div class="p-4 bg-gray-100 rounded-lg border border-gray-200">${formatResponse(mealPlan)}</div>`;
            } catch (error) {
                handleApiError(error, outputDiv, "meal plan generation");
            } finally {
                mealBtn.disabled = false;
                mealBtn.textContent = '✨ Generate Meal Plan';
            }
        });

        // --- Helper Functions ---
        function appendMessage(message, sender) {
            const messageWrapper = document.createElement('div');
            messageWrapper.classList.add('flex', sender === 'user' ? 'justify-end' : 'justify-start');
            const messageBubble = document.createElement('div');
            messageBubble.classList.add('chat-bubble', sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai', 'p-3', 'rounded-lg');
            if (sender === 'ai' && message === '...') {
                messageBubble.innerHTML = '<div class="flex items-center justify-center space-x-1"><div class="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div><div class="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style="animation-delay: 0.2s;"></div><div class="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style="animation-delay: 0.4s;"></div></div>';
            } else {
                 messageBubble.innerHTML = formatResponse(message);
            }
            messageWrapper.appendChild(messageBubble);
            chatContainer.appendChild(messageWrapper);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        function formatResponse(text) {
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
        }
        
        function setLoading(isLoading) {
            sendBtn.disabled = isLoading;
            chatInput.disabled = isLoading;
        }

        function removeLoadingBubble() {
            const loadingBubble = Array.from(chatContainer.querySelectorAll('.chat-bubble-ai')).pop();
            if (loadingBubble && loadingBubble.innerHTML.includes('animate-pulse')) {
                loadingBubble.parentElement.remove();
            }
        }

        function setLoadingState(button, outputDiv, isLoading, loadingText) {
            button.disabled = isLoading;
            if (isLoading) {
                button.textContent = loadingText;
                outputDiv.innerHTML = `<div class="p-4 bg-gray-50 rounded-lg text-center text-gray-500">${loadingText}</div>`;
            }
        }

        function handleApiError(error, outputDiv, context) {
            console.error(`Error during ${context}:`, error);
            outputDiv.innerHTML = `<div class="p-4 bg-red-100 rounded-lg text-red-700 border border-red-200">Sorry, an error occurred during ${context}. Please try again.</div>`;
        }
        
        async function callGeminiAPI(prompt, history = [], systemInstruction = null) {
            console.log("Calling Gemini API...");
            const apiKey = "AIzaSyA8xHDxhL3LmvxnwBG2k54b9uAJaW_plOA"; // Handled by environment
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            
            const payload = { 
                contents: [...history, { role: "user", parts: [{ text: prompt }] }] 
            };

            if (systemInstruction) {
                payload.systemInstruction = {
                    parts: [{ text: systemInstruction }]
                };
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
            const result = await response.json();
            if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
                return result.candidates[0].content.parts[0].text;
            } else {
                if (result.promptFeedback?.blockReason) {
                    console.error("Prompt blocked:", result.promptFeedback.blockReason);
                    return "I cannot respond to that query as it violates safety guidelines. Please ask a different health-related question.";
                }
                return "I'm sorry, I couldn't generate a response. Please try rephrasing your question.";
            }
        }

   



