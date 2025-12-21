
import React, { useEffect, useMemo, useState } from 'react';

const CodeBackground = () => {
    const snippets = useMemo(() => [
        "if (true) { }",
        "for (let i=0; i<n; i++)",
        "while (current.next)",
        "return null;",
        "const stack = [];",
        "function dfs(node)",
        "map.set(key, val);",
        "head = head.next;",
        "array.push(item);",
        "import React from 'react';",
        "console.log('debug');",
        "await fetch(url);",
        "class Node { }",
        "this.val = val;",
        "root.left = null;",
        "int main() { }",
        "vector<int> v;",
        "p -> next = temp;",
        "x = x * 2;",
        "dp[i][j] = 0;",
        "Math.max(a, b);",
        "O(n log n)",
        "Binary Search",
    ], []);

    const [items, setItems] = useState([]);

    useEffect(() => {
        // Create random items with random positions and animation delays
        const newItems = new Array(30).fill(null).map((_, i) => ({
            id: i,
            text: snippets[Math.floor(Math.random() * snippets.length)],
            left: Math.random() * 100, // 0-100%
            top: Math.random() * 100, // 0-100%
            delay: Math.random() * 20, // 0-20s delay
            duration: 15 + Math.random() * 10, // 15-25s duration
            scale: 0.5 + Math.random() * 1.5, // 0.5x - 2x size
        }));
        setItems(newItems);
    }, [snippets]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="absolute whitespace-nowrap text-primary dark:text-white font-mono text-sm font-bold animate-code-fly"
                    style={{
                        left: `${item.left}%`,
                        top: `${item.top}%`,
                        animationDelay: `-${item.delay}s`, // Negative delay to start mid-animation
                        animationDuration: `${item.duration}s`,
                        fontSize: `${item.scale}rem`
                    }}
                >
                    {item.text}
                </div>
            ))}
        </div>
    );
};

export default CodeBackground;
