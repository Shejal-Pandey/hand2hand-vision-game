
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';

const Scanner = ({ onGestureUpdate }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [debugText, setDebugText] = useState("Initializing...");

    const gestureRecognizerRef = useRef(null);
    const animationFrameRef = useRef(null);
    const lastVideoTimeRef = useRef(-1);

    // Hardcoded connections for hand landmarks to avoid dependency on SDK constants
    const HAND_CONNECTIONS = [
        [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
        [0, 5], [5, 6], [6, 7], [7, 8], // Index
        [9, 10], [10, 11], [11, 12], // Middle (base at 9 connected to 5/13 implicitly or explicitly? - usually 5-9-13-17 are palm base)
        [13, 14], [14, 15], [15, 16], // Ring
        [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
        [5, 9], [9, 13], [13, 17] // Palm
    ];

    useEffect(() => {
        const createGestureRecognizer = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
                );

                gestureRecognizerRef.current = await GestureRecognizer.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 1
                });

                setLoading(false);
                setDebugText("Model Loaded");
                predictWebcam();
            } catch (error) {
                console.error("Error loading gesture recognizer:", error);
                setDebugText("Error Loading Model");
            }
        };

        createGestureRecognizer();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (gestureRecognizerRef.current) {
                gestureRecognizerRef.current.close();
            }
        };
    }, []);

    const drawHand = (ctx, landmarks) => {
        const connectionColor = '#00C2FF';
        const landmarkColor = '#FFFFFF';
        const lineWidth = 3;

        ctx.strokeStyle = connectionColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';

        // Draw connections
        for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
            // Ensure standard model topology (21 points)
            if (landmarks[startIdx] && landmarks[endIdx]) {
                const start = landmarks[startIdx];
                const end = landmarks[endIdx];

                ctx.beginPath();
                ctx.moveTo(start.x * ctx.canvas.width, start.y * ctx.canvas.height);
                ctx.lineTo(end.x * ctx.canvas.width, end.y * ctx.canvas.height);
                ctx.stroke();
            }
        }

        // Draw landmarks
        ctx.fillStyle = landmarkColor;
        for (const landmark of landmarks) {
            const x = landmark.x * ctx.canvas.width;
            const y = landmark.y * ctx.canvas.height;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
    };

    const predictWebcam = () => {
        const webcam = webcamRef.current;
        const canvas = canvasRef.current;
        const gestureRecognizer = gestureRecognizerRef.current;

        if (webcam && webcam.video && webcam.video.readyState === 4 && canvas && gestureRecognizer) {
            const video = webcam.video;
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            canvas.width = videoWidth;
            canvas.height = videoHeight;

            const canvasCtx = canvas.getContext('2d');
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height); // IMPORTANT: Clear previous frame

            let startTimeMs = performance.now();
            if (video.currentTime !== lastVideoTimeRef.current) {
                lastVideoTimeRef.current = video.currentTime;

                try {
                    const results = gestureRecognizer.recognizeForVideo(video, startTimeMs);

                    if (results.landmarks) {
                        for (const landmarks of results.landmarks) {
                            drawHand(canvasCtx, landmarks);
                        }
                    }

                    if (results.gestures.length > 0) {
                        const categoryName = results.gestures[0][0].categoryName;
                        const score = results.gestures[0][0].score;

                        // Map gestures
                        let gameGesture = 'None';
                        let displayName = 'None';

                        // Treat >0.4 as valid
                        if (score > 0.4) {
                            if (categoryName === 'Closed_Fist' || categoryName === 'Thumb_Up' || categoryName === 'Thumb_Down') {
                                gameGesture = 'Closed_Fist';
                                displayName = 'Stone';
                            } else if (categoryName === 'Open_Palm') {
                                gameGesture = 'Open_Palm';
                                displayName = 'Paper';
                            } else if (categoryName === 'Victory' || categoryName === 'Pointing_Up') {
                                gameGesture = 'Victory';
                                displayName = 'Scissor';
                            }

                            if (gameGesture !== 'None') {
                                setDebugText(`${displayName} (${(score * 100).toFixed(0)}%)`);
                                onGestureUpdate(gameGesture);
                            } else {
                                setDebugText(`Unknown (${(score * 100).toFixed(0)}%)`);
                                onGestureUpdate('None');
                            }
                        } else {
                            onGestureUpdate('None');
                        }
                    } else {
                        setDebugText("No Hand Detected");
                        onGestureUpdate('None');
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        } else {
            // If not ready, just loop
        }

        animationFrameRef.current = requestAnimationFrame(predictWebcam);
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden rounded-xl border border-blue-500/30">
            {loading && (
                <div className="absolute z-20 text-blue-400 animate-pulse text-xl font-bold tracking-widest flex flex-col items-center">
                    <div>INITIALIZING VISION PROTOCOLS...</div>
                </div>
            )}

            {/* Webcam is mirrored visually */}
            <Webcam
                ref={webcamRef}
                mirrored={true}
                className="absolute w-full h-full object-cover opacity-60"
                screenshotFormat="image/jpeg"
            />

            {/* Canvas must be mirrored to match the mirrored webcam */}
            <canvas
                ref={canvasRef}
                className="absolute w-full h-full object-cover z-10"
                style={{ transform: 'scaleX(-1)' }} // Mirror the canvas drawing
            />

            {/* Debug Overlay */}
            <div className="absolute top-2 right-2 bg-black/80 px-3 py-1 rounded text-xs text-green-400 font-mono border border-green-500/30 z-50">
                STATUS: {debugText}
            </div>
        </div>
    );
};

export default Scanner;
