import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

const MintSenseBar = ({ onExtracted, group, mode = "expense", summaryText = "" }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(summaryText);

  const handleAI = async () => {
    if (!input && mode === "expense") return;

    setLoading(true);
    setResult('');
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) throw new Error("Missing VITE_GROQ_API_KEY. Add it to .env file.");

      const names = group.participants.map(p => p.name).join(', ');

      const systemPrompt = mode === "expense"
        ? `You are MintSense, an AI assistant for SplitMint expense app. Extract expense details as JSON with keys: description (string), amount (number), payer (string, match to participant names: ${names}), splitMode ('equal'|'custom'|'percentage'), date (ISO string or null). Return ONLY valid JSON, no markdown.`
        : `You are MintSense, an AI assistant for SplitMint expense app. Summarize this group's activity based on the provided data. Return in 2-3 readable sentences.`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            { role: "system", "content": systemPrompt },
            { role: "user", "content": mode === "expense" ? input : JSON.stringify(group) }
          ],
          temperature: 0.2
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const text = data.choices[0].message.content;

      if (mode === "expense") {
        try {
          const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/) || [null, text];
          const rawJson = jsonMatch[1].trim();
          const parsed = JSON.parse(rawJson);
          if (onExtracted) onExtracted(parsed);
        } catch (e) {
          console.error("Failed to parse JSON", text);
        }
      } else {
        setResult(text);
      }
    } catch (e) {
      console.error(e);
      setResult("AI Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (mode === "summary") {
    return (
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 mb-6">
        <div className="flex items-center gap-2 mb-2 text-primary font-semibold">
          <Sparkles size={18} />
          <span>MintSense AI Summary</span>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="animate-spin" size={16} /> Generating...
          </div>
        ) : (
          <p className="text-gray-700">{result || "Click to generate a summary."}</p>
        )}
        {!loading && !result && (
          <button onClick={handleAI} className="mt-2 text-sm text-primary font-medium hover:underline">
            Generate Summary
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-primary/5 rounded-xl p-2 flex items-center gap-2 border border-primary/20 mb-6 shadow-sm">
      <div className="bg-primary/10 p-2 rounded-lg text-primary">
        <Sparkles size={20} />
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. Dinner with Rohan ₹800 split equally..."
        className="flex-grow bg-transparent border-none focus:ring-0 outline-none placeholder-gray-400 text-sm px-2 w-full"
        onKeyDown={(e) => e.key === 'Enter' && handleAI()}
      />
      <button
        onClick={handleAI}
        disabled={loading}
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : "Extract"}
      </button>
    </div>
  );
};

export default MintSenseBar;
