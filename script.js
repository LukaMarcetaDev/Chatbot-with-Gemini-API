import { GoogleGenerativeAI } from "@google/generative-ai";

const portfolioInfo = `

Portfolio Information:
Website: www.yourportfolio.com

About Me:
I am a frontend developer specializing in JavaScript, Webflow, and UI/UX design. I create responsive and interactive websites optimized for performance.  
I work on various JavaScript projects, including web applications, interactive UI components, animations, and API integrations.
My goal is to build scalable, high-performance solutions that enhance user experience.g in JavaScript, Webflow, and UI/UX design. 
I create responsive and interactive websites optimized for performance.

Skills:
- HTML, CSS, JavaScript
- Webflow, Figma
- UI/UX Design, Responsive Design
- Animations & Interactivity

FAQs:
General:

**What services do you offer?**  
I specialize in frontend development, Webflow design, and UI/UX design. I build custom, interactive websites, optimize performance, and develop JavaScript-powered features such as animations, API integrations, and interactive UI components.  

**Can you work on existing Webflow projects?**  
Yes! I can improve the design and functionality of existing Webflow sites, add custom interactions using JavaScript, or build entirely new projects from scratch.  

**Do you develop custom JavaScript features?**  
Absolutely! I create dynamic components, custom animations (GSAP, Framer Motion), form validation, API integrations, and more to enhance website interactivity.  

**Do you integrate APIs into websites?**  
Yes, I work with REST APIs and JSON data to enable dynamic content loading, real-time data display, and seamless third-party service integrations.  

**Do you offer performance optimization?**  
Yes! I can improve website loading speed, reduce unnecessary code, enhance SEO performance, and ensure the best possible user experience.  

**How can I contact you?**  
You can reach me via email at **contact@yourportfolio.com** or directly through my website.  


Tone Instructions:
Conciseness: Keep responses short and to the point.
Formality: Use a friendly but professional tone.
Clarity: Avoid technical jargon unless necessary.
Consistency: Ensure all responses align in tone and style.


`;

const API_KEY = "AIzaSyAF-eEX0N5DEmevazll0fX0DJG6ddLMpgs";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: portfolioInfo,
});

let messages = {
  history: [],
};

async function sendMessage() {
  console.log(messages);
  const userMessage = document.querySelector(".chat-window input").value;

  if (userMessage.length) {
    try {
      document.querySelector(".chat-window input").value = "";
      document.querySelector(".chat-window .chat").insertAdjacentHTML(
        "beforeend",
        `
                <div class="user">
                    <p>${userMessage}</p>
                </div>
            `
      );

      document.querySelector(".chat-window .chat").insertAdjacentHTML(
        "beforeend",
        `
                <div class="loader"></div>
            `
      );

      const chat = model.startChat(messages);

      let result = await chat.sendMessageStream(userMessage);

      document.querySelector(".chat-window .chat").insertAdjacentHTML(
        "beforeend",
        `
                <div class="model">
                    <p></p>
                </div>
            `
      );

      let modelMessages = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        modelMessages = document.querySelectorAll(
          ".chat-window .chat div.model"
        );
        modelMessages[modelMessages.length - 1]
          .querySelector("p")
          .insertAdjacentHTML(
            "beforeend",
            `
                ${chunkText}
            `
          );
      }

      messages.history.push({
        role: "user",
        parts: [{ text: userMessage }],
      });

      messages.history.push({
        role: "model",
        parts: [
          {
            text: modelMessages[modelMessages.length - 1].querySelector("p")
              .innerHTML,
          },
        ],
      });
    } catch (error) {
      document.querySelector(".chat-window .chat").insertAdjacentHTML(
        "beforeend",
        `
                <div class="error">
                    <p>The message could not be sent. Please try again.</p>
                </div>
            `
      );
    }

    document.querySelector(".chat-window .chat .loader").remove();
  }
}

document
  .querySelector(".chat-window .input-area button")
  .addEventListener("click", () => sendMessage());

document.querySelector(".chat-button").addEventListener("click", () => {
  document.querySelector("body").classList.add("chat-open");
});

document
  .querySelector(".chat-window button.close")
  .addEventListener("click", () => {
    document.querySelector("body").classList.remove("chat-open");
  });
