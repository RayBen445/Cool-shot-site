import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCode2 } from "lucide-react";

export default function Templates() {
  const [, setLocation] = useLocation();

  const templates = [
    {
      id: "basic",
      name: "Basic HTML Page",
      description: "A simple HTML5 boilerplate with a centered layout and basic typography.",
      code: {
        html: `<div class="container">\n  <h1>Welcome to CSSLab</h1>\n  <p>This is a basic template to get you started.</p>\n  <button id="clickMe">Click Me</button>\n</div>`,
        css: `body {\n  font-family: system-ui, sans-serif;\n  background: #f3f4f6;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n}\n\n.container {\n  background: white;\n  padding: 2rem;\n  border-radius: 8px;\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n  text-align: center;\n}\n\nbutton {\n  background: #3b82f6;\n  color: white;\n  border: none;\n  padding: 0.5rem 1rem;\n  border-radius: 4px;\n  cursor: pointer;\n  margin-top: 1rem;\n}\n\nbutton:hover {\n  background: #2563eb;\n}`,
        js: `document.getElementById('clickMe').addEventListener('click', () => {\n  console.log('Button clicked!');\n  alert('Hello from CSSLab!');\n});`
      }
    },
    {
      id: "css-animation",
      name: "CSS Animation",
      description: "A spinning cube animation using pure CSS 3D transforms.",
      code: {
        html: `<div class="scene">\n  <div class="cube">\n    <div class="face front">Front</div>\n    <div class="face back">Back</div>\n    <div class="face right">Right</div>\n    <div class="face left">Left</div>\n    <div class="face top">Top</div>\n    <div class="face bottom">Bottom</div>\n  </div>\n</div>`,
        css: `body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n  background: #111827;\n  color: white;\n  font-family: sans-serif;\n}\n\n.scene {\n  width: 200px;\n  height: 200px;\n  perspective: 600px;\n}\n\n.cube {\n  width: 100%;\n  height: 100%;\n  position: relative;\n  transform-style: preserve-3d;\n  animation: spin 5s infinite linear;\n}\n\n.face {\n  position: absolute;\n  width: 200px;\n  height: 200px;\n  background: rgba(59, 130, 246, 0.5);\n  border: 2px solid #3b82f6;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-size: 2rem;\n  font-weight: bold;\n}\n\n.front  { transform: rotateY(0deg) translateZ(100px); }\n.back   { transform: rotateY(180deg) translateZ(100px); }\n.right  { transform: rotateY(90deg) translateZ(100px); }\n.left   { transform: rotateY(-90deg) translateZ(100px); }\n.top    { transform: rotateX(90deg) translateZ(100px); }\n.bottom { transform: rotateX(-90deg) translateZ(100px); }\n\n@keyframes spin {\n  0% { transform: rotateX(0deg) rotateY(0deg); }\n  100% { transform: rotateX(360deg) rotateY(360deg); }\n}`,
        js: `console.log("3D CSS Animation loaded.");`
      }
    },
    {
      id: "js-counter",
      name: "JavaScript Counter",
      description: "A simple counter widget that demonstrates state management in vanilla JS.",
      code: {
        html: `<div class="counter-widget">\n  <h2>Counter</h2>\n  <div class="display">0</div>\n  <div class="controls">\n    <button id="dec">-</button>\n    <button id="reset">Reset</button>\n    <button id="inc">+</button>\n  </div>\n</div>`,
        css: `body {\n  font-family: sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n  background: #1f2937;\n  color: #f3f4f6;\n}\n\n.counter-widget {\n  background: #374151;\n  padding: 2rem;\n  border-radius: 12px;\n  text-align: center;\n  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);\n}\n\n.display {\n  font-size: 4rem;\n  font-weight: bold;\n  margin: 1.5rem 0;\n  color: #60a5fa;\n}\n\n.controls { display: flex; gap: 0.5rem; justify-content: center; }\n\nbutton {\n  background: #4b5563;\n  color: white;\n  border: none;\n  padding: 0.5rem 1rem;\n  font-size: 1.25rem;\n  border-radius: 6px;\n  cursor: pointer;\n}\n\nbutton:hover { background: #6b7280; }\nbutton:active { transform: scale(0.95); }`,
        js: `let count = 0;\nconst display = document.querySelector('.display');\n\ndocument.getElementById('inc').addEventListener('click', () => {\n  count++;\n  display.textContent = count;\n  console.log('Incremented to:', count);\n});\n\ndocument.getElementById('dec').addEventListener('click', () => {\n  count--;\n  display.textContent = count;\n  console.log('Decremented to:', count);\n});\n\ndocument.getElementById('reset').addEventListener('click', () => {\n  count = 0;\n  display.textContent = count;\n  console.log('Reset counter');\n});`
      }
    }
  ];

  const handleOpenTemplate = (templateData: any) => {
    sessionStorage.setItem("csslab-template", JSON.stringify(templateData));
    setLocation("/lab");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Templates</h1>
          <p className="text-gray-400 text-lg">Kickstart your next project with a pre-built template.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <Card key={template.id} className="bg-gray-900 border-gray-800 text-white hover:border-blue-500/50 transition-colors duration-300">
              <CardHeader>
                <div className="w-10 h-10 rounded bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400">
                  <FileCode2 className="w-5 h-5" />
                </div>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-950 p-3 rounded-md border border-gray-800 text-xs font-mono text-gray-500 flex space-x-2">
                  <span className={template.code.html ? "text-blue-400" : ""}>HTML</span>
                  <span>•</span>
                  <span className={template.code.css ? "text-purple-400" : ""}>CSS</span>
                  <span>•</span>
                  <span className={template.code.js ? "text-yellow-400" : ""}>JS</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleOpenTemplate(template.code)}
                >
                  Open in Lab
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
