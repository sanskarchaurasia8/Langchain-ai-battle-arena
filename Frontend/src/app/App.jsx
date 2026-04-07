import { useState, useRef, useEffect } from 'react';
import './App.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import BattlePanel from '../components/BattlePanel';
import ChatSection from '../components/ChatSection';
import WelcomeState from '../components/WelcomeState';
import LoadingState from '../components/LoadingState';

// Mock AI response function — replace with real API call
async function fetchBattleResult(problem) {
  await new Promise(r => setTimeout(r, 2200));
  
  // Return mock data matching the schema
  return {
    problem,
    solution_1: `Here's a simple implementation of a factorial function in JavaScript using both **iterative** and **recursive** approaches:\n\n### 1. **Iterative Approach (Using a Loop)**\n\`\`\`javascript\nfunction factorialIterative(n) {\n    if (n < 0) return NaN; // Factorial of negative numbers is undefined\n    let result = 1;\n    for (let i = 2; i <= n; i++) {\n        result *= i;\n    }\n    return result;\n}\n\nconsole.log(factorialIterative(5)); // Output: 120\n\`\`\`\n\n### 2. **Recursive Approach**\n\`\`\`javascript\nfunction factorialRecursive(n) {\n    if (n < 0) return NaN;\n    if (n === 0 || n === 1) return 1; // Base case\n    return n * factorialRecursive(n - 1);\n}\n\nconsole.log(factorialRecursive(5)); // Output: 120\n\`\`\`\n\n### **Key Notes:**\n- **Factorial of 0 and 1** is \`1\`.\n- **Negative numbers** have no factorial (returns \`NaN\`).\n- **Recursion** is elegant but can cause a stack overflow for very large \`n\`.\n- **Iterative** approach is generally more efficient for large numbers.`,
    solution_2: `Certainly! Below is a simple implementation of a factorial function in JavaScript.\n\n\`\`\`javascript\nfunction factorial(n) {\n    if (n < 0) {\n        throw new Error(\"Factorial is not defined for negative numbers.\");\n    }\n    if (n === 0 || n === 1) {\n        return 1;\n    }\n    let result = 1;\n    for (let i = 2; i <= n; i++) {\n        result *= i;\n    }\n    return result;\n}\n\n// Example usage:\nconsole.log(factorial(5)); // Output: 120\nconsole.log(factorial(0)); // Output: 1\n\`\`\`\n\n### Explanation:\n- **Input Validation**: The function first checks if the input \`n\` is negative. If it is, an error is thrown.\n- **Base Case**: If \`n\` is 0 or 1, the function returns 1.\n- **Iterative Calculation**: For \`n > 1\`, the function initializes \`result\` to 1 and iterates from 2 to \`n\`.\n\n### Recursive Version:\n\`\`\`javascript\nfunction factorialRecursive(n) {\n    if (n < 0) {\n        throw new Error(\"Factorial is not defined for negative numbers.\");\n    }\n    if (n === 0 || n === 1) {\n        return 1;\n    }\n    return n * factorialRecursive(n - 1);\n}\n\nconsole.log(factorialRecursive(5)); // Output: 120\n\`\`\`\n\nBoth versions achieve the same result, but the iterative version is generally more efficient in terms of stack space.`,
    judge: {
      solution_1_score: 10,
      solution_2_score: 9,
      solution_1_reasoning: "Solution 1 is excellent. It provides both iterative and recursive approaches, which is standard for teaching this concept. The code is clean, handles negative inputs by returning `NaN` (consistent with JavaScript's `Math` library behavior), and includes helpful notes about stack overflow and the mention of `BigInt` for large numbers. The logic in the iterative version is concise because it leverages the fact that the loop won't execute for 0 or 1, returning the initial value of 1 correctly without needing an extra conditional check.",
      solution_2_reasoning: "Solution 2 is also very high quality. It provides both versions and includes robust error handling by throwing an explicit Error for negative numbers, which is a valid architectural choice. However, the iterative implementation contains slightly redundant code: the check for `if (n === 0 || n === 1)` is unnecessary because the `for` loop starting at `i = 2` naturally handles those cases. It loses a point only relative to Solution 1, which provided slightly more insight into JS-specific limitations like `BigInt` and stack limits."
    }
  };
}

const EXAMPLE_PROMPTS = [
  'Write a binary search function in Python',
  'Implement a linked list in JavaScript',
  'Create a debounce function in TypeScript',
  'Write a quicksort algorithm in Go',
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [battleResult, setBattleResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeNav, setActiveNav] = useState('arena');

  const handleSend = async (prompt) => {
    const text = prompt || inputValue.trim();
    if (!text || isLoading) return;

    setInputValue('');
    setMessages(prev => [...prev, { type: 'user', text }]);
    setMessages(prev => [...prev, { type: 'system', text: 'Analyzing with both AI models...', isTyping: true }]);
    setIsLoading(true);
    setBattleResult(null);

    try {
      const result = await fetchBattleResult(text);
      setBattleResult(result);
      setMessages(prev =>
        prev.map(m => m.isTyping ? { ...m, text: '✅ Battle complete! View results above.', isTyping: false } : m)
      );
    } catch (err) {
      setMessages(prev =>
        prev.map(m => m.isTyping ? { ...m, text: '❌ Error fetching results. Please try again.', isTyping: false } : m)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewBattle = () => {
    setBattleResult(null);
    setMessages([]);
    setInputValue('');
  };

  return (
    <div className="app-layout">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} onNewBattle={handleNewBattle} />
      <div className="main-content">
        <Header battleResult={battleResult} />
        <div className="battle-area">
          {!battleResult && !isLoading && (
            <WelcomeState examples={EXAMPLE_PROMPTS} onExample={handleSend} />
          )}
          {isLoading && !battleResult && <LoadingState />}
          {battleResult && (
            <BattlePanel result={battleResult} />
          )}
        </div>
        <ChatSection
          messages={messages}
          inputValue={inputValue}
          isLoading={isLoading}
          onInputChange={setInputValue}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
