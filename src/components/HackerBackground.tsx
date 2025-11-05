import { useEffect, useRef } from 'react';

interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
  characters: string[];
}

const HackerBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Create columns
    const matrixColumns: MatrixColumn[] = [];
    for (let i = 0; i < columns; i++) {
      matrixColumns.push({
        x: i * fontSize,
        y: Math.random() * canvas.height - canvas.height,
        speed: Math.random() * 2 + 1,
        characters: []
      });
      
      // Initialize characters for this column
      const charCount = Math.floor(Math.random() * 20) + 10;
      for (let j = 0; j < charCount; j++) {
        matrixColumns[i].characters.push(
          characters[Math.floor(Math.random() * characters.length)]
        );
      }
    }

    // Animation loop
    const animate = () => {
      // Fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      matrixColumns.forEach((column) => {
        column.characters.forEach((char, index) => {
          // Calculate opacity - brighter at the bottom of the trail
          const opacity = (index + 1) / column.characters.length;
          
          // Red color with varying opacity
          ctx.fillStyle = `rgba(239, 68, 68, ${opacity})`;
          ctx.font = `${fontSize}px monospace`;
          
          // Draw character
          const yPos = column.y + (index * fontSize);
          ctx.fillText(char, column.x, yPos);
          
          // Randomly change characters
          if (Math.random() > 0.95) {
            column.characters[index] = characters[Math.floor(Math.random() * characters.length)];
          }
        });

        // Update position
        column.y += column.speed;

        // Reset column if it goes off screen
        if (column.y - (column.characters.length * fontSize) > canvas.height) {
          column.y = -fontSize;
          column.speed = Math.random() * 2 + 1;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
};

export default HackerBackground;
