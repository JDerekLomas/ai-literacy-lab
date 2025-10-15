'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { clsx } from 'clsx';

interface Point {
  x: number;
  y: number;
}

interface Triangle {
  a: Point;
  b: Point;
  c: Point;
}

export const VisualDiscoveryAgent: React.FC = () => {
  const [triangle, setTriangle] = useState<Triangle>({
    a: { x: 100, y: 300 },
    b: { x: 400, y: 300 },
    c: { x: 400, y: 100 }
  });

  const [showSquares, setShowSquares] = useState(false);
  const [showCalculations, setShowCalculations] = useState(false);
  const [discoveryStep, setDiscoveryStep] = useState(0);
  const [studentReflection, setStudentReflection] = useState('');

  const calculateSideLength = useCallback((p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }, []);

  const getSideLengths = useCallback(() => {
    const sideA = calculateSideLength(triangle.b, triangle.c); // vertical side
    const sideB = calculateSideLength(triangle.a, triangle.b); // horizontal side
    const sideC = calculateSideLength(triangle.a, triangle.c); // hypotenuse
    return { sideA, sideB, sideC };
  }, [triangle, calculateSideLength]);

  const { sideA, sideB, sideC } = getSideLengths();
  const areaA = Math.round(sideA * sideA);
  const areaB = Math.round(sideB * sideB);
  const areaC = Math.round(sideC * sideC);

  const isRightTriangle = Math.abs((areaA + areaB) - areaC) < 5;

  const discoverySteps = [
    {
      title: "Explore the Triangle",
      instruction: "Drag the corners of this triangle to create different shapes. What do you notice?",
      hint: "Try making a triangle where one corner forms a perfect square angle."
    },
    {
      title: "Add the Squares",
      instruction: "Now let's add squares to each side. What do you see?",
      hint: "Each square's area equals the side length multiplied by itself (side²)."
    },
    {
      title: "Compare the Areas",
      instruction: "Look at the areas of the squares. Do you notice any patterns?",
      hint: "When you have a right triangle, there's a special relationship between these areas."
    },
    {
      title: "Discover the Pattern",
      instruction: "What happens when you add the areas of the two smaller squares?",
      hint: "Does their sum equal the area of the largest square?"
    }
  ];

  const guidedDiscovery = useCallback(() => {
    const responses = [
      "Excellent observation! You're discovering one of mathematics' most beautiful relationships.",
      "You're thinking like a mathematician! What patterns are you noticing?",
      "Great insight! This relationship has been fascinating people for thousands of years.",
      "Perfect! You've just discovered the Pythagorean theorem through visual exploration."
    ];

    return responses[Math.min(discoveryStep, responses.length - 1)];
  }, [discoveryStep]);

  const handleReflectionSubmit = useCallback(() => {
    if (studentReflection.trim()) {
      // In a real implementation, this would send to an AI agent for analysis
      console.log('Student reflection:', studentReflection);
      setStudentReflection('');

      if (discoveryStep < discoverySteps.length - 1) {
        setDiscoveryStep(prev => prev + 1);
      }
    }
  }, [studentReflection, discoveryStep, discoverySteps.length]);

  const dragHandler = useCallback((vertex: keyof Triangle) => {
    return (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setTriangle(prev => ({
        ...prev,
        [vertex]: { x, y }
      }));
    };
  }, []);

  useEffect(() => {
    if (discoveryStep >= 1) setShowSquares(true);
    if (discoveryStep >= 2) setShowCalculations(true);
  }, [discoveryStep]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Visual Discovery Agent
        </h1>
        <p className="text-gray-600">
          Discover the Pythagorean theorem through interactive exploration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-4">
            <svg
              width="500"
              height="400"
              className="border border-gray-300 rounded bg-white cursor-pointer"
            >
              {/* Grid */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Squares on sides (if enabled) */}
              {showSquares && (
                <>
                  {/* Square on side A (vertical) */}
                  <rect
                    x={triangle.c.x}
                    y={triangle.c.y}
                    width={sideA}
                    height={sideA}
                    fill="rgba(255, 99, 132, 0.3)"
                    stroke="rgba(255, 99, 132, 0.8)"
                    strokeWidth="2"
                  />

                  {/* Square on side B (horizontal) */}
                  <rect
                    x={triangle.a.x}
                    y={triangle.b.y}
                    width={sideB}
                    height={sideB}
                    fill="rgba(54, 162, 235, 0.3)"
                    stroke="rgba(54, 162, 235, 0.8)"
                    strokeWidth="2"
                  />

                  {/* Square on side C (hypotenuse) - positioned creatively */}
                  <rect
                    x={triangle.a.x - 50}
                    y={triangle.a.y - 50}
                    width={Math.sqrt(sideC * sideC / 2)}
                    height={Math.sqrt(sideC * sideC / 2)}
                    fill="rgba(75, 192, 192, 0.3)"
                    stroke="rgba(75, 192, 192, 0.8)"
                    strokeWidth="2"
                    transform={`rotate(${Math.atan2(triangle.c.y - triangle.a.y, triangle.c.x - triangle.a.x) * 180 / Math.PI} ${triangle.a.x} ${triangle.a.y})`}
                  />
                </>
              )}

              {/* Triangle */}
              <polygon
                points={`${triangle.a.x},${triangle.a.y} ${triangle.b.x},${triangle.b.y} ${triangle.c.x},${triangle.c.y}`}
                fill="rgba(255, 206, 84, 0.4)"
                stroke="#333"
                strokeWidth="3"
              />

              {/* Draggable vertices */}
              {Object.entries(triangle).map(([vertex, point]) => (
                <circle
                  key={vertex}
                  cx={point.x}
                  cy={point.y}
                  r="8"
                  fill="#4f46e5"
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-move hover:fill-indigo-600"
                  onMouseDown={dragHandler(vertex as keyof Triangle)}
                />
              ))}

              {/* Labels */}
              <text x={triangle.a.x - 20} y={triangle.a.y + 5} className="text-sm font-bold">A</text>
              <text x={triangle.b.x + 10} y={triangle.b.y + 5} className="text-sm font-bold">B</text>
              <text x={triangle.c.x + 10} y={triangle.c.y - 5} className="text-sm font-bold">C</text>

              {/* Right angle indicator */}
              {isRightTriangle && (
                <rect
                  x={triangle.b.x - 15}
                  y={triangle.b.y - 15}
                  width="15"
                  height="15"
                  fill="none"
                  stroke="#333"
                  strokeWidth="2"
                />
              )}
            </svg>

            {isRightTriangle && (
              <div className="mt-2 p-2 bg-green-100 text-green-800 rounded text-sm">
                ✓ You've created a right triangle! Perfect for discovering the theorem.
              </div>
            )}
          </div>
        </div>

        {/* Discovery Panel */}
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              Step {discoveryStep + 1}: {discoverySteps[discoveryStep]?.title}
            </h3>
            <p className="text-blue-700 text-sm mb-3">
              {discoverySteps[discoveryStep]?.instruction}
            </p>
            <p className="text-blue-600 text-xs italic">
              Hint: {discoverySteps[discoveryStep]?.hint}
            </p>
          </div>

          {showCalculations && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Measurements</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Side A²:</span>
                  <span className="font-mono">{areaA}</span>
                </div>
                <div className="flex justify-between">
                  <span>Side B²:</span>
                  <span className="font-mono">{areaB}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Side C²:</span>
                  <span className="font-mono">{areaC}</span>
                </div>
                {isRightTriangle && (
                  <div className="mt-2 p-2 bg-green-100 rounded text-green-700 text-xs">
                    A² + B² = {areaA} + {areaB} = {areaA + areaB} ≈ {areaC} = C²
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">Reflection</h3>
            <textarea
              value={studentReflection}
              onChange={(e) => setStudentReflection(e.target.value)}
              placeholder="What patterns do you notice? Share your observations..."
              className="w-full h-20 p-2 text-sm border border-purple-200 rounded focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleReflectionSubmit}
              disabled={!studentReflection.trim()}
              className={clsx(
                "mt-2 w-full py-1 px-3 text-sm rounded",
                studentReflection.trim()
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
            >
              Submit Reflection
            </button>
          </div>

          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-green-700 text-sm">
              {guidedDiscovery()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">AI Discovery Agent</h3>
        <p className="text-gray-600 text-sm">
          This agent guides students through visual discovery of mathematical relationships,
          adapting guidance based on student interactions and reflections to promote deep
          understanding and mathematical thinking.
        </p>
      </div>
    </div>
  );
};

export default VisualDiscoveryAgent;