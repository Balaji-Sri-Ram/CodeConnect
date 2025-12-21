import React, { useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
// Prism core
import Prism from 'prismjs';
// Essential languages - add more as needed
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup'; // for HTML/XML

// Custom theme
import '../styles/prism-custom-theme.css';

const CodeEditor = ({ code, setCode, language, placeholder, style, onKeyDown, disabled }) => {

    // Map internal language IDs/Names to Prism languages
    const getPrismLanguage = (langIdOrName) => {
        // Assuming langIdOrName comes from your system (e.g. "71" for python, or "python")
        // You might need to map your specific IDs here. 
        // For now, handling common names and potential IDs if known.

        const lower = String(langIdOrName).toLowerCase();

        if (lower === '71' || lower === 'python') return Prism.languages.python;
        if (lower === '54' || lower === '50' || lower === 'cpp' || lower === 'c++') return Prism.languages.cpp;
        if (lower === '62' || lower === 'java') return Prism.languages.java;
        if (lower === '63' || lower === 'javascript' || lower === 'js' || lower === 'node') return Prism.languages.javascript;
        if (lower === '51' || lower === 'csharp' || lower === 'cs') return Prism.languages.clike; // Simplification
        if (lower === 'admin') return Prism.languages.javascript; // Default workaround

        return Prism.languages.javascript; // Default fallback
    };

    const highlight = (code) => {
        const prismLang = getPrismLanguage(language);
        return Prism.highlight(code, prismLang || Prism.languages.javascript, language);
    };

    return (
        <Editor
            value={code}
            onValueChange={setCode}
            highlight={highlight}
            padding={10}
            textareaId="code-editor-textarea"
            className="font-mono"
            disabled={disabled}
            onKeyDown={onKeyDown}
            style={{
                fontFamily: style?.fontFamily || '"Fira Code", "Fira Mono", monospace',
                fontSize: style?.fontSize || 14,
                ...style,
                backgroundColor: 'transparent', // Let parent control bg
                minHeight: '100%',
            }}
            textareaClassName="focus:outline-none"
            placeholder={placeholder}
        />
    );
};

export default CodeEditor;
